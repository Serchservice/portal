import { Column, Container, ExtraButton, Field, Image, Notify, Row, SizedBox, StyledMenu, Text, Utility } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import Assets from "../../../../../assets/Assets";
import Connect from "../../../../../backend/api/Connect";
import { PermissionAccountSearchResponse } from "../../../../../backend/models/permission/PermissionAccountSearchResponse";
import AppTheme from "../../../../../configuration/Theme";
import { PermissionType } from "../../../../../utils/Enums";
import Utils from "../../../../../utils/Utils";
import permissionStore from "../../../../../backend/database/device/PermissionStore";
import { PermissionScopeResponse } from "../../../../../backend/models/permission/PermissionScopeResponse";

interface PermissionScopeSelectorProps {
    type: PermissionType | undefined;
    scope: string | undefined;
    specificScope: string | undefined;
    onScopeUpdated: (scope: string) => void;
    onSpecificScopeUpdated: (scope: string) => void;
}

const PermissionScopeSelector: React.FC<PermissionScopeSelectorProps> = observer(({
    type,
    scope,
    specificScope,
    onScopeUpdated,
    onSpecificScopeUpdated
}) => {
    const isCluster = type === PermissionType.CLUSTER;
    const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);
    const [id, setId] = React.useState<string>()
    const [isVerified, setIsVerified] = React.useState(false)
    const [isVerifying, setIsVerifying] = React.useState(false)
    const [account, setAccount] = React.useState<PermissionAccountSearchResponse>();

    const options: PermissionScopeResponse[] = permissionStore.read;

    const close = () => {
        setAnchor(null);
    };

    const [calculatedWidth, setCalculatedWidth] = React.useState(50);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (contentRef.current) {
            const { width } = contentRef.current.getBoundingClientRect();
            setCalculatedWidth(width);
        }
    }, []);

    const connect = new Connect({})

    async function verify() {
        if(id) {
            if(isVerifying || isVerified) {
                return
            } else {
                setIsVerifying(true)
                const response = await connect.get<PermissionAccountSearchResponse>(`/admin/permission/search?id=${id}`)
                if(response) {
                    if(response.data && response.isSuccess) {
                        setIsVerifying(false)
                        setIsVerified(true);
                        setAccount(response.data)
                        onScopeUpdated(response.data.id)
                    } else {
                        setIsVerifying(false)
                        setIsVerified(false)
                        Notify.error(response.message)
                    }
                }
            }
        }
    }

    const renderAvatar = (): JSX.Element => {
        if(account && account.avatar) {
            return (
                <Image
                    image={account.avatar}
                    height={32}
                    style={{
                        borderRadius: "50%",
                        backgroundColor: AppTheme.appbarDark,
                        padding: "1px"
                    }}
                />
            )
        } else {
            return (
                <Image
                    image={Assets.auth.administrator}
                    height={32}
                    style={{
                        borderRadius: "50%",
                        backgroundColor: AppTheme.appbarDark,
                        padding: "1px"
                    }}
                />
            )
        }
    }

    const title = isCluster ? "Select permission scope you're looking for" : "Type the user id for specific permission"

    return (
        <Column mainAxisSize="min" crossAxisSize="min" style={{margin: "0 12px 12px"}}>
            <Text text={title} color={AppTheme.hint} />
            <SizedBox height={10} />
            <div ref={contentRef}>
                <Row mainAxisSize="max" crossAxisSize="min" mainAxis="flex-start">
                    <Row>
                        <Field
                            type="text"
                            isRequired={true}
                            placeHolder=""
                            value={isCluster && scope ? Utility.capitalizeFirstLetter(scope) : scope}
                            fontSize={14}
                            onChange={e => {
                                if(!isCluster) {
                                    setId(e)

                                    if(scope !== e) {
                                        setIsVerified(false)
                                    }
                                }
                            }}
                            borderRadius={8}
                            needSpacer={false}
                            isDisabled={isCluster}
                            backgroundColor={AppTheme.appbar}
                            color={AppTheme.primary}
                            labelColor={AppTheme.primary}
                        />
                    </Row>
                    <SizedBox width={10} />
                    <ExtraButton
                        icon={isCluster ? "ep:arrow-right" : isVerifying ? "svg-spinners:pulse-multiple" : isVerified ? "duo-icons:approved" : "duo-icons:alert-triangle"}
                        open={Boolean(anchor)}
                        title=""
                        iconSize={1.3}
                        borderRadius="50%"
                        tip={isCluster ? "" : isVerifying ? "Verifying" : isVerified ? "Verified" : "Click to verify id"}
                        color={isVerifying ? AppTheme.pending : isVerified ? AppTheme.success : AppTheme.hint}
                        onClick={event => isCluster ? setAnchor(event.currentTarget) : verify()}
                        rootStyle={{ width: "auto", minWidth: "auto" }}
                        padding="4px"
                        hoverColor={AppTheme.hover}
                        iconStyle={{
                            margin: "0",
                            transform: !isCluster ? "none" : anchor ? 'rotate(-90deg)' : 'rotate(90deg)',
                            transition: "all 0.5s"
                        }}
                    />
                </Row>
            </div>
            <StyledMenu anchorEl={anchor} isOpen={Boolean(anchor)} onClose={close} backgroundColor={AppTheme.appbar}>
                {options && options.map((option, index) => {
                    const isCurrent = scope === option.scope;

                    return (
                        <Container
                            key={index}
                            padding="10px"
                            width={calculatedWidth}
                            style={{ borderBottom: options.length - 1 !== index ? `1px solid ${AppTheme.hint}` : "" }}
                            backgroundColor={isCurrent ? AppTheme.primary : "transparent"}
                            onClick={() => {
                                close();
                                onScopeUpdated(option.scope)
                            }}
                            hoverBackgroundColor={isCurrent ? AppTheme.primary : AppTheme.hover}
                        >
                            <Text text={Utils.clearRole(Utility.capitalizeFirstLetter(option.name))} color={AppTheme.hint} />
                        </Container>
                    )
                })}
            </StyledMenu>
            {(account && !isCluster && scope) && (
                <Container padding="10px" borderRadius="6px" margin="20px 0 0 0" backgroundColor={AppTheme.primaryLight}>
                    <Row mainAxisSize="max" crossAxisSize="min" crossAxis="center">
                        {renderAvatar()}
                        <SizedBox width={10} />
                        <Column>
                            <Text text={account.name} size={14} color={AppTheme.primary} />
                            <Text text={Utils.clearRole(account.role)} size={11} color={AppTheme.hint} />
                        </Column>
                    </Row>
                    {(account.scopes && account.scopes.length > 0) && (
                        <React.Fragment>
                            <SizedBox height={20} />
                            <Text
                                text="Available Scopes (If none is selected, it is assumed that you want all)"
                                color={AppTheme.hint}
                                size={11}
                            />
                            <SizedBox height={10} />
                            <SizedBox height={10} />
                            {account.scopes.map((specific, index) => {
                                const isSelected = specificScope === specific;

                                return (
                                    <Container
                                        key={index}
                                        padding="10px"
                                        borderRadius="6px"
                                        hoverBackgroundColor={isSelected ? AppTheme.primary : AppTheme.hover}
                                        margin={index !== account.scopes.length - 1 ? "0 0 10px 0" : ""}
                                        onClick={() => onSpecificScopeUpdated(specific)}
                                        backgroundColor={isSelected ? AppTheme.primary : AppTheme.secondary}
                                    >
                                        <Text
                                            text={Utils.clearRole(Utility.capitalizeFirstLetter(specific))}
                                            size={12}
                                            color={isSelected ? AppTheme.secondary : AppTheme.primary}
                                        />
                                    </Container>
                                )
                            })}
                        </React.Fragment>
                    )}
                </Container>
            )}
        </Column>
    )
})

export default PermissionScopeSelector