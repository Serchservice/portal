import { useQuery } from "@tanstack/react-query";
import Connect from "../../../backend/api/Connect";
import Keys from "../../../backend/api/Keys";
import { RouteInterface } from "../../../configuration/Route"
import { observer } from "mobx-react-lite";
import React from "react";
import Title from "../../../widgets/Title";
import {
    ActionButton,
    CircularIconButton,
    Column,
    Container,
    CopyButton,
    Notify,
    PasswordField,
    Row,
    Shimmer,
    SizedBox,
    Spacer,
    Switcher,
    Text,
    useDesign,
    Utility,
    Wrap
} from "@serchservice/web-ui-kit";
import { MFARecoveryCode, MFAUsage } from "../../../backend/models/auth/MFA";
import mfaStore from "../../../backend/database/auth/MFAStore";
import preferenceStore from "../../../backend/database/device/PreferenceStore";
import AppTheme from "../../../configuration/Theme";
import { Metric } from "../../../widgets/Metrics";
import { ConnectifyUtils } from "@serchservice/connectify";
import authStore from "../../../backend/database/auth/AuthStore";
import Auth from "../../../backend/models/auth/Auth";
import adminStore from "../../../backend/database/auth/AdminStore";
import Admin from "../../../backend/models/profile/Admin";

export const SecurityAndPrivacyRoute: RouteInterface = {
    path: "/profile/security-and-privacy",
    page: <SecurityAndPrivacyPage />,
}

export default function SecurityAndPrivacyPage() {
    return (
        <React.Fragment>
            <Title title="Security and Privacy" />
            <Column mainAxisSize="max" crossAxisSize="max" style={{padding: "24px", overflow: "scroll"}}>
                <Column>
                    <Row mainAxisSize="max" crossAxisSize="max" crossAxis="flex-start">
                        <MFAStatisticsView />
                        <SizedBox width={30} />
                        <MFARecoveryView />
                    </Row>
                    <SizedBox height={80} />
                    <Row mainAxisSize="max" crossAxisSize="max" crossAxis="flex-start">
                        <PasswordView />
                        <SizedBox width={30} />
                        <ChangePasswordView />
                    </Row>
                </Column>
            </Column>
        </React.Fragment>
    )
}

const MFAStatisticsView: React.FC = observer(() => {
    const dimmed = preferenceStore.read.isDark

    const connect = new Connect({});

    const { data, isLoading, error } = useQuery({
        queryKey: [Keys.LOGGED_IN_SECURITY_AND_PRIVACY("MFA-STATS")],
        queryFn: () => connect.get<MFAUsage>("/auth/mfa/usage")
    })

    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                if (data.data) {
                    mfaStore.set(mfaStore.read.copyWith({ usage: MFAUsage.fromJson(data.data) }))
                }
            } else {
                Notify.error(data.message)
            }
        }
    },  [data])

    function buildRow(count: number, header: string) {
        return { count: count, header: header }
    }

    const render = (): JSX.Element => {
        if(isLoading || !data || error) {
            return (
                <React.Fragment>
                    <Shimmer width="180px" height="20px" radius={6} dimmed={dimmed} />
                    <SizedBox height={30} />
                    <Wrap runSpacing={20} spacing={20}>
                        {Utility.itemGenerate(3).map((_, index) => {
                            return (<Shimmer key={index} width="160px" height="100px" dimmed={dimmed} />)
                        })}
                    </Wrap>
                    <SizedBox height={50} />
                    <Shimmer width="200px" height="38px" radius={50} dimmed={dimmed} />
                </React.Fragment>
            )
        } else {
            const metrics = [
                buildRow(mfaStore.read.usage.total, "Total Recovery Codes"),
                buildRow(mfaStore.read.usage.unused, "Total Unused Codes"),
                buildRow(mfaStore.read.usage.used, "Total Used Codes")
            ]

            return (
                <React.Fragment>
                    <Text text="Two-Factor Authentication Statistics" color={AppTheme.primary} size={16} />
                    <SizedBox height={30} />
                    <Wrap runSpacing={20} spacing={20}>
                        {metrics.map((metric, index) => {
                            return (<Metric value={`${metric.count}`} title={metric.header} key={index} titleStyle={{fontSize: "14px"}} />)
                        })}
                    </Wrap>
                    <SizedBox height={50} />
                    <Row mainAxisSize="max" crossAxisSize="max">
                        <Text text="Two-Factor Authentication" color={AppTheme.primary} size={14} />
                        <Spacer />
                        <Switcher
                            checked={authStore.read.hasMfa}
                            trackBackgroundColor={AppTheme.appbar}
                            checkedTrackColor={AppTheme.appbar}
                            checkedDisabledTrackOpacity={9}
                            checkedColor={AppTheme.success}
                        />
                    </Row>
                </React.Fragment>
            )
        }
    }

    return (<Column mainAxisSize="min" crossAxisSize="max">{render()}</Column>)
})

