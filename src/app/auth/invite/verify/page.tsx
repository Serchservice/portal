import { Column, Container, Loading, Notify, SizedBox, Text, useDesign, useRedirect, useWidth } from "@serchservice/web-ui-kit";
import { RouteConfig, RouteInterface } from "../../../../configuration/Route";
import AuthLayout from "../../../../layouts/auth/AuthLayout";
import Title from "../../../../widgets/Title";
import { observer } from "mobx-react-lite";
import React from "react";
import { useSearchParams } from "react-router-dom";
import Connect from "../../../../backend/api/Connect";
import AuthRouting from "../../../../configuration/AuthRouting";
import AppTheme from "../../../../configuration/Theme";
import mfaSetupStore from "../../../../backend/database/auth/MFASetupStore";
import MFASetup from "../../../../backend/models/auth/MFASetup";

export const VerifyInviteRoute: RouteInterface = {
    path: "/auth/invite/verify",
    page: <VerifyInvitePage />,
}

export default function VerifyInvitePage() {
    return (
        <AuthLayout type="invite-verify">
            <Title title='Reading Invite Link' description='Wait a moment while we understand this invite link' />
            <View />
        </AuthLayout>
    )
}

const View: React.FC = observer(() => {
    const { isMobile, isDesktop,  } = useDesign()
    const redirect = useRedirect()
    const width = useWidth();

    const generalPadding = isMobile ? "28px" : isDesktop ? `120px ${width <= 1110 ? '100px' : '140px'}` : "120px 56px";

    const connect = new Connect({ withAuth: false });

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isVerified, setIsVerified] = React.useState<boolean>(false);
    const [searchParams] = useSearchParams();
    const isMounted = React.useRef<boolean>(false);

    const verifyInvite = React.useCallback(async (token: string) => {
        setIsLoading(true);

        const response = await connect.get(`/auth/admin/invite/verify?secret=${token}`);
            setIsLoading(false);
            if(response) {
                if (response.isSuccess) {
                    setIsVerified(true);

                    mfaSetupStore.set(MFASetup.fromJson(response.data));
                    const url = RouteConfig.getRoute(AuthRouting.instance.invite, {
                        name: response.message,
                        token: token
                    })
                    redirect(url);
                } else {
                    setIsVerified(false);
                    Notify.error(response.message);
                }
            }
    }, [ redirect ]);

    React.useEffect(() => {
        const token = searchParams.get("invite");
        if (!isMounted.current) {
            if (token != null) {
                verifyInvite(token);
            } else {
                setIsLoading(false);
                setIsVerified(false)
            }

            isMounted.current = true;
        }
    }, [ searchParams, verifyInvite ]);

    return (
        <Container padding={generalPadding} width="100%">
            <Text
                color={AppTheme.primary}
                size={isMobile ? 18 : 20}
                weight='bold'
                text="Hi Admin,"
            />
            <SizedBox height={10} />
            <Text
                color={AppTheme.primary}
                opacity={0.8}
                size={isMobile ? 14 : 16}
                text="Got an invite? Well, let's verify it together."
            />
            <SizedBox height={10} />
            <Container height={2} backgroundColor={AppTheme.primaryDark} width="95%" />
            <SizedBox height={40} />
            <Column crossAxis="center" mainAxis="center">
                <Loading
                    isLoading={isLoading}
                    isVerified={isVerified}
                    loading='Verifying invite...'
                    verified='Invite verified'
                    unverified='Error while verifying invite'
                    color={AppTheme.primary}
                />
            </Column>
        </Container>
    )
})