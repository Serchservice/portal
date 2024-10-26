import { Icon } from "@iconify/react/dist/iconify.js";
import { Column, Container, DrawerDialog, ModalProps, Padding, Row, SimpleStep, SizedBox, Spacer, Text } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import AccountMFAChallengeResponse from "../../../../backend/models/account/AccountMFAChallengeResponse";
import AppTheme from "../../../../configuration/Theme";
import TimeUtils from "../../../../utils/TimeUtils";
import Utils from "../../../../utils/Utils";

interface ChallengeModalProps extends ModalProps {
    challenge: AccountMFAChallengeResponse;
}

const AdminChallengeDetails: React.FC<ChallengeModalProps> = observer(({ challenge, isOpen, handleClose }) => {
    const steps = [
        {
            title: "Time of Creation",
            value: challenge.createdAt
        },
        {
            title: "Time of Verification",
            value: challenge.verifiedAt
        },
        {
            title: "Last time of update",
            value: challenge.updatedAt
        }
    ]

    const details = [
        {
            title: "Identifier",
            value: challenge.id
        },
        {
            title: "Platform",
            value: challenge.platform
        },
        {
            title: "IP Address",
            value: challenge.ipAddress
        },
        {
            title: "Operating System",
            value: challenge.os
        },
        {
            title: "Operating System Version",
            value: challenge.osv
        }
    ]

    const deviceInformation = [
        {
            title: "Device Name",
            value: challenge.device
        },
        {
            title: "Device Host",
            value: challenge.host
        },
        {
            title: "Device LocalHost",
            value: challenge.localHost
        },
    ]

    return (
        <DrawerDialog isOpen={isOpen} handleClose={handleClose} position="bottom" bgColor={AppTheme.appbar} width={450}>
            <Column>
                <Container padding="18px" backgroundColor={AppTheme.background}>
                    <Row crossAxis="center">
                        <Text text={`Challenge Identifier: ${challenge.id}`} color={AppTheme.primary} size={16} />
                        <Spacer />
                        <Icon
                            icon={challenge.verifiedAt ? "solar:verified-check-bold-duotone" : "solar:verified-check-bold-duotone"}
                            height="2.4em"
                            width="2.4em"
                            color={ challenge.verifiedAt ? AppTheme.success : AppTheme.error}
                        />
                    </Row>
                </Container>
                <Padding all={16}>
                <Column crossAxis="flex-start" gap="20px">
                        <Container width="100%">
                            <Text text="Challenge Timeline" size={12} color={AppTheme.hint} />
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
                            <Text text="Challenge Information" size={12} color={AppTheme.hint} />
                            <SizedBox height={12} />
                            {details.map((step, index) => {
                                return (
                                    <SimpleStep
                                        key={index}
                                        content={
                                            <Padding only={{top: 3}}>
                                                <Row mainAxisSize="max" crossAxis="center" style={{width: "100%"}}>
                                                    <Text text={`${step.title}:`} size={14} color={AppTheme.primary} />
                                                    <Spacer />
                                                    <Text text={Utils.clearRole(step.value)} size={14} color={AppTheme.primary} />
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
                    </Column>
                </Padding>
            </Column>
        </DrawerDialog>
    )
})

export default AdminChallengeDetails