const MFARecoveryView: React.FC = observer(() => {
    const dimmed = preferenceStore.read.isDark

    const connect = new Connect({})

    const { data, isLoading, error } = useQuery({
        queryKey: [Keys.LOGGED_IN_SECURITY_AND_PRIVACY("MFA-CODES")],
        queryFn: () => connect.get<MFARecoveryCode[]>("/auth/mfa/recovery/codes")
    })

    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                if (data.data) {
                    console.log(data.data)
                    mfaStore.set(mfaStore.read.copyWith({ codes: data.data.map(data => MFARecoveryCode.fromJson(data)) }))
                }
            } else {
                Notify.error(data.message)
            }
        }
    }, [ data ])

    const render = (): JSX.Element => {
        if(isLoading || !data || error) {
            return (
                <React.Fragment>
                    <Shimmer width="180px" height="20px" radius={6} dimmed={dimmed} />
                    <SizedBox height={30} />
                    <Wrap runSpacing={20} spacing={20}>
                        {Utility.itemGenerate(10).map((_, index) => {
                            return (<Shimmer key={index} width="80px" height="80px" dimmed={dimmed} />)
                        })}
                    </Wrap>
                    <SizedBox height={50} />
                    <Shimmer width="100%" height="38px" radius={50} dimmed={dimmed} />
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <Text text="Two-Factor Recovery Codes" color={AppTheme.primary} size={16} />
                    <SizedBox height={30} />
                    <Wrap runSpacing={20} spacing={20}>
                        {mfaStore.read.codes.map((code, index) => {
                            return (<MFARecoveryCodeView code={code} key={index} />)
                        })}
                    </Wrap>
                    <SizedBox height={50} />
                    <Row mainAxisSize="max" crossAxisSize="max">
                        <Text text="Recovery Codes" color={AppTheme.primary} size={14} />
                        <Spacer />
                        <Switcher
                            checked={authStore.read.hasRecoveryCodes}
                            trackBackgroundColor={AppTheme.appbar}
                            checkedTrackColor={AppTheme.appbar}
                            checkedDisabledTrackOpacity={9}
                            checkedColor={AppTheme.success}
                        />
                    </Row>
                </React.Fragment>
            )
        }
    }

    return (
        <Column mainAxisSize="min" crossAxisSize="min" style={{border: `2px solid ${AppTheme.appbar}`, padding: "10px", borderRadius: "12px"}}>
            {render()}
        </Column>
    )
})

interface MFARecoveryCodeViewProps {
    code: MFARecoveryCode;
}

const MFARecoveryCodeView: React.FC<MFARecoveryCodeViewProps> = observer(({code}) => {
    const [isHidden, setIsHidden] = React.useState(true);

    return (
        <Metric
            value={isHidden ? "******" : code.code}
            valueStyle={{
                textDecoration: code.isUsed ? `line-through ${AppTheme.primary} 2px` : "none",
                fontSize: "15px",
                alignSelf: "center",
                marginBottom: "6px"
            }}
            containerStyle={{width: "80px", height: "80px"}}
            custom={
                <Row mainAxis="center" crossAxis="center" crossAxisSize="min">
                    <CircularIconButton
                        icon={isHidden ? "iconamoon:eye-fill" : "iconamoon:eye-off-fill"}
                        size={0.5}
                        onClick={() => setIsHidden(!isHidden)}
                    />
                    <SizedBox width={5} />
                    <CopyButton data={code.code} color="" size={0.5} />
                </Row>
            }
        />
    )
})

