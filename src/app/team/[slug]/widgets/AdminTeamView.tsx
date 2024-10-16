import React from "react";
import { AdminInterface, AdminRoute } from "../page";
import { observer } from "mobx-react-lite";
import { ActionButton, Column, Container, Field, Image, Navigate, Notify, Pager, Row, SizedBox, Spacer, Text, Utility, Wrap } from "@serchservice/web-ui-kit";
import Connect from "../../../../backend/api/Connect";
import AppTheme from "../../../../configuration/Theme";
import Utils from "../../../../utils/Utils";
import { Popup } from "@serchservice/web-ui-kit/build/src/utilities/Notify";
import AdminScopeResponse from "../../../../backend/models/team/AdminScopeResponse";
import { RouteConfig } from "../../../../configuration/Route";
import permissionStore from "../../../../backend/database/device/PermissionStore";

const AdminTeamView: React.FC<AdminInterface> = observer(({ admin, onAdminUpdated }) => {
    const connect = new Connect({})

    const [role, setRole] = React.useState(admin.team.role)
    const [position, setPosition] = React.useState(admin.team.position)
    const [department, setDepartment] = React.useState(admin.team.department)

    const roles = permissionStore.getAssignableRoles();

    const [isUpdateTeam, setIsUpdateTeam] = React.useState(false)
    const [isSaving, setIsSaving] = React.useState(false)

    async function handleUpdate() {
        if (isSaving) {
            return
        } else if(!isUpdateTeam) {
            setIsUpdateTeam(true)
            return
        } else if((role && role === admin.team.role) && (position && position === admin.team.position) && (department && department === admin.team.department)) {
            Notify.info("No changes detected", 6000, Popup.BOTTOMLEFT)
            return
        } else if((role === admin.team.role) && (position === admin.team.position) && (department === admin.team.department)) {
            Notify.info("No changes detected", 6000, Popup.BOTTOMLEFT)
            return
        } else if (role === '') {
            Notify.error('Role cannot be empty')
            return
        } else if (position === '') {
            Notify.error('Position cannot be empty')
            return
        } else {
            setIsSaving(true)
            const response = await connect.patch<string>(`/scope/admin/account/role`, {
                id: admin.profile.id,
                position: position,
                department: department,
                role: role
            });
            setIsSaving(false);

            if (response) {
                if (response.isSuccess) {
                    onAdminUpdated(admin.copyWith({
                        team: admin.team.copyWith({
                            position: position,
                            department: department,
                            role: role
                        })
                    }))
                    setIsUpdateTeam(false)
                    Notify.success(response.message);
                } else {
                    Notify.error(response.message);
                }
            }
        }
    }

    return (
        <React.Fragment>
            <Container backgroundColor={AppTheme.appbar} padding="16px" width="100%" borderRadius="8px" height="auto">
                <Column crossAxis="flex-start" mainAxis="flex-start" crossAxisSize="max">
                    <Text text="Team Information" size={15} color={AppTheme.primary} />
                    <SizedBox height={10} />
                    <Row style={{gap: "10px"}} crossAxis="center" mainAxisSize="max">
                        {[
                            {
                                label: "Position",
                                value: position,
                                onChange: setPosition
                            },
                            {
                                label: "Department",
                                value: department,
                                onChange: setDepartment
                            },
                        ].map((item, index) => {
                            return (
                                <Column key={index}>
                                    <Field
                                        needLabel
                                        backgroundColor={AppTheme.appbar}
                                        color={AppTheme.primary}
                                        label={item.label}
                                        value={item.value}
                                        onChange={item.onChange}
                                        fontSize={14}
                                        labelColor={AppTheme.primary}
                                        isDisabled={!isUpdateTeam}
                                    />
                                </Column>
                            )
                        })}
                    </Row>
                    <Row style={{gap: "20px"}} crossAxis="center" mainAxisSize="max">
                        <Column>
                            <Field
                                needLabel
                                backgroundColor={AppTheme.appbar}
                                color={AppTheme.primary}
                                label="Current Role"
                                value={Utils.clearRole(role)}
                                fontSize={14}
                                isDisabled
                                labelColor={AppTheme.primary}
                            />
                        </Column>
                        {isUpdateTeam && (
                            <Column mainAxisSize="min" crossAxisSize="min" crossAxis="flex-start">
                                <Text text="Available role you can assign" color={AppTheme.primary} size={14} />
                                <SizedBox height={8} />
                                <Row crossAxis="center" style={{gap: "10px"}}>
                                    {roles.map((r, index) => {
                                        const isSelected = r === role;

                                        return (
                                            <ActionButton
                                                key={index}
                                                padding="8px"
                                                borderRadius="4px"
                                                backgroundColor={isSelected ? AppTheme.primary : AppTheme.secondary}
                                                fontSize={12}
                                                hoverBackgroundColor={isSelected ? AppTheme.primary : undefined}
                                                hoverColor={isSelected ? AppTheme.secondary : undefined}
                                                color={isSelected ? AppTheme.secondary : AppTheme.primary}
                                                onClick={() => setRole(r)}
                                                title={r}
                                            />
                                        )
                                    })}
                                </Row>
                            </Column>
                        )}
                    </Row>
                    <SizedBox height={30} />
                    <ActionButton
                        padding="8px 12px"
                        backgroundColor={AppTheme.background}
                        color={AppTheme.primary}
                        fontSize={14}
                        borderRadius="10px"
                        onClick={handleUpdate}
                        useLoader={isSaving}
                        state={isSaving}
                        title={!isUpdateTeam ? "Unlock to update information" : "Save changes"}
                    />
                </Column>
            </Container>
            <SizedBox height={30} />
            <AdminList admin={admin} />
        </React.Fragment>
    )
})

