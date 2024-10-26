import { Icon } from "@iconify/react/dist/iconify.js";
import { BackdropLoader, Column, Container, Notify, Pager, Row, SizedBox, Spacer, Switcher, Text, Utility, Wrap } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import Connect from "../../../../backend/api/Connect";
import AccountDeviceResponse from "../../../../backend/models/account/AccountDeviceResponse";
import AdminScopeResponse from "../../../../backend/models/team/AdminScopeResponse";
import AppTheme from "../../../../configuration/Theme";
import Utils from "../../../../utils/Utils";
import { AdminInterface } from "../page";

const AdminAuthenticationView: React.FC<AdminInterface> = observer(({ admin, onAdminUpdated }) => {
    const connect = new Connect({})

    const [openBackdrop, setOpenBackdrop] = React.useState(false);
    const [isEnforced, setIsEnforced] = React.useState(admin.auth.mustHaveMFA)

    const handleSwitch = async () => {
        setOpenBackdrop(true);
        const response = await connect.patch<boolean>(`/scope/admin/auth/mfa?id=${admin.profile.id}`);
        setOpenBackdrop(false);
        if (response) {
            if (response.isSuccess) {
                if (response.data) {
                    onAdminUpdated(admin.copyWith({auth: admin.auth.copyWith({ mustHaveMFA: response.data })}))
                }

                setIsEnforced(!isEnforced)
                Notify.success(response.message);
            } else {
                Notify.error(response.message);
            }
        }
    };

    return (
        <React.Fragment>
            <Row mainAxisSize="max" crossAxis="flex-start" gap="10px">
                <Container backgroundColor={AppTheme.appbar} padding="16px" width="100%" borderRadius="8px" height="auto">
                    <Column crossAxis="flex-start" mainAxis="flex-start" crossAxisSize="min">
                        <Text text="Multi-Factor Authentication Options" size={15} color={AppTheme.hint} />
                        <SizedBox height={20} />
                        <Column crossAxisSize="max" crossAxis="flex-start" gap="10px">
                            {[
                                {
                                    title: "Enabled Multi-Factor Authentication for login access",
                                    value: admin.auth.hasMFA
                                },
                                {
                                    title: "Multi-Factor Authentication enforced for login access",
                                    value: isEnforced,
                                    onChange: handleSwitch
                                }
                            ].map((item, index) => {
                                return (
                                    <Row key={index} mainAxisSize="max" crossAxis="center" style={{width: "100%"}}>
                                        <Text text={item.title} size={14} color={AppTheme.primary} />
                                        <Spacer />
                                        <Switcher
                                            checked={item.value}
                                            trackBackgroundColor={AppTheme.background}
                                            checkedTrackColor={AppTheme.background}
                                            checkedDisabledTrackOpacity={9}
                                            checkedColor={AppTheme.success}
                                            unCheckedColor={AppTheme.primary}
                                            onChange={item.onChange}
                                        />
                                    </Row>
                                )
                            })}
                        </Column>
                    </Column>
                </Container>
                <Container backgroundColor={AppTheme.appbar} padding="16px" width="100%" borderRadius="8px" height="auto">
                    <Column crossAxis="flex-start" mainAxis="flex-start" crossAxisSize="min">
                        <Text text="Authentication Status" size={15} color={AppTheme.hint} />
                        <SizedBox height={20} />
                        <Column crossAxisSize="max" crossAxis="flex-start" gap="10px">
                            {[
                                {
                                    title: "Current Authentication Level",
                                    value: admin.auth.level
                                },
                                {
                                    title: "Current Authentication Method",
                                    value: admin.auth.method,
                                }
                            ].map((item, index) => {
                                return (
                                    <Row key={index} mainAxisSize="max" crossAxis="center" style={{width: "100%"}}>
                                        <Text text={item.title} size={14} color={AppTheme.primary} />
                                        <Spacer />
                                        <Text text={Utils.clearRole(item.value)} size={14} color={AppTheme.primary} />
                                    </Row>
                                )
                            })}
                        </Column>
                    </Column>
                </Container>
            </Row>
            <SizedBox height={30} />
            <DeviceList admin={admin} />
            <BackdropLoader open={openBackdrop} color={AppTheme.primary} />
        </React.Fragment>
    )
})

type DeviceListProps = {
    admin: AdminScopeResponse;
}

const DeviceList: React.FC<DeviceListProps> = observer(({ admin }) => {
    const [list, setList] = React.useState(admin.auth.devices);

    const buildList = () => {
        if(list && list.length > 0) {
            return (
                <Wrap spacing={20} runSpacing={20}>
                    {list.map((child, index) => <Device key={index} device={child} />)}
                </Wrap>
            )
        } else {
            return (
                <Container height={300} width ="100%">
                    <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center">
                        <Text text={`${admin.profile.name} has not logged in with any device`} color={AppTheme.hint} size={16} opacity={8} />
                    </Column>
                </Container>
            )
        }
    }

    return (
        <Column crossAxis="flex-start">
            <Text text="Authenticated Device List" size={15} color={AppTheme.primary} />
            <SizedBox height={10} />
            {buildList()}
            <SizedBox height={20} />
            <Pager items={admin.auth.devices} onSlice={setList} itemsPerPage={10} />
            <SizedBox height={30} />
        </Column>
    )
})

type DeviceProps = {
    device: AccountDeviceResponse
}

const Device: React.FC<DeviceProps> = observer(({ device }) => {
    return (
        <Container backgroundColor={AppTheme.appbar} width="250px" borderRadius="10px" padding="12px">
            <Row crossAxis="flex-start" mainAxisSize="max">
                <Column crossAxis="flex-start" crossAxisSize="max">
                    <Text text={device.name} size={14} color={AppTheme.primary} flow="ellipsis" />
                    <SizedBox height={4} />
                    <Text text={Utility.capitalizeFirstLetter(device.platform)} size={12} color={AppTheme.primary} flow="ellipsis" />
                </Column>
                <Spacer />
                <Icon icon="solar:devices-bold-duotone" height="2em" width="2em" color={AppTheme.primary} />
            </Row>
            <SizedBox height={10} />
            <Text text={`${device.count}`} color={AppTheme.primary} size={28} />
            <SizedBox height={10} />
            <Row>
                <Container padding="6px 6px 4px" backgroundColor={device.revoked ? AppTheme.error : AppTheme.success} borderRadius="10px">
                    <Text text={device.revoked ? "INACTIVE" : "ACTIVE"} color='#fff' size={11} />
                </Container>
            </Row>
        </Container>
    )
})

export default AdminAuthenticationView