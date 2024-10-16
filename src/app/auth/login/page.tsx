import {
    ActionButton, Column, Field, Image, Notify, OtpField, Padding,
    PasswordField, SizedBox, Text, useDesign, useRedirect
} from "@serchservice/web-ui-kit";
import { RouteInterface } from "../../../configuration/Route";
import AuthLayout from "../../../layouts/auth/AuthLayout";
import Assets from "../../../assets/Assets";
import AppTheme from "../../../configuration/Theme";
import authStore from "../../../backend/database/auth/AuthStore";
import adminStore from "../../../backend/database/auth/AdminStore";
import React from "react";
import { observer } from "mobx-react-lite";
import Connect from "../../../backend/api/Connect";
import Auth from "../../../backend/models/auth/Auth";
import { AdminAction } from "../../../utils/Enums";
import { ConnectifyUtils } from "@serchservice/connectify";
import AuthRouting from "../../../configuration/AuthRouting";
import Title from "../../../widgets/Title";
import Utils from "../../../utils/Utils";

export const LoginRoute: RouteInterface = {
    path: "/auth/login",
    page: <LoginPage />,
}

export default function LoginPage() {
    return (
        <AuthLayout type="login">
            <Title title='Login' />
            <View />
        </AuthLayout>
    )
}

const View: React.FC = observer(() => {
    const { isMobile } = useDesign();
    const redirect = useRedirect()

    const connect = new Connect({ withAuth: false })

    const [emailAddress, setEmailAddress] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [token, setToken] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [isResending, setIsResending] = React.useState<boolean>(false);
    const [isWaiting, setIsWaiting] = React.useState<boolean>(false);

    async function login() {
        if (isLoading) {
            return;
        } else {
            if (isWaiting) {
                confirm();
            } else {
                authenticate();
            }
        }
    }

    async function authenticate() {
        setIsLoading(true);
        const response = await connect.post("/auth/admin/login", {
            email_address: emailAddress,
            password: password
        })
        setIsLoading(false);
        if (response) {
            if (response.isSuccess) {
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
                action: AdminAction.LOGIN,
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
                <Image
                    image={adminStore.read.profile.avatar || Assets.auth.administrator}
                    height={isMobile ? 35 : 55}
                    style={{
                        borderRadius: "50%",
                        backgroundColor: AppTheme.appbarDark,
                        padding: "6px"
                    }}
                />
                <SizedBox height={18} />
                <Text
                    text={`Hello ${ authStore.read.firstName || "there"},`}
                    color={AppTheme.primary}
                    size={isMobile ? 16 : 18}
                />
                <Text text="Welcome back, a lot has happened while you were away" color={AppTheme.hint} />
                <SizedBox height={50} />
                <form>
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
                        color={AppTheme.primary}
                        labelColor={AppTheme.primary}
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
                                backgroundColor: AppTheme.secondary
                            }}
                            resendStyle={{color: AppTheme.primary}}
                            labelStyle={{ fontSize: isMobile ? "14px" : "16px", color: AppTheme.primary }}
                        />
                    )}
                    <ActionButton
                        padding="10px 36px"
                        backgroundColor={AppTheme.appbarLight}
                        fontSize={14}
                        onClick={login}
                        useLoader={isLoading}
                        state={isLoading}
                        title={isWaiting ? "Verify login" : "Login"}
                    />
                </form>
            </Padding>
        </Column>
    )
})