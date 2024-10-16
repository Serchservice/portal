import React from "react";
import Connect from "../../../../backend/api/Connect";
import { RouteInterface } from "../../../../configuration/Route";
import { observer } from "mobx-react-lite";
import { useDesign, Column, SizedBox, Text, Notify, Wrap, Shimmer, ActionButton, Container } from "@serchservice/web-ui-kit";
import AppTheme from "../../../../configuration/Theme";
import Title from "../../../../widgets/Title";
import { Icon } from "@iconify/react/dist/iconify.js";
import adminStore from "../../../../backend/database/auth/AdminStore";
import { useQuery } from "@tanstack/react-query";
import Keys from "../../../../backend/api/Keys";
import Admin from "../../../../backend/models/profile/Admin";
import Utils from "../../../../utils/Utils";
import preferenceStore from "../../../../backend/database/device/PreferenceStore";
import authStore from "../../../../backend/database/auth/AuthStore";
import RequestPermission from "./modal/RequestPermission";
import PermissionTable from "../../../../widgets/PermissionTable";

export const GrantedPermissionRoute: RouteInterface = {
    path: "/profile/permission/granted",
    page: <GrantedPermissionPage />,
}

export default function GrantedPermissionPage() {
    return (
        <React.Fragment>
            <Title title="Granted Permission" />
            <View />
        </React.Fragment>
    )
}

const View: React.FC = observer(() => {
    const { isMobile } = useDesign();
    const dimmed = preferenceStore.read.isDark;
    const isSuper = authStore.read.isSuper;

    const connect = new Connect({});

    const { data, isLoading } = useQuery({
        queryKey: [Keys.LOGGED_IN_ADMIN_PROFILE],
        queryFn: () => connect.get("/admin/profile")
    })

    const [isRequestOpen, setIsRequestOpen] = React.useState(false)
    const [account, setAccount] = React.useState<Admin>(adminStore.read)

    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                if (data.data) {
                    const admin = Admin.fromJson(data.data);

                    if(admin.profile.firstName) {
                        adminStore.set(admin);
                    }
                    setAccount(admin)
                }
            } else {
                Notify.error(data.message);
            }
        }
    }, [ data ])

    const render = (): JSX.Element => {
        if(isLoading || !data) {
            return (
                <React.Fragment>
                    <Wrap spacing={10} crossAxisAlignment="flex-start">
                        <Text text="You have" color={AppTheme.hint} />
                        <Shimmer height={14} width={30} dimmed={dimmed} />
                        <Text text="cluster and" color={AppTheme.hint} />
                        <Shimmer height={14} width={30} dimmed={dimmed} />
                        <Text text="specific granted permissions. These permissions, combined with your" color={AppTheme.hint} />
                        <Shimmer height={14} width={80} dimmed={dimmed} />
                        <Text text="role, gives you have the power to perform some (if not all) actions within the Serchservice platform." color={AppTheme.hint} />
                    </Wrap>
                </React.Fragment>
            )
        } else {
            const sum = authStore.read.isSuper
                ? "You have all cluster and specific permissions"
                : `You have ${account.team.cluster.length} cluster and ${account.team.specific.length} specific granted permissions`

            return (
                <React.Fragment>
                    <Text
                        text={[
                            `${sum}. These permissions, combined with your ${Utils.clearRole(authStore.read.role)}`,
                            "role, gives you have the power to perform some (if not all) actions within the Serchservice platform.",
                        ].join(" ")}
                        color={AppTheme.hint}
                    />
                </React.Fragment>
            )
        }
    }

    const renderButton = (): JSX.Element | undefined => {
        if(isLoading || !data) {
            return (<Shimmer height={40} width={120} />)
        } else {
            return (
                <ActionButton
                    padding="8px 10px"
                    backgroundColor={AppTheme.background}
                    color={AppTheme.primary}
                    fontSize={12}
                    onClick={() => setIsRequestOpen(true)}
                    title="Request permission"
                />
            )
        }
    }

    const headers = ["Scopes", "Read", "Write", "Update", "Delete"]

    const buildCluster = () => {
        return (<PermissionTable headers={headers} permissions={account.team.cluster} canUpdate={false} isLoading={isLoading || !data} />)
    }

    const buildSpecific = () => {
        if(account.team.specific && account.team.specific.length > 0) {
            return (
                <Column style={{gap: "20px"}} mainAxisSize="max">
                    {account.team.specific.map((spec, index) => {
                        return (
                            <React.Fragment key={index}>
                                <Container width="100%" border={`1px solid ${AppTheme.hint}`} padding="10px">
                                    <Text text={spec.name} size={14} color={AppTheme.hint} />
                                </Container>
                                <PermissionTable headers={headers} permissions={spec.scopes} account={spec.account} canUpdate={false} isLoading={isLoading || !data} />
                            </React.Fragment>
                        )
                    })}
                </Column>
            )
        } else {
            return (
                <Container height={300} width ="100%">
                    <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center">
                        <Text text={`No specific permissions for ${account.profile.name}`} color={AppTheme.hint} size={16} opacity={8} />
                    </Column>
                </Container>
            )
        }
    }

    const buildView = () => {
        if(isSuper) {
            return (
                <React.Fragment>
                    <Column crossAxis="flex-start" mainAxis="center" crossAxisSize="max" mainAxisSize="max">
                        <Icon icon="duo-icons:alert-octagon" color={AppTheme.hint} width="4em" />
                        <SizedBox height={20} />
                        <Text text={`Hello ${authStore.read.name},`} color={AppTheme.primary} size={isMobile ? 16 : 18} />
                        <SizedBox height={10} />
                        {render()}
                    </Column>
                </React.Fragment>
            )
        } else {
            const loading = isLoading || !data

            return (
                <Column>
                    <Column crossAxis="flex-start" mainAxis="center" mainAxisSize="min" style={{backgroundColor: AppTheme.appbar, padding: "12px", borderRadius: "12px"}}>
                        <Text text={`Hello ${authStore.read.name},`} color={AppTheme.primary} size={isMobile ? 16 : 18} />
                        <SizedBox height={10} />
                        {render()}
                        <SizedBox height={10} />
                        <Text
                            text={[
                                "You can request more permissions if what you want to do is beyond your clearance and reach by",
                                "clicking on the button below."
                            ].join(" ")}
                            color={AppTheme.hint}
                        />
                        <SizedBox height={30} />
                        {renderButton()}
                    </Column>
                    <SizedBox height={40} />
                    {loading && (<Shimmer height={20} width={200} dimmed={dimmed} />)}
                    {!loading && (<Text text="Cluster Permissions" size={16} color={AppTheme.hint} />)}
                    <SizedBox height={10} />
                    {buildCluster()}
                    <SizedBox height={20} />
                    {loading && (<Shimmer height={20} width={200} dimmed={dimmed} />)}
                    {!loading && (<Text text="Specific Permissions" size={16} color={AppTheme.hint} />)}
                    <SizedBox height={10} />
                    {buildSpecific()}
                </Column>
            )
        }
    }

    return (
        <React.Fragment>
            <Column crossAxisSize="max" style={{padding: "20px", overflow: "scroll"}}>
                <Text text="Granted Permissions" size={16} color={AppTheme.primary} />
                <SizedBox height={20} />
                {buildView()}
            </Column>
            <RequestPermission isOpen={isRequestOpen} handleClose={() => setIsRequestOpen(false)} />
        </React.Fragment>
    )
})