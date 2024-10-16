import React from "react";
import { RouteInterface } from "../../../configuration/Route";
import AuthLayout from "../../../layouts/auth/AuthLayout";
import { observer } from "mobx-react-lite";
import MFASetup from "../../../backend/models/auth/MFASetup";
import mfaSetupStore from "../../../backend/database/auth/MFASetupStore";
import Title from "../../../widgets/Title";
import {
    useDesign,
    Column,
    Container,
    HorizontalLoader,
    SizedBox,
    OtpField,
    ActionButton,
    Image,
    Text,
    Row,
    Navigate,
    Notify,
    Utility
} from "@serchservice/web-ui-kit";
import Assets from "../../../assets/Assets";
import authStore from "../../../backend/database/auth/AuthStore";
import AppTheme from "../../../configuration/Theme";
import { Icon } from "@iconify/react/dist/iconify.js";
import Routing from "../../../configuration/Routing";
import Connect from "../../../backend/api/Connect";
import { ConnectifyUtils } from "@serchservice/connectify";
import Utils from "../../../utils/Utils";
import Auth from "../../../backend/models/auth/Auth";

export const MFAuthRoute: RouteInterface = {
    path: "/auth/mfa",
    page: <MFAuthPage />,
}

export default function MFAuthPage() {
    const steps: Step[] = [
        {
            step: 0,
            title: "Two-Factor Authentication | Setup",
            description: "Setup two-factor authentication for your admin account"
        },
        {
            step: 1,
            title: "Two-Factor Authentication | Scan",
            description: "Scan or copy the setup key to initiate two-factor authentication"
        },
        {
            step: 2,
            title: "Two-Factor Authentication | Verify",
            description: "Verify two-factor authentication you've initiated"
        },
        {
            step: 3,
            title: "Two-Factor Authentication | Setup complete",
            description: "You are now multi-authenticated, continue to the admin account"
        }
    ];

    const [step, setStep] = React.useState<Step>(steps[0]);

    return (
        <AuthLayout type="mfa">
            <Title title={step.title} description={step.description} />
            <View current={step} steps={steps} onStepUpdated={setStep}/>
        </AuthLayout>
    )
}

interface Step {
    step: number;
    title: string;
    description: string;
}

interface ViewProps {
    current: Step;
    steps: Step[];
    onStepUpdated: (step: Step) => void;
}