type AdminListProps = {
    admin: AdminScopeResponse;
}

const AdminList: React.FC<AdminListProps> = observer(({ admin }) => {
    const children = admin.structure.findChildrenByParentId(admin.profile.id) ?? []
    const [list, setList] = React.useState(children)

    const buildList = () => {
        if(list && list.length > 0) {
            return (
                <Wrap spacing={20} runSpacing={20}>
                    {list.map((child, index) => <AdminView key={index} name={child.name} avatar={child.image} role={child.role} id={child.id} />)}
                </Wrap>
            )
        } else {
            return (
                <Container height={300} width ="100%">
                    <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center">
                        <Text text={`${admin.profile.name} has not invited any team member`} color={AppTheme.hint} size={16} opacity={8} />
                    </Column>
                </Container>
            )
        }
    }

    return (
        <Column crossAxis="flex-start">
            <Text text="Team Invite List" size={15} color={AppTheme.primary} />
            <SizedBox height={30} />
            {buildList()}
            <SizedBox height={20} />
            <Pager items={children} onSlice={setList} itemsPerPage={10} />
            <SizedBox height={30} />
        </Column>
    )
})

interface AdminViewProps {
    name: string;
    role: string;
    id: string;
    avatar: string;
}

const AdminView: React.FC<AdminViewProps> = observer(({ name, role, id, avatar }) => {
    const renderImage = (): JSX.Element => {
        if(avatar) {
            return (
                <Image image={avatar} height={40} style={{
                    borderRadius: "50%",
                    backgroundColor: AppTheme.appbarDark,
                    padding: "1px"
                }}/>
            )
        } else {
            return (
                <Container borderRadius="50%" height={40} width={40} padding="8px 7px" backgroundColor={Utility.getRandomColor()}>
                    <Column mainAxis="center" mainAxisSize="max">
                        <Text
                            align="center"
                            text={name.substring(0, 2)}
                            size={24}
                            color={Utility.lightenColor(Utility.getRandomColor(), 90)}
                            flow="ellipsis"
                        />
                    </Column>
                </Container>
            )
        }
    }

    return (
        <Container backgroundColor={AppTheme.appbar} width="400px" borderRadius="10px" padding="12px">
            <Row crossAxis="center" mainAxisSize="max">
                {renderImage()}
                <SizedBox width={10} />
                <Column crossAxis="flex-start">
                    <Text text={name} size={14} color={AppTheme.primary} />
                    <Text text={Utils.clearRole(role)} size={10} color={AppTheme.primary} />
                </Column>
                <Spacer />
                <Container
                    padding="8px 12px"
                    backgroundColor={AppTheme.background}
                    borderRadius="24px"
                    minWidth="90px"
                    onClick={() => Navigate.openInNewTab(RouteConfig.getRoute(AdminRoute, {slug: id}))}
                    hoverBackgroundColor={AppTheme.hover}
                >
                    <Text text="View profile" color={AppTheme.primary} size={12} />
                </Container>
            </Row>
        </Container>
    )
})

export default AdminTeamView