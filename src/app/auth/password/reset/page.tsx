import React from "react";
import { RouteInterface } from "../../../../configuration/Route";
import AuthLayout from "../../../../layouts/auth/AuthLayout";
import Title from "../../../../widgets/Title";
import { observer } from "mobx-react-lite";
import {
    Column, Container, SizedBox, ActionButton, PasswordField,
    Text, Image, useDesign, Notify, useRedirect,
    useWidth, HorizontalLoader, LightTheme
} from "@serchservice/web-ui-kit";
import Assets from "../../../../assets/Assets";
import authStore from "../../../../backend/database/auth/AuthStore";
import AppTheme from "../../../../configuration/Theme";
import { useSearchParams } from "react-router-dom";
import Connect from "../../../../backend/api/Connect";
import { ConnectifyUtils } from "@serchservice/connectify";
import Auth from "../../../../backend/models/auth/Auth";
import AuthRouting from "../../../../configuration/AuthRouting";
import preferenceStore from "../../../../backend/database/device/PreferenceStore";

export const ResetPasswordRoute: RouteInterface = {
    path: "/auth/password/reset",
    pathView: ({name, emailAddress, token}) => `/auth/password/reset?name=${name}&emailAddress=${emailAddress}&token=${token}`,
    page: <ResetPasswordPage />,
}

export default function ResetPasswordPage() {
    return (
        <AuthLayout type="password-reset">
            <Title title='Reset Password' />
            <View />
        </AuthLayout>
    )
}

const View: React.FC = observer(() => {
    const [searchParams] = useSearchParams();
    const { isMobile,  } = useDesign()
    const width = useWidth()
    const redirect = useRedirect()

    const [name, setName] = React.useState<string | null>()
    const [emailAddress, setEmailAddress] = React.useState<string | null>()
    const [token, setToken] = React.useState<string | null>()
    const isMounted = React.useRef<boolean>(false);

    React.useEffect(() => {
        if (!isMounted.current) {
            const n = searchParams.get("name")
            const e = searchParams.get("emailAddress")
            const t = searchParams.get("token")

            setName(n)
            setEmailAddress(e)
            setToken(t)

            if(!t) {
                redirect(AuthRouting.instance.error.path)
            }

            isMounted.current = true;
        }
    }, [ searchParams ]);

    const connect = new Connect({ withAuth: false})

    const [password, setPassword] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    async function resetPassword() {
        if (isLoading) {
            return;
        } else {
            setIsLoading(true);

            const device = await ConnectifyUtils.getDevice();
            const address = await ConnectifyUtils.getCurrentAddress();
            const response = await connect.post("/auth/admin/password/reset", {
                token: token,
                password: password,
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
        }
    }

    if(token) {
        return (
            <React.Fragment>
                {isLoading && <HorizontalLoader isPlaying color={AppTheme.primary} />}
                <Column mainAxis={width <= 400 ? "flex-start" : "center"} crossAxisSize="max" crossAxis="center" mainAxisSize="max">
                    {width <= 400 && (<SizedBox height={20} />)}
                    <Container
                        padding="20px"
                        margin={width <= 400 ? "" : "0 10px"}
                        elevation={width <= 400 ? 0 : 4}
                        backgroundColor={preferenceStore.read.isLight ? AppTheme.secondary : LightTheme.appbarDark}
                        borderRadius={width <= 400 ? "" : "24px"}
                    >
                        <Image image={preferenceStore.read.isLight ? Assets.serch.logoBlack : Assets.serch.logoWhite} height={25} />
                        <SizedBox height={18} />
                        <Text
                            text={`Hi ${ name || "there"},`}
                            color={AppTheme.primary}
                            size={isMobile ? 16 : 18}
                        />
                        <Text
                            text={`Reset your password by creating a unique password for ${emailAddress ?? "your email"}`}
                            color={AppTheme.hint}
                        />
                        <SizedBox height={50} />
                        <form onSubmit={resetPassword}>
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
                            <ActionButton
                                padding="8px 24px"
                                backgroundColor={AppTheme.appbarLight}
                                fontSize={14}
                                onClick={resetPassword}
                                title="Reset password"
                            />
                        </form>
                    </Container>
                </Column>
            </React.Fragment>
        )
    } else {
        return (<HorizontalLoader isPlaying color={AppTheme.primary} />)
    }
})