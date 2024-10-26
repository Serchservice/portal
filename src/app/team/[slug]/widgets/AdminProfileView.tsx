import { ActionButton, Column, Container, Field, Notify, Padding, Row, SimpleStep, SizedBox, Spacer, Text } from "@serchservice/web-ui-kit";
import { Popup } from "@serchservice/web-ui-kit/build/src/utilities/Notify";
import { observer } from "mobx-react-lite";
import React from "react";
import Connect from "../../../../backend/api/Connect";
import AppTheme from "../../../../configuration/Theme";
import { AdminInterface } from "../page";

const AdminProfileView: React.FC<AdminInterface> = observer(({ admin, onAdminUpdated }) => {
    const connect = new Connect({})

    const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false)
    const [isUpdateProfile, setIsUpdateProfile] = React.useState(false)

    const [firstName, setFirstName] = React.useState<string>()
    const [lastName, setLastName] = React.useState<string>()

    const handleChangeProfile = async () => {
        if(isUpdatingProfile) {
            return
        } else if(!isUpdateProfile) {
            setIsUpdateProfile(true)
            Notify.info("You can now edit your profile", 6000, Popup.BOTTOMLEFT)
            return
        } else if((firstName && firstName === admin.profile.firstName) && (lastName && lastName === admin.profile.lastName)) {
            Notify.info("No changes detected", 6000, Popup.BOTTOMLEFT)
            return
        } else if(!firstName && !lastName) {
            Notify.info("No changes detected", 6000, Popup.BOTTOMLEFT)
            return
        } else {
            setIsUpdatingProfile(true);
            const response = await connect.patch<string>(`/scope/admin/profile/update?id=${admin.profile.id}`, {
                firstName: firstName,
                lastName: lastName
            });
            setIsUpdatingProfile(false);
            if (response) {
                if (response.isSuccess) {
                    onAdminUpdated(admin.copyWith({profile: admin.profile.copyWith({ firstName: firstName, lastName: lastName })}))

                    setFirstName(undefined)
                    setLastName(undefined)
                    Notify.success(response.message);
                    setIsUpdateProfile(false)
                    Notify.info("Profile editing is now locked", 6000, Popup.BOTTOMLEFT)
                } else {
                    Notify.error(response.message);
                }
            }
        }
    }

    const steps = [
        {
            title: "Email Confirmation",
            value: admin.profile.emailConfirmedAt
        },
        {
            title: "Account Creation",
            value: admin.profile.accountCreatedAt
        },
        {
            title: "Profile Creation",
            value: admin.profile.profileCreatedAt
        },
        {
            title: "Last Profile Update",
            value: admin.profile.profileUpdatedAt
        },
        {
            title: "Last Account Update",
            value: admin.profile.accountUpdatedAt
        },
        {
            title: "Last Signed In",
            value: admin.profile.lastSignedIn
        }
    ]

    const buildProfile = () => (
        <Container backgroundColor={AppTheme.appbar} padding="16px" width="100%" borderRadius="8px" height="auto">
            <Column crossAxis="flex-start" mainAxis="flex-start" crossAxisSize="max">
                <Text text="Profile" size={15} color={AppTheme.primary} />
                <SizedBox height={10} />
                <Field
                    needLabel
                    backgroundColor={AppTheme.appbar}
                    color={AppTheme.primary}
                    label="First Name"
                    value={firstName ?? admin.profile.firstName}
                    fontSize={14}
                    onChange={v => setFirstName(v)}
                    labelColor={AppTheme.primary}
                    isDisabled={!isUpdateProfile}
                />
                <Field
                    needLabel
                    backgroundColor={AppTheme.appbar}
                    color={AppTheme.primary}
                    label="Last Name"
                    value={lastName ?? admin.profile.lastName}
                    fontSize={14}
                    onChange={v => setLastName(v)}
                    labelColor={AppTheme.primary}
                    isDisabled={!isUpdateProfile}
                />
                <Field
                    type="email"
                    label="Email Address"
                    isRequired={false}
                    isDisabled
                    value={admin.profile.emailAddress}
                    fontSize={14}
                    backgroundColor={AppTheme.appbar}
                    labelColor={AppTheme.primary}
                    color={AppTheme.primary}
                />
                <SizedBox height={30} />
                <ActionButton
                    padding="8px 12px"
                    backgroundColor={AppTheme.background}
                    color={AppTheme.primary}
                    fontSize={14}
                    borderRadius="10px"
                    onClick={handleChangeProfile}
                    useLoader={isUpdatingProfile}
                    state={isUpdatingProfile}
                    title={!isUpdateProfile ? "Unlock to update profile" : "Save changes"}
                />
            </Column>
        </Container>
    )

    const buildTimeline = () => (
        <Container backgroundColor={AppTheme.appbar} padding="16px" width="100%" borderRadius="8px" height="auto">
            <Column crossAxis="flex-start" mainAxis="flex-start" crossAxisSize="min">
                <Text text="Profile Timeline" size={15} color={AppTheme.primary} />
                <SizedBox height={20} />
                <Container width="100%">
                    {steps.map((step, index) => {
                        return (
                            <SimpleStep
                                key={index}
                                content={
                                    <Padding only={{top: 3}}>
                                        <Row mainAxisSize="max" crossAxis="center" style={{width: "100%"}}>
                                            <Text text={`${step.title}:`} size={14} color={AppTheme.primary} />
                                            <Spacer />
                                            <Text text={step.value} size={14} color={step.value.toLowerCase() === "online" ? AppTheme.success : AppTheme.primary} />
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
            </Column>
        </Container>
    )

    return (
        <Row mainAxisSize="max" crossAxis="flex-start" gap="10px">
            {buildTimeline()}
            {buildProfile()}
        </Row>
    )
})

export default AdminProfileView