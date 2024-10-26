import {
    ActionButton, Column, Container, DrawerDialog, ModalProps,
    Notify, Padding, Row, SimpleStep, SizedBox, Spacer, Text, Utility
} from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import Connect from "../../../../backend/api/Connect";
import AccountSessionResponse from "../../../../backend/models/account/AccountSessionResponse";
import { AdminProfile } from "../../../../backend/models/profile/AdminProfile";
import AppTheme from "../../../../configuration/Theme";
import TimeUtils from "../../../../utils/TimeUtils";
import Utils from "../../../../utils/Utils";
import AdminRefreshTokenDetails from "./AdminRefreshTokenDetails";

export interface AdminSessionViewProps extends ModalProps {
    session: AccountSessionResponse;
    admin: AdminProfile;
    onSessionUpdated: (session: AccountSessionResponse[]) => void
}

const parentWidth = 800

const AdminSessionDetails: React.FC<AdminSessionViewProps> = observer(({ session, admin, isOpen, handleClose, onSessionUpdated }) => {
    const [isRevoking, setIsRevoking] = React.useState(false)

    const connect = new Connect({})

    async function handleRevoke() {
        if(isRevoking) {
            return;
        } else {
            setIsRevoking(true)
            const response = await connect.patch(`/scope/auth/session/revoke?id=${session.id}`)
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
            value: session.createdAt
        },
        {
            title: "Last time of update",
            value: session.updatedAt
        }
    ]

    const details = [
        {
            title: "Identifier",
            value: session.id
        },
        {
            title: "Platform",
            value: session.platform
        },
        {
            title: "IP Address",
            value: session.ipAddress
        },
        {
            title: "Authentication Method",
            value: session.method
        },
        {
            title: "Authentication Level",
            value: session.level
        },
        {
            title: "Operating System",
            value: session.os
        },
        {
            title: "Operating System Version",
            value: session.osv
        },
        {
            title: "Revoked",
            value: session.revoked ? "TRUE" : "FALSE"
        }
    ]

    const deviceInformation = [
        {
            title: "Device Name",
            value: session.device
        },
        {
            title: "Device Host",
            value: session.host
        },
    ]

    const buildList = () => {
        if(session.refreshTokens && session.refreshTokens.length > 0) {
            return (
                <React.Fragment>
                    {session.refreshTokens.map((token, index) => (
                        <AdminRefreshTokenDetails
                            key={index}
                            width={parentWidth}
                            token={token}
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
                        <Text text={`${admin.name} has no refresh token for ${session.id}`} color={AppTheme.hint} size={16} opacity={8} />
                    </Column>
                </Container>
            )
        }
    }

    return (
        <DrawerDialog isOpen={isOpen} handleClose={handleClose} position="right" bgColor={AppTheme.appbar} width={parentWidth}>
            <Column>
                <Container padding="18px" backgroundColor={AppTheme.background}>
                    <Text text={`Session: ${session.id}`} color={AppTheme.primary} size={16} />
                    <SizedBox height={10} />
                    <Row crossAxis="center">
                        <Column>
                            {session.name && (<Text text={session.name} color={AppTheme.primary} size={14} />)}
                            {session.platform && (<SizedBox height={5} />)}
                            <Text text={Utility.capitalizeFirstLetter(session.platform)} color={AppTheme.primary} size={14} />
                        </Column>
                        <Spacer />
                        <Container padding="6px 6px 4px" backgroundColor={session.revoked ? AppTheme.error : AppTheme.success} borderRadius="10px">
                            <Text text={session.revoked ? "INACTIVE" : "ACTIVE"} color='#fff' size={10} />
                        </Container>
                    </Row>
                </Container>
                <Padding all={16}>
                    <Column crossAxis="flex-start" gap="20px">
                        <Container width="100%">
                            <Text text="Session Timeline" size={12} color={AppTheme.hint} />
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
                            <Text text="Session Information" size={12} color={AppTheme.hint} />
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
                                        showBottom={details.length - 1 !== index}
                                    />
                                )
                            })}
                        </Container>
                        {!session.revoked && (
                            <ActionButton
                                padding="8px 12px"
                                backgroundColor={AppTheme.error}
                                color="#fff"
                                fontSize={14}
                                borderRadius="10px"
                                onClick={handleRevoke}
                                useLoader={isRevoking}
                                state={isRevoking}
                                title="Revoke session"
                            />
                        )}
                        <Container height={2} width="100%" backgroundColor={AppTheme.background} />
                        <Container width="100%">
                            <Text text="Device Information" size={12} color={AppTheme.hint} />
                            <SizedBox height={12} />
                            {deviceInformation.map((info, index) => {
                                return (
                                    <Container
                                        key={index}
                                        backgroundColor="#1e201e"
                                        padding="6px"
                                        borderRadius="10px"
                                        margin={deviceInformation.length - 1 !== index ? "0 0 10px 0" : ""}
                                    >
                                        <Text text={`${info.title}:`} size={14} color={AppTheme.primary} />
                                        <SizedBox height={6} />
                                        <Text text={Utils.clearRole(info.value)} size={14} color={AppTheme.primary} />
                                    </Container>
                                )
                            })}
                        </Container>
                        <Container height={2} width="100%" backgroundColor={AppTheme.background} />
                        <Text text="Refresh Tokens" size={12} color={AppTheme.hint} />
                        {buildList()}
                    </Column>
                </Padding>
            </Column>
        </DrawerDialog>
    )
})

export default AdminSessionDetails;