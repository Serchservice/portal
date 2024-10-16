import {
    ActionButton, Column, Container, Field, Notify, OtpField,
    Padding, PasswordField, SizedBox, Text, useDesign, useRedirect
} from "@serchservice/web-ui-kit";
import { RouteInterface } from "../../../configuration/Route";
import AuthLayout from "../../../layouts/auth/AuthLayout";
import { ConnectifyUtils } from "@serchservice/connectify";
import { observer } from "mobx-react-lite";
import React from "react";
import Connect from "../../../backend/api/Connect";
import authStore from "../../../backend/database/auth/AuthStore";
import Auth from "../../../backend/models/auth/Auth";
import AuthRouting from "../../../configuration/AuthRouting";
import AppTheme from "../../../configuration/Theme";
import { AdminAction } from "../../../utils/Enums";
import Utils from "../../../utils/Utils";
import Title from "../../../widgets/Title";
import mfaSetupStore from "../../../backend/database/auth/MFASetupStore";
import MFASetup from "../../../backend/models/auth/MFASetup";

export const SignupRoute: RouteInterface = {
    path: "/auth/signup",
    page: <SignupPage />,
}

export default function SignupPage() {
    return (
        <AuthLayout type="signup">
            <Title title='Login' />
            <View />
        </AuthLayout>
    )
}

const View: React.FC = observer(() => {
    const { isMobile } = useDesign();
    const redirect = useRedirect()

    const connect = new Connect({ withAuth: false })

    const [firstName, setFirstName] = React.useState<string>("");
    const [lastName, setLastName] = React.useState<string>("");
    const [emailAddress, setEmailAddress] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [token, setToken] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isResending, setIsResending] = React.useState<boolean>(false);
    const [isWaiting, setIsWaiting] = React.useState<boolean>(false);

    async function handleClick() {
        if (isLoading) {
            return;
        } else {
            if (isWaiting) {
                confirm();
            } else {
                signup();
            }
        }
    }

    async function signup() {
        setIsLoading(true);
        const response = await connect.post("/auth/admin/super/signup", {
            first_name: firstName,
            last_name: lastName,
            email_address: emailAddress,
            password: password
        });
        setIsLoading(false);
        if (response) {
            if (response.isSuccess) {
                mfaSetupStore.set(MFASetup.fromJson(response.data))
                setIsWaiting(true);
                Notify.success(response.message);
            } else {
                Notify.error(response.message);
            }
        }
    }

    async function resend() {
        if (isResending) {
            return;
        } else {
            setIsResending(true);
            const response = await connect.get(`/auth/admin/resend?emailAddress=${emailAddress}`);
            setIsResending(false);
            if(response) {
                if (response.isSuccess) {
                    Notify.success(response.message);
                } else {
                    Notify.error(response.message);
                }
            }
        }
    }

    async function confirm(code?: string) {
        setIsLoading(true);
        try {
            const device = await ConnectifyUtils.getDevice();
            const address = await ConnectifyUtils.getCurrentAddress();

            const response = await connect.post("/auth/admin/confirm", {
                token: code ?? token,
                action: AdminAction.SUPER_SIGNUP,
                email_address: emailAddress,
                state: address.state,
                country: address.country,
                device: device.toJson()
            });
            setIsLoading(false);
            if(response) {
                if (response.isOk) {
                    Notify.success(response.message, 2000);
                    authStore.set(Auth.fromJson(response.data));
                    redirect(AuthRouting.instance.verifyLogin.path);
                } else if (response.isCreated) {
                    Notify.success(response.message);
                    authStore.set(Auth.fromJson(response.data));
                    redirect(AuthRouting.instance.mfa.path);
                } else {
                    Notify.error(response.message);
                }
            }
        } catch (err) {
            setIsLoading(false);
            Utils.showError(err);
        }
    }

    return (
        <Column mainAxis={isMobile ? "flex-start" : "center"} crossAxis="flex-start" mainAxisSize="max">
            <Padding all={20}>
                <Text text="Hello Super Admin," color={AppTheme.primary} size={isMobile ? 16 : 18} />
                <Text text="You have a lot of work to do for us!" color={AppTheme.hint} />
                <SizedBox height={50} />
                <form>
                    <Container width="100%" style={{flexDirection: isMobile ? "column" : "row", display: "flex"}}>
                        <Container width={isMobile? "100%" : "48%"}>
                            <Field
                                needLabel
                                backgroundColor={AppTheme.secondary}
                                color={AppTheme.primary}
                                label="First Name"
                                placeHolder="Enter your first name"
                                value={firstName}
                                fontSize={isMobile ? 14 : 16}
                                onChange={v => setFirstName(v)}
                                labelColor={AppTheme.primary}
                            />
                        </Container>
                        <Container width="4%" />
                        <Container width={isMobile? "100%" : "48%"}>
                            <Field
                                needLabel
                                backgroundColor={AppTheme.secondary}
                                color={AppTheme.primary}
                                label="Last Name"
                                placeHolder="Enter your last name"
                                value={lastName}
                                fontSize={isMobile ? 14 : 16}
                                onChange={v => setLastName(v)}
                                labelColor={AppTheme.primary}
                            />
                        </Container>
                    </Container>
                    <Field
                        type="email"
                        label="Email Address"
                        isRequired={true}
                        placeHolder="johndoe@serchservice.com"
                        autoComplete="email"
                        value={emailAddress}
                        fontSize={isMobile ? 14 : 16}
                        onChange={e => setEmailAddress(e)}
                        backgroundColor={AppTheme.secondary}
                        labelColor={AppTheme.primary}
                        color={AppTheme.primary}
                    />
                    <PasswordField
                        onPasswordEntered={setPassword}
                        header="Password"
                        inputStyle={{
                            fontSize: isMobile ? "14px" : "16px",
                            color: AppTheme.primary,
                            backgroundColor: AppTheme.secondary
                        }}
                        labelStyle={{ fontSize: isMobile ? "14px" : "16px", color: AppTheme.primary }}
                        color={AppTheme.primary}
                    />
                    {isWaiting && (
                        <OtpField
                            header="Verify yourself with code sent to your mailbox"
                            isResending={isResending}
                            resend={resend}
                            onOtpSubmit={code => {
                                setToken(code)
                                confirm(code)
                            }}
                            inputStyle={{
                                fontSize: isMobile ? "14px" : "16px",
                                color: AppTheme.primary,
                                width: isMobile ? "40px" : "50px",
                                height: isMobile ? "40px" : "50px",
                                backgroundColor: AppTheme.secondary
                            }}
                            resendStyle={{color: AppTheme.primary}}
                            labelStyle={{ fontSize: isMobile ? "14px" : "16px", color: AppTheme.primary }}
                        />
                    )}
                    <ActionButton
                        padding="10px 16px"
                        backgroundColor={AppTheme.appbarLight}
                        fontSize={14}
                        onClick={handleClick}
                        useLoader={isLoading}
                        state={isLoading}
                        title={isWaiting ? "Verify signup" : "Create account"}
                    />
                </form>
            </Padding>
        </Column>
    )
})