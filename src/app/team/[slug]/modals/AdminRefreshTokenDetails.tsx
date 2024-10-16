import { ActionButton, Column, Container, DrawerDialog, Notify, Padding, Row, SimpleStep, SizedBox, Spacer, Text } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import Connect from "../../../../backend/api/Connect";
import AccountRefreshTokenResponse from "../../../../backend/models/account/AccountRefreshTokenResponse";
import AccountSessionResponse from "../../../../backend/models/account/AccountSessionResponse";
import { AdminProfile } from "../../../../backend/models/profile/AdminProfile";
import AppTheme from "../../../../configuration/Theme";
import TimeUtils from "../../../../utils/TimeUtils";
import Utils from "../../../../utils/Utils";
import { AdminSessionViewProps } from "./AdminSessionDetails";

interface RefreshTokenProps {
    token: AccountRefreshTokenResponse;
    session: AccountSessionResponse;
    admin: AdminProfile;
    width: number;
    onSessionUpdated: (session: AccountSessionResponse[]) => void
}

const AdminRefreshTokenDetails: React.FC<RefreshTokenProps> = observer(({ token, session, admin, width, onSessionUpdated }) => {
    const [isOpen, setIsOpen] = React.useState(false)

    return (
        <React.Fragment>
            <Container backgroundColor={ isOpen ? AppTheme.hover : AppTheme.background} width="100%" borderRadius="10px" padding="12px">
                <Text text={token.token} size={14} color={AppTheme.primary} flow="ellipsis" />
                    <SizedBox height={4} />
                    <Text text={TimeUtils.day(token.createdAt)} size={12} color={AppTheme.primary} flow="ellipsis" />
                <SizedBox height={10} />
                <Text text={`${token.refreshTokens.length}`} color={AppTheme.primary} size={28} />
                <SizedBox height={10} />
                <Row crossAxis="center">
                    <Container padding="6px 6px 4px" backgroundColor={token.revoked ? AppTheme.error : AppTheme.success} borderRadius="10px">
                        <Text text={token.revoked ? "INACTIVE" : "ACTIVE"} color='#fff' size={11} />
                    </Container>
                    <Spacer />
                    {((token.refreshTokens && token.refreshTokens.length > 0) || !token.revoked) && (
                        <Container padding="6px 6px 4px" backgroundColor={AppTheme.background} borderRadius="24px" onClick={() => setIsOpen(true)} hoverBackgroundColor={AppTheme.hover}>
                            <Text text="View details" color={AppTheme.hint} size={11} />
                        </Container>
                    )}
                </Row>
            </Container>
            <AdminRefreshTokenView
                token={token}
                session={session}
                admin={admin}
                isOpen={isOpen}
                width={width - 50}
                handleClose={() => setIsOpen(false)}
                onSessionUpdated={onSessionUpdated}
            />
        </React.Fragment>
    )
})

interface RefreshTokenViewProps extends AdminSessionViewProps {
    token: AccountRefreshTokenResponse;
    width: number;
}