const View: React.FC<ViewProps> = observer(({ current, steps, onStepUpdated }) => {
    const { isMobile } = useDesign();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [token, setToken] = React.useState<string>("");

    const connect = new Connect({})

    async function initialize() {
        setIsLoading(true);

        const response = await connect.get("/auth/mfa/init")
        setIsLoading(false);
        if(response) {
            if (response.isSuccess) {
                const data = MFASetup.fromJson(response.data)
                mfaSetupStore.set(data);
                onStepUpdated(steps[current.step + 1])
            } else {
                Notify.error(response.message);
            }
        }
    }

    async function verify(code?: string) {
        if (token === '') {
            Notify.warning("Two-Factor authentication is required");
            return;
        } else {
            setIsLoading(true);
            try {
                const device = await ConnectifyUtils.getDevice();
                const response = await connect.post("/auth/mfa/verify/code", {
                    code: code ?? token,
                    device: device.toJson()
                });
                if(response) {
                    setIsLoading(false);
                    if (response.isSuccess) {
                        authStore.set(Auth.fromJson(response.data));
                        onStepUpdated(steps[current.step + 1])
                    } else {
                        Notify.error(response.message);
                        return;
                    }
                }
            } catch (error) {
                setIsLoading(false);
                Utils.showError(error)
            }
        }
    }

    const handleCopy = () => {
        Utility.copy(mfaSetupStore.read.secret);
    }

    const goBack = () => {
        if(current.step === 0) {
            return
        } else {
            onStepUpdated(steps[current.step - 1])
        }
    }

    const handleHome = async () => {
        mfaSetupStore.clear();
        Navigate.all(Routing.instance.home.path);
    };

    const isLast = current.step === steps[steps.length - 1].step

    const render = (): JSX.Element => {
        if (current.step === 1 && mfaSetupStore.read) {
            return (
                <React.Fragment>
                    <SizedBox height={20} />
                    <Image
                        image={mfaSetupStore.read.qr_code}
                        width="100%"
                        height="300px"
                        objectFit="contain"
                    />
                    <SizedBox height={20} />
                    <Text text="Scan QrCode to setup MFA or copy the setup key" color={AppTheme.hint} />
                    <SizedBox height={20} />
                    <Container
                        backgroundColor={AppTheme.primaryDark}
                        padding="10px"
                        borderRadius="10px"
                        onClick={handleCopy}
                    >
                        <Text
                            text={`${mfaSetupStore.read.secret} (Tap to Copy)`}
                            color={AppTheme.hint}
                            size={12}
                        />
                    </Container>
                    <SizedBox height={20} />
                    <Text text="You can skip this if this is not enforced on your account" color={AppTheme.hint} />
                    <SizedBox height={10} />
                    <ActionButton
                        padding="3px"
                        backgroundColor="transparent"
                        color={AppTheme.primary}
                        fontSize={13}
                        hoverColor={AppTheme.primary}
                        hoverBackgroundColor={AppTheme.primaryLight}
                        onClick={() => Navigate.all(Routing.instance.home.path)}
                        borderRadius="12px"
                        title="Skip"
                    />
                    <SizedBox height={20} />
                    <Row mainAxis="flex-start" crossAxis="center">
                        <ActionButton
                            padding="8px 30px"
                            backgroundColor={AppTheme.appbarLight}
                            fontSize={13}
                            onClick={goBack}
                            borderRadius="2px"
                            title="Back"
                        />
                        <SizedBox width={10} />
                        <ActionButton
                            padding="8px 30px"
                            backgroundColor={AppTheme.appbarLight}
                            fontSize={13}
                            onClick={() => onStepUpdated(steps[current.step + 1])}
                            borderRadius="2px"
                            title="Continue"
                        />
                    </Row>
                </React.Fragment>
            )
        }

        if (current.step === 2 && mfaSetupStore.read) {
            return (
                <React.Fragment>
                    <SizedBox height={20} />
                    <OtpField
                        header="Verify yourself with code from your authenticator"
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
                        resendStyle={{color: AppTheme.primary}}
                        labelStyle={{ fontSize: isMobile ? "14px" : "16px", color: AppTheme.primary }}
                    />
                    <SizedBox height={20} />
                    <Text text="You can skip this if this is not enforced on your account" color={AppTheme.hint} />
                    <SizedBox height={10} />
                    <ActionButton
                        padding="3px"
                        backgroundColor="transparent"
                        color={AppTheme.primary}
                        fontSize={13}
                        hoverColor={AppTheme.primary}
                        hoverBackgroundColor={AppTheme.primaryLight}
                        onClick={() => Navigate.all(Routing.instance.home.path)}
                        borderRadius="12px"
                        title="Skip"
                    />
                    <SizedBox height={50} />
                    <Row mainAxis="flex-start" crossAxis="center">
                        <ActionButton
                            padding="8px 30px"
                            backgroundColor={AppTheme.appbarLight}
                            fontSize={13}
                            onClick={goBack}
                            borderRadius="2px"
                            title="Back"
                        />
                        <SizedBox width={10} />
                        <ActionButton
                            padding="8px 30px"
                            backgroundColor={AppTheme.appbarLight}
                            fontSize={13}
                            onClick={_ => verify()}
                            borderRadius="2px"
                            title="Verify"
                        />
                    </Row>
                </React.Fragment>
            )
        }

        if(current.step === 0) {
            return (
                <React.Fragment>
                    <SizedBox height={20} />
                    <Icon
                        icon="solar:shield-minimalistic-bold-duotone"
                        width={isMobile ? "80px" : "120px"}
                        height={isMobile ? "80px" : "120px"}
                        style={{color: AppTheme.primary}}
                    />
                    <SizedBox height={50} />
                    <Text text="You can skip this if this is not enforced on your account" color={AppTheme.hint} />
                    <SizedBox height={20} />
                    <Row mainAxis="space-between" crossAxis="center">
                        <ActionButton
                            padding="3px"
                            backgroundColor="transparent"
                            color={AppTheme.primary}
                            fontSize={13}
                            hoverColor={AppTheme.primary}
                            hoverBackgroundColor={AppTheme.primaryLight}
                            onClick={() => Navigate.all(Routing.instance.home.path)}
                            borderRadius="12px"
                            title="Skip"
                        />
                        <ActionButton
                            padding="8px 30px"
                            backgroundColor={AppTheme.appbarLight}
                            fontSize={13}
                            onClick={initialize}
                            borderRadius="2px"
                            title="Proceed"
                        />
                    </Row>
                </React.Fragment>
            )
        }

        if(isLast) {
            return (
                <React.Fragment>
                    <SizedBox height={20} />
                    <Icon
                        icon="solar:shield-check-bold-duotone"
                        width={isMobile ? "80px" : "120px"}
                        height={isMobile ? "80px" : "120px"}
                        style={{color: AppTheme.primary}}
                    />
                    <SizedBox height={50} />
                    <Text
                        text={`${authStore.read.name} | ${authStore.read.role.replace("_", " ")}`}
                        color={AppTheme.appbarDark}
                    />
                    <SizedBox height={20} />
                    <Text text="Security updated" color={AppTheme.primary} size={16}/>
                    <SizedBox height={10} />
                    <Text
                        text="Your account is now secure. Please remember to protect your security details at all times."
                        color={AppTheme.hint}
                    />
                    <SizedBox height={20} />
                    <Row mainAxis="flex-end" crossAxis="center">
                        <ActionButton
                            padding="8px 30px"
                            backgroundColor={AppTheme.appbarLight}
                            fontSize={13}
                            onClick={handleHome}
                            borderRadius="2px"
                            title="Got it"
                        />
                    </Row>
                </React.Fragment>
            )
        }

        return (<></>)
    }

    return (
        <Column mainAxis={isMobile ? "flex-start" : "center"} crossAxisSize="min" crossAxis="flex-start" mainAxisSize="max">
            <Container
                width={isLast ? isMobile ? "100%" : "400px" : "auto"}
                elevation={isMobile ? 0 : 4}
                backgroundColor={AppTheme.secondary}
                borderRadius={isMobile ? "" : "24px"}
            >
                {isLoading && <HorizontalLoader isPlaying color={AppTheme.primary} />}
                <Container padding="20px">
                    <Image image={Assets.serch.logoBlack} height={25} />
                    <SizedBox height={18} />
                    <Text
                        text={current.title}
                        color={AppTheme.primary}
                        size={isMobile ? 16 : 18}
                    />
                    <Text text={current.description} color={AppTheme.hint} />
                    {render()}
                </Container>
            </Container>
        </Column>
    )
})