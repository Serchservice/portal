import { observer } from "mobx-react-lite";
import React from "react";
import supportStore from "../../../backend/database/device/SupportStore";
import ComplaintResponse from "../../../backend/models/support/ComplaintResponse";
import {
    BackdropLoader, Column, Container, ExtraButton, Notify, Row, SearchBar, Shimmer, SizedBox, Spacer, StyledMenu, Text, Utility
} from "@serchservice/web-ui-kit";
import Connect from "../../../backend/api/Connect";
import AppTheme from "../../../configuration/Theme";
import preferenceStore from "../../../backend/database/device/PreferenceStore";
import Utils from "../../../utils/Utils";
import ComplaintScopeResponse from "../../../backend/models/support/ComplaintScopeResponse";
import TimeUtils from "../../../utils/TimeUtils";
import CommonProfileView from "../../../modals/CommonProfileView";
import useRouteUpdate from "../../../configuration/hooks/useRouteUpdate";

interface ComplaintChatViewProps {
    onComplaintsUpdated: (update: ComplaintScopeResponse[]) => void;
}

const ComplaintChatView: React.FC<ComplaintChatViewProps> = observer(({ onComplaintsUpdated }) => {
    const { openComplaint, handleOpenComplaint, handleCloseComplaint } = useRouteUpdate()
    const [isLoading, setIsLoading] = React.useState(false)

    const connect = new Connect({});

    React.useEffect(() => {
        const saved = supportStore.read.emailAddress;
        const complaint = supportStore.read.complaint;
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("from");

        if((saved === complaint.emailAddress || token === complaint.emailAddress) && complaint.emailAddress !== "") {
            handleOpenComplaint(complaint)
        } else if((token && token !== "") || (saved && saved !== "")) {
            async function fetchChat() {
                const id = token || saved

                setIsLoading(true);
                const response = await connect.get(`/scope/support/complaint?emailAddress=${id}`);
                setIsLoading(false);
                if (response) {
                    if (response.isSuccess) {
                        if (response.data) {
                            handleOpenComplaint(ComplaintScopeResponse.fromJson(response.data));
                        }
                    } else {
                        Notify.error(response.message);
                        handleCloseComplaint()
                    }
                }
            }

            fetchChat()
        }
    }, [supportStore.read.emailAddress, supportStore.read.complaint, location.search])

    const handleSendUpdate = (updates: ComplaintScopeResponse[]) => {
        const current = updates.find(item => item.emailAddress === openComplaint?.emailAddress)
        if (current) {
            handleOpenComplaint(current)
        }

        onComplaintsUpdated(updates)
    }

    const dimmed = preferenceStore.read.isDark;
    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);

    const buildHeader = () => {
        if(isLoading) {
            return (
                <Container backgroundColor={AppTheme.appbar} width="100%" borderRadius="16px 16px 0 0" padding="8px">
                    <Row style={{gap: "8px", padding: "2px"}}>
                        <Shimmer dimmed={dimmed} height={20} width={20} type="circular" />
                        <Shimmer dimmed={dimmed} height={40} width={40} type="circular" />
                        <Column mainAxisSize="min" crossAxisSize="max" crossAxis="flex-start" style={{gap: "2px"}}>
                            <Shimmer dimmed={dimmed} height={14} width={200} radius={6} />
                            <Shimmer dimmed={dimmed} height={12} width={300} radius={6} />
                        </Column>
                        <Spacer />
                        <Row crossAxis="center" mainAxisSize="min" style={{gap: "8px"}}>
                            <Shimmer dimmed={dimmed} height={12} width={70} radius={6} />
                            <Shimmer dimmed={dimmed} height={20} width={20} type="circular" />
                        </Row>
                    </Row>
                </Container>
            )
        } else if(!openComplaint || !openComplaint?.emailAddress) {
            return (<></>)
        } else {
            const more = [
                {
                    title: "Copy email address",
                    onClick: () => Utility.copy(openComplaint.emailAddress),
                    color: AppTheme.primary
                }
            ]

            return (
                <Container backgroundColor={AppTheme.appbar} width="100%" borderRadius="16px 16px 0 0" padding="8px">
                    <Row style={{gap: "8px", padding: "2px"}}>
                        <ExtraButton
                            icon="solar:arrow-left-line-duotone"
                            color={AppTheme.primary}
                            title=""
                            iconSize={1}
                            fontSize="14px"
                            borderRadius="50%"
                            rootStyle={{ width: "auto", minWidth: "auto" }}
                            padding="6px"
                            onClick={() => handleCloseComplaint()}
                            hoverColor={AppTheme.hover}
                            iconStyle={{margin: "0"}}
                        />
                        <Column mainAxisSize="min" crossAxisSize="max" crossAxis="flex-start" style={{gap: "2px"}}>
                            <Text text={openComplaint.name} size={14} color={AppTheme.primary} />
                            <Text text={openComplaint.emailAddress} size={12} color={AppTheme.primary} />
                        </Column>
                        <Spacer />
                        <Row crossAxis="center" mainAxisSize="min" style={{gap: "8px"}}>
                            <ExtraButton
                                icon="gg:details-more"
                                color={AppTheme.primary}
                                title=""
                                iconSize={1}
                                fontSize="14px"
                                borderRadius="50%"
                                rootStyle={{ width: "auto", minWidth: "auto" }}
                                padding="6px"
                                onClick={e => setAnchor(e.currentTarget)}
                                hoverColor={AppTheme.hover}
                                iconStyle={{margin: "0"}}
                            />
                        </Row>
                        <StyledMenu anchorEl={anchor} backgroundColor={AppTheme.appbar} isOpen={Boolean(anchor)} onClose={() => setAnchor(undefined)}>
                            {more.map((option, index) => {
                                if(option) {
                                    return (
                                        <Container
                                            key={index}
                                            padding="10px"
                                            onClick={() => {
                                                option.onClick()
                                                setAnchor(undefined)
                                            }}
                                            hoverBackgroundColor={AppTheme.hover}
                                            backgroundColor={"transparent"}
                                        >
                                            <Text text={option.title} size={12} color={option.color} />
                                        </Container>
                                    )
                                } else {
                                    return (<SizedBox key={index} height={0} />)
                                }
                            })}
                        </StyledMenu>
                    </Row>
                </Container>
            )
        }
    }

    const buildView = () => {
        if(isLoading) {
            return (
                <Column></Column>
            )
        } else if(!openComplaint || !openComplaint?.emailAddress) {
            return (<></>)
        } else {
            return (<View onComplaintsUpdated={handleSendUpdate} />)
        }
    }

    return (
        <React.Fragment>
            <Column mainAxisSize="max" crossAxisSize="max" crossAxis="flex-start">
                {buildHeader()}
                {buildView()}
            </Column>
        </React.Fragment>
    )
})