const AdminRefreshTokenView: React.FC<RefreshTokenViewProps> = observer(({
    token,
    session,
    admin,
    isOpen,
    handleClose,
    width,
    onSessionUpdated
}) => {
    const [isRevoking, setIsRevoking] = React.useState(false)

    const connect = new Connect({})

    async function handleRevoke() {
        if(isRevoking) {
            return;
        } else {
            setIsRevoking(true)
            const response = await connect.patch(`/scope/auth/session/refresh/revoke?id=${token.id}`)
            setIsRevoking(false)

            if(response) {
                if(response.isSuccess) {
                    if(Array.isArray(response.data)) {
                        onSessionUpdated(response.data.map((s) => AccountSessionResponse.fromJson(s)))
                    }
                    Notify.success(response.message)
                    handleClose()
                } else {
                    Notify.error(response.message)
                }
            }
        }
    }

    const steps = [
        {
            title: "Time of Creation",
            value: token.createdAt
        },
        {
            title: "Last time of update",
            value: token.updatedAt
        }
    ]

    const details = [
        {
            title: "Token",
            value: token.token
        },
        {
            title: "Identifier",
            value: token.id
        },
        {
            title: "Revoked",
            value: token.revoked ? "TRUE" : "FALSE"
        }
    ]

    const buildList = () => {
        if(token.refreshTokens && token.refreshTokens.length > 0) {
            return (
                <React.Fragment>
                    {token.refreshTokens.map((child, index) => (
                        <AdminRefreshTokenDetails
                            key={index}
                            width={width}
                            token={child}
                            session={session}
                            admin={admin}
                            onSessionUpdated={onSessionUpdated}
                        />
                    ))}
                </React.Fragment>
            )
        } else {
            return (
                <Container height={300} width ="100%">
                    <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center">
                        <Text text={`${admin.name} has no refresh token for ${token.id}`} color={AppTheme.hint} size={16} opacity={8} />
                    </Column>
                </Container>
            )
        }
    }

    return (
        <DrawerDialog isOpen={isOpen} handleClose={handleClose} position="right" bgColor={AppTheme.appbar} width={width}>
            <Column>
                <Container padding="18px" backgroundColor={AppTheme.background}>
                    <Text text={`Refresh Token: ${token.id}`} color={AppTheme.primary} size={16} />
                    <SizedBox height={10} />
                    <Row crossAxis="center">
                        <Container padding="6px 6px 4px" backgroundColor={session.revoked ? AppTheme.error : AppTheme.success} borderRadius="10px">
                            <Text text={token.revoked ? "INACTIVE" : "ACTIVE"} color='#fff' size={10} />
                        </Container>
                    </Row>
                </Container>
                <Padding all={16}>
                    <Column crossAxis="flex-start" style={{gap: "20px"}}>
                        <Container width="100%">
                            <Text text="Token Timeline" size={12} color={AppTheme.hint} />
                            <SizedBox height={12} />
                            {steps.map((step, index) => {
                                return (
                                    <SimpleStep
                                        key={index}
                                        content={
                                            <Padding only={{top: 3}}>
                                                <Row mainAxisSize="max" crossAxis="center" style={{width: "100%"}}>
                                                    <Text text={`${step.title}:`} size={14} color={AppTheme.primary} />
                                                    <Spacer />
                                                    <Text text={TimeUtils.day(step.value)} size={14} color={AppTheme.primary} />
                                                </Row>
                                            </Padding>
                                        }
                                        height={10}
                                        color={AppTheme.hint}
                                        showBottom={steps.length - 1 !== index}
                                    />
                                )
                            })}
                        </Container>
                        <Container height={2} width="100%" backgroundColor={AppTheme.background} />
                        <Container width="100%">
                            <Text text="Token Information" size={12} color={AppTheme.hint} />
                            <SizedBox height={12} />
                            {details.map((step, index) => {
                                const color = (step.value && step.value.toLowerCase() === "true")
                                    ? AppTheme.success
                                    : (step.value && step.value.toLowerCase() === "false")
                                    ? AppTheme.error
                                    : AppTheme.primary

                                return (
                                    <SimpleStep
                                        key={index}
                                        content={
                                            <Padding only={{top: 3}}>
                                                <Row mainAxisSize="max" crossAxis="center" style={{width: "100%"}}>
                                                    <Text text={`${step.title}:`} size={14} color={AppTheme.primary} />
                                                    <Spacer />
                                                    <Text text={Utils.clearRole(step.value)} size={14} color={color} />
                                                </Row>
                                            </Padding>
                                        }
                                        height={10}
                                        color={AppTheme.hint}
                                        showBottom={steps.length - 1 !== index}
                                    />
                                )
                            })}
                        </Container>
                        {!token.revoked && (
                            <ActionButton
                                padding="8px 12px"
                                backgroundColor={AppTheme.error}
                                color="#fff"
                                fontSize={14}
                                borderRadius="10px"
                                onClick={handleRevoke}
                                useLoader={isRevoking}
                                state={isRevoking}
                                title="Revoke token"
                            />
                        )}
                        <Container height={2} width="100%" backgroundColor={AppTheme.background} />
                        <Text text="Refresh Tokens" size={12} color={AppTheme.hint} />
                        {buildList()}
                    </Column>
                </Padding>
            </Column>
        </DrawerDialog>
    )
})

export default AdminRefreshTokenDetails