const PasswordView: React.FC = observer(() => {
    const dimmed = preferenceStore.read.isDark
    const connect = new Connect({});

    const { data, isLoading } = useQuery({
        queryKey: [Keys.LOGGED_IN_ADMIN_PROFILE],
        queryFn: () => connect.get("/admin/profile")
    })

    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                if (data.data) {
                    adminStore.set(Admin.fromJson(data.data));
                }
            } else {
                Notify.error(data.message);
            }
        }
    }, [ data ])

    const render = (): JSX.Element => {
        if(isLoading || !data) {
            return (<Shimmer width="100%" height="150px" radius={5} dimmed={dimmed} />)
        } else {
            return (
                <Container backgroundColor={AppTheme.appbar} padding="12px" borderRadius="12px" width="100%">
                    <Text text="Password Details" color={AppTheme.primary} size={16} />
                    <SizedBox height={30} />
                    <Container backgroundColor={AppTheme.background} padding="12px" borderRadius="12px" width="100%">
                        <Text text="IMPORTANT!" color={AppTheme.primary} size={16} />
                        <SizedBox height={6} />
                        <Text
                            text="Password must contain special characters, number and letters"
                            size={14}
                            color={AppTheme.primary}
                        />
                    </Container>
                    <SizedBox height={30} />
                    <Text text="Last Password Update" size={14} color={AppTheme.primary} />
                    <SizedBox height={6} />
                    <Text text={adminStore.read.profile.passwordUpdatedAt} size={12} color={AppTheme.hint} />
                </Container>
            )
        }
    }

    return (<Column mainAxisSize="min" crossAxisSize="max">{render()}</Column>)
})

const ChangePasswordView: React.FC = observer(() => {
    const mask = "**********";

    const { isMobile } = useDesign();
    const connect = new Connect({})

    const [current, setCurrent] = React.useState(mask)
    const [password, setPassword] = React.useState(mask)
    const [confirm, setConfirm] = React.useState(mask)
    const [isSaving, setIsSaving] = React.useState(false)

    async function changePassword() {
        if (isSaving) {
            return
        } else if (current === '') {
            Notify.error('Current password cannot be empty')
            return
        } else if (password === '') {
            Notify.error('New password cannot be empty')
            return
        } else if (confirm === '' || confirm !== password) {
            Notify.error('Password does not match')
            return
        } else {
            setIsSaving(true)
            var device = await ConnectifyUtils.getDevice()
            const response = await connect.post("/auth/password/change", {
                new_password: password,
                old_password: current,
                device: device.toJson()
            })
            setIsSaving(false);

            if (response) {
                if (response.isSuccess) {
                    authStore.set(Auth.fromJson(response.data))
                    setCurrent(mask)
                    setConfirm(mask)
                    setPassword(mask)
                } else {
                    Notify.error(response.message)
                }
            }
        }
    }

    const fields = [
        {
            value: current,
            onPasswordEntered: setCurrent,
            header: "Current Password"
        },
        {
            value: password,
            onPasswordEntered: setPassword,
            header: "New Password"
        },
        {
            value: confirm,
            onPasswordEntered: setConfirm,
            header: "Confirm Password"
        },
    ]

    return (
        <Column mainAxisSize="min" crossAxisSize="max" style={{border: `2px solid ${AppTheme.appbar}`, padding: "10px", borderRadius: "12px"}}>
            <Text text="Change Password" color={AppTheme.primary} size={16} />
            <SizedBox height={30} />
            {fields.map((field, index) => {
                const isLast = fields.length - 1 === index;

                return (
                    <React.Fragment>
                        <PasswordField
                            color={AppTheme.primary}
                            borderColor={AppTheme.hint}
                            onPasswordEntered={field.onPasswordEntered}
                            header={field.header}
                            spacer="0"
                            inputStyle={{
                                fontSize: isMobile ? "14px" : "16px",
                                color: AppTheme.primary,
                                backgroundColor: AppTheme.secondary
                            }}
                            labelStyle={{ fontSize: isMobile ? "14px" : "16px", color: AppTheme.primary }}
                        />
                        {!isLast && (<SizedBox height={6} />)}
                    </React.Fragment>
                )
            })}
            <SizedBox height={35} />
            <ActionButton
                padding="10px 36px"
                backgroundColor={AppTheme.appbarLight}
                fontSize={14}
                onClick={changePassword}
                useLoader={isSaving}
                state={isSaving}
                title="Change Password"
            />
        </Column>
    )
})