const View: React.FC<ComplaintChatViewProps> = observer(({ onComplaintsUpdated }) => {
    const openComplaint = supportStore.read.complaint;

    const [list, setList] = React.useState<ComplaintResponse[]>(openComplaint.complaints || []);
    const handleSearch = React.useCallback((results: ComplaintResponse[]) => {
        setList(results);
    }, []);

    return (
        <Column mainAxisSize="max" crossAxisSize="max" style={{ overflow: "scroll" }}>
            <Column mainAxisSize="max" crossAxisSize="max" style={{gap: "8px", padding: "8px", height: "300px"}}>
                <SearchBar
                    onSearch={handleSearch}
                    list={openComplaint.complaints}
                    placeholder="Search dates, ids, messages..."
                    backgroundColor={AppTheme.appbar}
                    inputStyle={{fontSize: "14px", backgroundColor: "transparent"}}
                    boxStyle={{borderRadius: "24px"}}
                    textColor={AppTheme.primary}
                    textFocusedColor={AppTheme.hint}
                    textUnfocusedColor={AppTheme.appbar}
                    parentStyle={{margin: "0", padding: "0"}}
                />
                {list.map((complaint, key) => (<Complaint complaint={complaint} key={key} onComplaintsUpdated={onComplaintsUpdated} />))}
            </Column>
        </Column>
    );
});

