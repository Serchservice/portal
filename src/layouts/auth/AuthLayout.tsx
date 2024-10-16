import { Column, Container, Image, Responsive, Row, SizedBox, useDesign } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react"
import AppTheme from "../../configuration/Theme";
import Assets from "../../assets/Assets";
import adminStore from "../../backend/database/auth/AdminStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import preferenceStore from "../../backend/database/device/PreferenceStore";

interface AuthLayoutProps {
    children?: React.ReactNode;
    type: "login" | "signup" | "invite" | "invite-verify" | "login-verify" | "mfa" | "password" | "password-reset"
}

const AuthLayout: React.FC<AuthLayoutProps> = observer(({ children, type = "login" }) => {
    const { isMobile } = useDesign()

    const render = (): JSX.Element => {
        if(type === "login") {
            return (
                <Container height="100vh" width="100%" backgroundColor={AppTheme.background}>
                    <Responsive
                        phone={
                            <Column mainAxisSize="max">
                                <Container backgroundColor={AppTheme.primary} width="100%" padding="20px">
                                    <Image image={Assets.serch.logoWhite} width={60} objectFit="contain" />
                                </Container>
                                <SizedBox height={20} />
                                {children}
                            </Column>
                        }
                    >
                        <Row mainAxisSize="max" crossAxisSize="max">
                            {children}
                            <Column mainAxis="center" crossAxis="center" mainAxisSize="max">
                                <Container height="100%" width="100%" backgroundColor="none" style={{
                                    backgroundImage: `url(${Assets.auth.login})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover'
                                }}>
                                    <Column mainAxis="center" crossAxis="center" mainAxisSize="max">
                                        <Image image={Assets.serch.logoWhite} width={160} objectFit="contain" />
                                        <Container height="3px" width={100} backgroundColor={AppTheme.appbarDark} />
                                    </Column>
                                </Container>
                            </Column>
                        </Row>
                    </Responsive>
                </Container>
            )
        } else if(type === "signup") {
            return (
                <Container height="100vh" width="100%" backgroundColor={AppTheme.background} style={{ overflow: "auto" }}>
                    <Responsive
                        phone={
                            <Column mainAxisSize="max">
                                <Container backgroundColor={AppTheme.primary} width="100%" padding="20px">
                                    <Image image={Assets.serch.logoWhite} width={60} objectFit="contain" />
                                </Container>
                                <SizedBox height={20} />
                                {children}
                            </Column>
                        }
                    >
                        <Row mainAxisSize="max" crossAxisSize="max">
                            {children}
                            <Column mainAxis="center" crossAxis="center" mainAxisSize="max">
                                <Container height="100%" width="100%" backgroundColor="none" style={{
                                    backgroundImage: `url(${Assets.auth.signup})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover'
                                }}>
                                    <Column mainAxis="center" crossAxis="center" mainAxisSize="max">
                                        <Image image={Assets.serch.logoWhite} width={160} objectFit="contain" />
                                        <Container height="3px" width={100} backgroundColor={AppTheme.appbarDark} />
                                    </Column>
                                </Container>
                            </Column>
                        </Row>
                    </Responsive>
                </Container>
            )
        } else if(type === "invite") {
            return (
                <Container height="100vh" width="100%" backgroundColor={AppTheme.background}>
                    {children}
                </Container>
            )
        } else if(type === "invite-verify") {
            return (
                <Container height="100vh" width="100%" backgroundColor={AppTheme.background}>
                    {children}
                </Container>
            )
        } else if(type === "login-verify") {
            return (
                <Container height="100vh" width="100%" backgroundColor="none" style={{
                    backgroundImage: `url(${Assets.auth.mfa})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover'
                }}>
                    <Column mainAxis="center" crossAxis="center" mainAxisSize="max">
                        <Row mainAxisSize="max" mainAxis="flex-end" style={{padding: isMobile ? "12px" : "6px"}}>
                            <Image
                                image={adminStore.read.profile.avatar || Assets.auth.administrator}
                                height={isMobile ? 35 : 55}
                                style={{
                                    borderRadius: "50%",
                                    backgroundColor: AppTheme.appbarDark,
                                    padding: "6px"
                                }}
                            />
                            {isMobile && (<SizedBox height={10} />)}
                        </Row>
                        {children}
                    </Column>
                </Container>
            )
        } else if(type === "mfa") {
            return (
                <Container height="100vh" width="100%" backgroundColor={isMobile ? AppTheme.background : "none"} style={{
                    backgroundImage: isMobile ? "none" : `url(${Assets.auth.mfa})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    overflow: "scroll"
                }}>
                    <Column mainAxis="center" crossAxis="center" mainAxisSize="max">
                        <Row mainAxisSize="max" mainAxis="flex-end" style={{padding: isMobile ? "12px" : "6px"}}>
                            {/* <Icon icon="solar:shield-up-line-duotone" height="50px"  style={{color: AppTheme.secondary}} /> */}
                            {isMobile && (<SizedBox height={10} />)}
                        </Row>
                        {children}
                        {isMobile && (<SizedBox height={10} />)}
                    </Column>
                </Container>
            )
        } else if(type === "password") {
            return (
                <Container height="100vh" width="100%" backgroundColor={AppTheme.background}>
                    {children}
                </Container>
            )
        } else {
            return (
                <Container height="100vh" width="100%" backgroundColor={AppTheme.background}>
                    <Responsive
                        phone={
                            <Column mainAxisSize="max">
                                {children}
                            </Column>
                        }
                    >
                        <Row mainAxisSize="max" crossAxisSize="max">
                            <Column mainAxis="center" crossAxis="center" mainAxisSize="max">
                                <Container height="100%" width="100%" backgroundColor="none" style={{
                                    backgroundImage: `url(${Assets.auth.password})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover'
                                }}>
                                    <Column mainAxis="center" crossAxis="center" mainAxisSize="max">
                                        <Icon
                                            icon="ph:password-duotone"
                                            height="160px"
                                            style={{color: preferenceStore.read.isLight ? AppTheme.secondary : AppTheme.primary}}
                                        />
                                        <Container height="3px" width={100} backgroundColor={AppTheme.appbarDark} />
                                    </Column>
                                </Container>
                            </Column>
                            {children}
                        </Row>
                    </Responsive>
                </Container>
            )
        }
    }

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                overflow: "hidden",
                minHeight: '100vh',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >{render()}</div>
    )
})

export default AuthLayout