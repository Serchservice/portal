import { Icon } from "@iconify/react/dist/iconify.js";
import {
    Column, Container, DrawerDialog, ExtraButton, Image, ModalProps,
    Padding, Row, SimpleStep, SizedBox, Spacer, Text, Utility
} from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import { CommonProfile } from "../backend/models/profile/CommonProfile";
import { RouteConfig } from "../configuration/Route";
import AppTheme from "../configuration/Theme";
import TimeUtils from "../utils/TimeUtils";
import Utils from "../utils/Utils";

export interface CommonProfileViewProps extends ModalProps {
    profile: CommonProfile | undefined;
}

const CommonProfileView: React.FC<CommonProfileViewProps> = observer(({ profile, isOpen, handleClose }) => {
    if(profile) {
        return (<View profile={profile} isOpen={isOpen} handleClose={handleClose} />);
    } else {
        return (<></>)
    }
})

interface ViewProps extends ModalProps {
    profile: CommonProfile;
}

const View: React.FC<ViewProps> = observer(({ profile, isOpen, handleClose }) => {
    const timeline = [
        profile.createdAt && {
            title: "Time of Creation",
            value: profile.createdAt
        },
        profile.updatedAt && {
            title: "Last time of update",
            value: profile.updatedAt
        }
    ]

    const details = [
        profile.id && {
            title: "Identifier",
            value: profile.id
        },
        profile.firstName && {
            title: "First Name",
            value: profile.firstName
        },
        profile.lastName && {
            title: "Last Name",
            value: profile.lastName
        },
        profile.emailAddress && {
            title: "Email Address",
            value: profile.emailAddress
        },
        profile.role && {
            title: "Role",
            value: profile.role
        },
        profile.category && {
            title: "Category",
            value: profile.category
        },
        profile.status && {
            title: "Account Status",
            value: profile.status
        },
    ]

    return (
        <DrawerDialog isOpen={isOpen} handleClose={handleClose} position="right" bgColor={AppTheme.appbar} width={400}>
            <Column>
                <Container padding="12px" width="100%" backgroundColor={AppTheme.background}>
                    <Row crossAxisSize="min" style={{gap: "8px"}}>
                        <ExtraButton
                            icon="solar:arrow-left-line-duotone"
                            color={AppTheme.primary}
                            title=""
                            iconSize={1}
                            fontSize="14px"
                            borderRadius="50%"
                            rootStyle={{ width: "auto", minWidth: "auto" }}
                            padding="6px"
                            onClick={() => handleClose()}
                            hoverColor={AppTheme.hover}
                            iconStyle={{margin: "0"}}
                        />
                        <Image image={profile.avatar || Utility.DEFAULT_IMAGE} height={30} style={{ borderRadius: "50%" }}/>
                        <Column mainAxisSize="min" crossAxisSize="max" crossAxis="flex-start" style={{gap: "2px"}}>
                            <Text text={profile.name} size={14} color={AppTheme.primary} />
                            <Text text={profile.emailAddress || profile.role} size={12} color={AppTheme.primary} />
                        </Column>
                    </Row>
                </Container>
                <Padding all={16}>
                    <Column crossAxis="flex-start" gap="20px">
                        <Container width="100%">
                            <Text text="Account Timeline" size={12} color={AppTheme.hint} />
                            <SizedBox height={12} />
                            {timeline.map((step, index) => {
                                if(step !== "") {
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
                                            showBottom={timeline.length - 1 !== index}
                                        />
                                    )
                                } else {
                                    return (<React.Fragment key={index}></React.Fragment>)
                                }
                            })}
                        </Container>
                        <Container height={2} width="100%" backgroundColor={AppTheme.background} />
                        <Container width="100%">
                            <Text text="Account Information" size={12} color={AppTheme.hint} />
                            <SizedBox height={12} />
                            {details.map((step, index) => {
                                if(step !== "") {
                                    const color = (step.value && step.value.toLowerCase() === "ACTIVE")
                                        ? AppTheme.success
                                        : (step.value && step.value.toLowerCase() === "SUSPENDED")
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
                                            showBottom={timeline.length - 1 !== index}
                                        />
                                    )
                                } else {
                                    return (<React.Fragment key={index}></React.Fragment>)
                                }
                            })}
                        </Container>
                        <Container height={2} width="100%" backgroundColor={AppTheme.background} />
                        <Row>
                            <Container borderRadius="6px" backgroundColor={AppTheme.background} padding="5px" link={RouteConfig.getAccountRoute(profile.role, profile.id)}>
                                <Row crossAxis="center" crossAxisSize="min" mainAxisSize="min" gap="10px">
                                    <Text text="View detailed profile" size={12} color={AppTheme.primary} />
                                    <Icon icon="fluent:open-20-filled" width="1em" height="1em" style={{color: AppTheme.primary}} />
                                </Row>
                            </Container>
                        </Row>
                    </Column>
                </Padding>
            </Column>
        </DrawerDialog>
    )
})

export default CommonProfileView;