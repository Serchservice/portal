import { BackdropLoader, Column, Container, Notify, SizedBox, Text } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import AppTheme from "../../../../configuration/Theme";
import PermissionTable, { UpdatePermissionRequest } from "../../../../widgets/PermissionTable";
import { AdminInterface } from "../page";
import Connect from "../../../../backend/api/Connect";
import { TeamResponse } from "../../../../backend/models/profile/TeamResponse";

const AdminPermissionView: React.FC<AdminInterface> = observer(({ admin, onAdminUpdated }) => {
    const headers = ["Scopes", "Read", "Write", "Update", "Delete"]

    const [isLoading, setIsLoading] = React.useState(false)
    const connect = new Connect({})

    async function handleClusterUpdate(scopes: UpdatePermissionRequest[]) {
        setIsLoading(true)
        const response = await connect.patch("/admin/permission/update", {
            id: admin.profile.id,
            scopes: scopes
        })
        setIsLoading(false)

        if(response) {
            if(response.isSuccess) {
                Notify.success(response.message)
                onAdminUpdated(admin.copyWith({team: TeamResponse.fromJson(response.data)}))
            } else {
                Notify.error(response.message)
            }
        }
    }

    async function handleSpecificUpdate(scopes: UpdatePermissionRequest[], account: string) {
        setIsLoading(true)
        const response = await connect.patch("/admin/permission/update", {
            id: admin.profile.id,
            account: account,
            scopes: scopes
        })
        setIsLoading(false)

        if(response) {
            if(response.isSuccess) {
                Notify.success(response.message)
                onAdminUpdated(admin.copyWith({team: TeamResponse.fromJson(response.data)}))
            } else {
                Notify.error(response.message)
            }
        }
    }

    const buildCluster = () => {
        return (<PermissionTable headers={headers} permissions={admin.team.cluster} canUpdate onUpdated={handleClusterUpdate} />)
    }

    const buildSpecific = () => {
        if(admin.team.specific && admin.team.specific.length > 0) {
            return (
                <Column style={{gap: "20px"}} mainAxisSize="max">
                    {admin.team.specific.map((spec, index) => {
                        return (
                            <React.Fragment key={index}>
                                <Container width="100%" border={`1px solid ${AppTheme.hint}`} padding="10px">
                                    <Text text={spec.name} size={14} color={AppTheme.hint} />
                                </Container>
                                <PermissionTable
                                    headers={headers}
                                    permissions={spec.scopes}
                                    account={spec.account}
                                    canUpdate
                                    onUpdated={scopes => handleSpecificUpdate(scopes, spec.account)}
                                />
                            </React.Fragment>
                        )
                    })}
                </Column>
            )
        } else {
            return (
                <Container height={300} width ="100%">
                    <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center">
                        <Text text={`No specific permissions for ${admin.profile.name}`} color={AppTheme.hint} size={16} opacity={8} />
                    </Column>
                </Container>
            )
        }
    }

    return (
        <React.Fragment>
            <Text text="Cluster Permissions" size={16} color={AppTheme.hint} />
            <SizedBox height={10} />
            {buildCluster()}
            <SizedBox height={50} />
            <Text text="Specific Permissions" size={16} color={AppTheme.hint} />
            <SizedBox height={10} />
            {buildSpecific()}
            <BackdropLoader open={isLoading} color={AppTheme.primary} />
        </React.Fragment>
    )
})

export default AdminPermissionView