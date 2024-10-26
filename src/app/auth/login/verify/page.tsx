import React from "react";
import { RouteInterface } from "../../../../configuration/Route";
import AuthLayout from "../../../../layouts/auth/AuthLayout";
import Title from "../../../../widgets/Title";
import { observer } from "mobx-react-lite";
import {
    useDesign, useRedirect, Column,
    Image,
    Text,
    SizedBox,
    ActionButton,
    OtpField,
    Container,
    Notify,
    HorizontalLoader
} from "@serchservice/web-ui-kit";
import Assets from "../../../../assets/Assets";
import authStore from "../../../../backend/database/auth/AuthStore";
import AppTheme from "../../../../configuration/Theme";
import Connect from "../../../../backend/api/Connect";
import { ConfirmAuthMode } from "../../../../utils/Enums";
import { ConnectifyUtils } from "@serchservice/connectify";
import Auth from "../../../../backend/models/auth/Auth";
import Routing from "../../../../configuration/Routing";
import preferenceStore from "../../../../backend/database/device/PreferenceStore";

export default function VerifyLoginRoute(): RouteInterface {
    return {
        path: "/auth/login/verify",
        page: (
            <AuthLayout type="login-verify">
                <Title title="Identity Verification" description="Verify yourself with Multi-Factor Authentication" />
                <View />
            </AuthLayout>
        ),
    }
}

const View: React.FC = observer(() => {
    const { isMobile } = useDesign();
    const redirect = useRedirect()

    const connect = new Connect({})

    const options = [
        {
            title: "Recovery code",
            description: "Verify your identity with your two-factor recovery code.",
            mode: ConfirmAuthMode.RECOVERY
        },
        {
            title: "Authenticator app",
            description: "Use the code from your authenticator app for verification.",
            mode: ConfirmAuthMode.MFA
        }
    ]

    const [mode, setMode] = React.useState<ConfirmAuthMode>(ConfirmAuthMode.MFA)
    const [token, setToken] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    async function verify(code?: string) {
        if (token === '' && !code) {
            Notify.error("Two-Factor authentication is required");
            return;
        } else {
            setIsLoading(true);
            const device = await ConnectifyUtils.getDevice();
            if (mode === ConfirmAuthMode.MFA) {
                const response = await connect.post("/auth/mfa/verify/code", {
                    code: code ?? token,
                    device: device.toJson()
                });
                setIsLoading(false);
                if(response) {
                    if (response.isSuccess) {
                        Notify.success(response.message);
                        authStore.set(Auth.fromJson(response.data));
                        redirect(Routing.instance.home.path);
                    } else {
                        Notify.error(response.message);
                    }
                }
            } else {
                const response = await connect.post("/auth/mfa/recovery/code/verify", {
                    code: code ?? token,
                    device: device.toJson()
                });
                setIsLoading(false);
                if(response) {
                    if (response.isSuccess) {
                        Notify.success(response.message);
                        authStore.set(Auth.fromJson(response.data));
                        redirect(Routing.instance.home.path);
                    } else {
                        Notify.error(response.message);
                    }
                }
            }
        }
    };

    return (
        <Column mainAxis={isMobile ? "flex-start" : "center"} crossAxisSize="min" crossAxis="flex-start" mainAxisSize="max">
            <Container elevation={4} backgroundColor={AppTheme.secondary} borderRadius={isMobile ? "" : "24px"}>
                {isLoading && <HorizontalLoader isPlaying color={AppTheme.primary} />}
                <Container padding="20px">
                    <Image image={preferenceStore.read.isLight ? Assets.serch.logoBlack : Assets.serch.logoWhite} height={25} />
                    <SizedBox height={18} />
                    <Text
                        text={`Hi ${ authStore.read.firstName || "there"},`}
                        color={AppTheme.primary}
                        size={isMobile ? 16 : 18}
                    />
                    <Text text="Verify your identity with two-factor authentication" color={AppTheme.hint} />
                    <SizedBox height={50} />
                    {options.map((option, index) => {
                        const isSelected = mode === option.mode;

                        return (
                            <Container
                                key={index}
                                padding="10px"
                                borderRadius="6px"
                                margin={index !== options.length - 1 ? "0 0 10px 0" : ""}
                                onClick={() => setMode(option.mode)}
                                backgroundColor={isSelected ? AppTheme.primary : AppTheme.primaryLight}
                            >
                                <Text text={option.title} size={14} color={isSelected ? AppTheme.secondary : AppTheme.primary} />
                                <SizedBox height={10} />
                                <Text text={option.description} size={12} color={AppTheme.hint} />
                            </Container>
                        )
                    })}
                    <SizedBox height={50} />
                    <form>
                        <OtpField
                            header="Verify yourself with code sent to your mailbox"
                            onOtpSubmit={code => {
                                setToken(code)
                                verify(code)
                            }}
                            showResend={false}
                            inputStyle={{
                                fontSize: isMobile ? "14px" : "16px",
                                width: isMobile ? "40px" : "50px",
                                height: isMobile ? "40px" : "50px",
                                color: AppTheme.primary,
                                backgroundColor: AppTheme.secondary
                            }}
                            labelStyle={{ fontSize: isMobile ? "14px" : "16px", color: AppTheme.primary }}
                        />
                        <ActionButton
                            padding="8px 24px"
                            backgroundColor={AppTheme.appbarLight}
                            fontSize={14}
                            onClick={() => verify()}
                            title="Verify"
                        />
                    </form>
                </Container>
            </Container>
        </Column>
    )
})