interface ComplaintProps extends ComplaintChatViewProps {
    complaint: ComplaintResponse;
}

const Complaint: React.FC<ComplaintProps> = observer(({ complaint, onComplaintsUpdated }) => {
    const [isResolving, setIsResolving] = React.useState(false);

    const connect = new Connect({})
    const handleResolve = async () => {
        setIsResolving(true)
        const response = await connect.patch(`/scope/support/complaint/resolve?id=${complaint.id}`)
        setIsResolving(false)
        if (response) {
            if (response.isSuccess) {
                if (response.data) {
                    if (Array.isArray(response.data)) {
                        onComplaintsUpdated(response.data.map(data => ComplaintScopeResponse.fromJson(data)))
                    }
                }
                Notify.success(response.message)
            } else {
                Notify.error(response.message)
            }
        }
    };

    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);
    const [isAdminOpen, setIsAdminOpen] = React.useState(false);

    const more = [
        {
            title: "Copy complaint id",
            onClick: () => Utility.copy(complaint.id),
            color: AppTheme.primary
        },
        complaint.isOpen && {
            title: "Mark as resolved",
            onClick: () => handleResolve(),
            color: AppTheme.success
        },
        complaint.admin && {
            title: "View tagged admin",
            onClick: () => setIsAdminOpen(true),
            color: AppTheme.primary
        },
    ]

    return (
        <React.Fragment>
            <Container
                padding="8px"
                margin="0 8px 0 0"
                borderRadius="12px"
                width="100%"
                backgroundColor={Utility.lightenColor(Utils.supportIconInfo(complaint.status).color, 50)}
            >
                <Row style={{gap: "8px", padding: "2px"}}>
                    <Column mainAxisSize="min" crossAxisSize="max" crossAxis="flex-start" style={{gap: "2px"}}>
                        <Text text={complaint.id} size={14} color="#050404" />
                        <Text text={TimeUtils.day(complaint.createdAt)} size={12} color="#050404" />
                    </Column>
                    <Spacer />
                    <Text text={complaint.status} size={11} color={Utils.supportIconInfo(complaint.status).color} />
                    <Row crossAxis="center" mainAxisSize="min" style={{gap: "8px"}}>
                        <ExtraButton
                            icon="si:more-vert-fill"
                            color="#050404"
                            title=""
                            iconSize={1}
                            fontSize="14px"
                            borderRadius="50%"
                            rootStyle={{ width: "auto", minWidth: "auto" }}
                            padding="6px"
                            onClick={e => setAnchor(e.currentTarget)}
                            hoverColor={AppTheme.hover}
                            iconStyle={{margin: "0"}}
                        />
                    </Row>
                    <StyledMenu anchorEl={anchor} backgroundColor={AppTheme.appbar} isOpen={Boolean(anchor)} onClose={() => setAnchor(undefined)}>
                        {more.map((option, index) => {
                            if(option) {
                                return (
                                    <Container
                                        key={index}
                                        padding="10px"
                                        onClick={() => {
                                            option.onClick()
                                            setAnchor(undefined)
                                        }}
                                        hoverBackgroundColor={AppTheme.hover}
                                        backgroundColor={"transparent"}
                                    >
                                        <Text text={option.title} size={12} color={option.color} />
                                    </Container>
                                )
                            } else {
                                return (<SizedBox key={index} height={0} />)
                            }
                        })}
                    </StyledMenu>
                </Row>
                <SizedBox height={20} />
                <Text text={complaint.comment} size={14} color="#050404" />
            </Container>
            <BackdropLoader open={isResolving} color={AppTheme.primary} />
            <CommonProfileView isOpen={isAdminOpen} handleClose={() => setIsAdminOpen(false)} profile={complaint.admin} />
        </React.Fragment>
    )
})

export default ComplaintChatView