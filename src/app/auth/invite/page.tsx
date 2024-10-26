import {
    ActionButton, Column, Container, HorizontalLoader, Image, LightTheme, Notify,
    PasswordField, SizedBox, Text, useDesign, useRedirect, useWidth
} from "@serchservice/web-ui-kit"
import { RouteInterface } from "../../../configuration/Route"
import AuthLayout from "../../../layouts/auth/AuthLayout"
import { ConnectifyUtils } from "@serchservice/connectify"
import { observer } from "mobx-react-lite"
import React from "react"
import { useSearchParams } from "react-router-dom"
import Assets from "../../../assets/Assets"
import Connect from "../../../backend/api/Connect"
import authStore from "../../../backend/database/auth/AuthStore"
import Auth from "../../../backend/models/auth/Auth"
import AuthRouting from "../../../configuration/AuthRouting"
import AppTheme from "../../../configuration/Theme"
import Title from "../../../widgets/Title"
import preferenceStore from "../../../backend/database/device/PreferenceStore"

export default function InviteRoute(): RouteInterface {
    return {
        path: "/auth/invite",
        pathView: ({name, token}) => `/auth/invite?name=${name}&token=${token}`,
        page: (
            <AuthLayout type="invite">
                <Title title='Account Setup' description="Finish your admin account setup to start doing big things" />
                <View />
            </AuthLayout>
        ),
    }
}

const View: React.FC = observer(() => {
    const [searchParams] = useSearchParams();
    const { isMobile,  } = useDesign()
    const width = useWidth()
    const redirect = useRedirect()

    const [name, setName] = React.useState<string | null>()
    const [token, setToken] = React.useState<string | null>()
    const isMounted = React.useRef<boolean>(false);

    React.useEffect(() => {
        if (!isMounted.current) {
            const n = searchParams.get("name")
            const t = searchParams.get("token")

            setName(n)
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

    async function setup() {
        if (isLoading) {
            return;
        } else {
            setIsLoading(true);

            const device = await ConnectifyUtils.getDevice();
            const address = await ConnectifyUtils.getCurrentAddress();
            const response = await connect.post("/auth/admin/invite/setup", {
                secret: token,
                password: password,
                state: address.state,
                country: address.country,
                device: device.toJson()
            });

            setIsLoading(false);
            if(response) {
                if (response.isSuccess) {
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
                        backgroundColor={preferenceStore.read.isLight ? LightTheme.secondary : LightTheme.appbarDark}
                        borderRadius={width <= 400 ? "" : "24px"}
                    >
                        <Image image={preferenceStore.read.isLight ? Assets.serch.logoBlack : Assets.serch.logoWhite} height={25} />
                        <SizedBox height={18} />
                        <Text
                            text={`Hello ${ name || "admin"},`}
                            color={AppTheme.primary}
                            size={isMobile ? 16 : 18}
                        />
                        <Text
                            text="Finish your admin account setup by creating your unique password"
                            color={AppTheme.hint}
                        />
                        <SizedBox height={50} />
                        <form onSubmit={setup}>
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
                                onClick={setup}
                                title="Finish setup"
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