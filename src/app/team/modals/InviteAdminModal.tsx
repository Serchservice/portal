import { Icon } from "@iconify/react/dist/iconify.js";
import { ActionButton, Column, Container, DrawerDialog, Field, ModalProps, Notify, Row, Shimmer, SizedBox, Spacer, Text, useGo, Wrap } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import Connect from "../../../backend/api/Connect";
import authStore from "../../../backend/database/auth/AuthStore";
import Routing from "../../../configuration/Routing";
import AppTheme from "../../../configuration/Theme";
import { Permission } from "../../../utils/Enums";
import Utils from "../../../utils/Utils";
import permissionStore from "../../../backend/database/device/PermissionStore";
import { GrantedPermissionScopeResponse, IGrantedPermissionScopeResponse } from "../../../backend/models/permission/GrantedPermissionScopeResponse";
import preferenceStore from "../../../backend/database/device/PreferenceStore";

const InviteAdminModal: React.FC<ModalProps> = observer(({isOpen, handleClose}) => {
    const connect = new Connect({})

    const [firstName, setFirstName] = React.useState<string>("")
    const [lastName, setLastName] = React.useState<string>("")
    const [emailAddress, setEmailAddress] = React.useState<string>("")
    const [position, setPosition] = React.useState<string>("")
    const [department, setDepartment] = React.useState<string>("")
    const [role, setRole] = React.useState<string>("")
    const [scopes, setScopes] = React.useState<Record<string, string[]>>({});
    const [isLoading, setIsLoading] = React.useState(false)

    const [cluster, setCluster] = React.useState<GrantedPermissionScopeResponse[]>()

    const go = useGo()

    const validate = () => {
        if(!firstName.trim() || firstName.trim() === "" || firstName.trim().length < 3) {
            Notify.warning("First name cannot be empty or less than 3 characters")
            return
        }

        if(!lastName.trim() || lastName.trim() === "" || lastName.trim().length < 3) {
            Notify.warning("Last name cannot be empty or less than 3 characters")
            return
        }

        if(!emailAddress.trim() || emailAddress.trim() === "") {
            Notify.warning("Email address cannot be empty")
            return
        }

        if(!emailAddress.trim().endsWith("@serchservice.com")) {
            Notify.warning("Email address must be of Serchservice organization email domain")
            return
        }

        if(!role || role === "") {
            Notify.warning(`You must assign a role to ${firstName}`)
            return
        }

        if(!position.trim() || position.trim() === "" || position.trim().length < 3) {
            Notify.warning("Position cannot be empty or less than 3 characters")
            return
        }
    }

    async function invite() {
        if(isLoading) {
            return
        } else {
            validate()
            setIsLoading(true)

            const scopeList = [];
            for (const [key, permissions] of Object.entries(scopes)) {
                const formattedKey = key.toUpperCase().replace(/\s+/g, '_');
                const formattedPermissions = permissions.map(permission => permission.toUpperCase());
                scopeList.push({ scope: formattedKey, permissions: formattedPermissions });
            }

            const response = await connect.post("/auth/admin/invite", {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                email_address: emailAddress.trim(),
                department: department.trim(),
                role: role.toUpperCase().trim(),
                position: position.trim(),
                scopes: scopeList
            })

            setIsLoading(false)
            if (response) {
                if (response.isSuccess) {
                    Notify.success(response.message)
                    go(Routing.instance.team.path)
                    return
                } else {
                    Notify.error(response.message)
                    return
                }
            }
        }
    }

    const comments = [
        "Assign permission (If not, your scoped permissions will be attached to the created team member)",
        "Inviting a team member means that you can view and modify the team member's info. (This permission can be revoked)"
    ]
    const roles = permissionStore.getAssignableRoles();


    React.useEffect(() => {
        async function fetch() {
            await permissionStore.getGrantedClusterPermissions().then((data) => setCluster(data))
        }

        fetch()
    }, [])

    return (
        <DrawerDialog isOpen={isOpen} handleClose={handleClose} position="right" bgColor={AppTheme.appbar} width={450}>
            <Column>
                <Container padding="18px" backgroundColor={AppTheme.background}>
                    <Text text="Invite a team member" color={AppTheme.primary} size={16} />
                </Container>
                <Container padding="12px" backgroundColor={AppTheme.appbarDark} margin="14px">
                    <Text text={`Hello ${authStore.read.firstName}`} color="#ffffff" size={14} />
                    <SizedBox height={7} />
                    <Text text="Setting up a team account is the easiest job! However, note the following:" color={AppTheme.hint} size={12} />
                    <SizedBox height={10} />
                    {comments.map((comment, index) => (
                        <React.Fragment key={index}>
                            <Text text={`* ${comment}`} color={AppTheme.hint} size={12} />
                            {comments.length - 1 !== index && (<SizedBox height={5} />)}
                        </React.Fragment>
                    ))}
                </Container>
                <SizedBox height={30} />
                <form>
                    <Container padding="14px" width="100%">
                        <Field
                            needLabel
                            backgroundColor={AppTheme.appbar}
                            color={AppTheme.primary}
                            label="First Name"
                            placeHolder="John"
                            value={firstName}
                            fontSize={14}
                            onChange={v => setFirstName(v)}
                            labelColor={AppTheme.primary}
                        />
                        <Field
                            needLabel
                            backgroundColor={AppTheme.appbar}
                            color={AppTheme.primary}
                            label="Last Name"
                            placeHolder="Martins"
                            value={lastName}
                            fontSize={14}
                            onChange={v => setLastName(v)}
                            labelColor={AppTheme.primary}
                        />
                        <Field
                            type="email"
                            label="Email Address"
                            isRequired={true}
                            placeHolder="johnmartins@serchservice.com"
                            autoComplete="email"
                            value={emailAddress}
                            fontSize={14}
                            onChange={e => setEmailAddress(e)}
                            backgroundColor={AppTheme.appbar}
                            labelColor={AppTheme.primary}
                            color={AppTheme.primary}
                        />
                        <Field
                            needLabel
                            backgroundColor={AppTheme.appbar}
                            color={AppTheme.primary}
                            label="Position"
                            placeHolder="Creative Director"
                            value={position}
                            fontSize={14}
                            onChange={v => setPosition(v)}
                            labelColor={AppTheme.primary}
                        />
                        <Field
                            needLabel
                            backgroundColor={AppTheme.appbar}
                            color={AppTheme.primary}
                            label="Department"
                            placeHolder="Marketing"
                            value={department}
                            fontSize={14}
                            onChange={v => setDepartment(v)}
                            labelColor={AppTheme.primary}
                        />
                        <Text text={`What is ${firstName || "member"}'s role?`} color={AppTheme.primary} size={14} />
                        <SizedBox height={8} />
                        <Wrap spacing={10} runSpacing={10}>
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
                        </Wrap>
                        <SizedBox height={22} />
                        <Text text={`What permission scopes should ${firstName || "member"} have? (Click to expand)`} color={AppTheme.primary} size={14} />
                        <SizedBox height={8} />
                        {cluster && (
                            <Wrap runSpacing={10}>
                                {cluster.map((cluster, index) => {
                                    return (
                                        <PermissionPicker
                                            scope={cluster}
                                            key={index}
                                            onScopesUpdated={setScopes}
                                            scopes={scopes}
                                        />
                                    )
                                })}
                            </Wrap>
                        )}
                        {!cluster && (<Shimmer height={300} width="100%" radius={6} dimmed={preferenceStore.read.isDark} />)}
                        <SizedBox height={30} />
                        <ActionButton
                            padding="10px 16px"
                            backgroundColor={AppTheme.appbarLight}
                            fontSize={14}
                            onClick={invite}
                            useLoader={isLoading}
                            state={isLoading}
                            title={`Invite ${firstName}`}
                        />
                    </Container>
                </form>
            </Column>
        </DrawerDialog>
    )
})

interface PermissionPickerProps {
    scopes: Record<string, string[]>;
    onScopesUpdated: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
    scope: IGrantedPermissionScopeResponse;
}

const PermissionPicker: React.FC<PermissionPickerProps> = observer(({ scopes, onScopesUpdated, scope }) => {
    const [isWide, setIsWide] = React.useState<boolean>(false);
    const [data, setData] = React.useState<Record<string, string[]>>(scopes)

    const handlePermissionClick = (permission: string) => {
        const permit = permission.toUpperCase()

        const updatedScopes = {...scopes, [scope.scope]: [...(scopes[scope.scope] || [])]};

        if (!updatedScopes[scope.scope]) {
            updatedScopes[scope.scope] = [];
        }

        if (updatedScopes[scope.scope].includes(permit)) {
            updatedScopes[scope.scope] = updatedScopes[scope.scope].filter(p => p !== permit);
        } else {
            updatedScopes[scope.scope].push(permit);
        }

        // Remove the key if the list is empty
        if (updatedScopes[scope.scope].length === 0) {
            delete updatedScopes[scope.scope];
        }

        setData(updatedScopes)
        console.log(updatedScopes)
        onScopesUpdated(updatedScopes);
    };

    const isScopeSelected = data[scope.scope] && data[scope.scope].length > 0

    const isPermissionSelected = (permission: string) => {
        return isScopeSelected && data[scope.scope].includes(permission.toUpperCase());
    };

    const options = [
        {
            description: `View the record/s attached to the ${Utils.clearRole(scope.scope).toLowerCase()} scope`,
            permission: Permission.READ
        },
        {
            description: `Update and modify the record/s attached to the ${Utils.clearRole(scope.scope).toLowerCase()} scope`,
            permission: Permission.UPDATE
        },
        {
            description: `Create record/s and attach them to the ${Utils.clearRole(scope.scope).toLowerCase()} scope`,
            permission: Permission.WRITE
        },
        {
            description: `Delete and destroy the record/s attached to the ${Utils.clearRole(scope.scope).toLowerCase()} scope`,
            permission: Permission.DELETE
        },
    ]

    return (
        <Container
            width="100%"
            height={isWide ? "auto" : "38px"}
            backgroundColor={isScopeSelected ? "#212836" : "#050404"}
            padding="10px"
            borderRadius="12px"
        >
            <Container width="100%" onClick={() => setIsWide(!isWide)}>
                <Row mainAxisSize="max" crossAxis="center">
                    <Text text={Utils.clearRole(scope.scope)} color="#ffffff" size={14} />
                    <Spacer />
                    <Icon
                        icon="duo-icons:menu"
                        width="1.2em"
                        height="1.2em"
                        color="#ffffff"
                        style={{ transition: "all 0.3s", transform: isWide ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    />
                </Row>
            </Container>
            {isWide && (<SizedBox height={12} />)}
            {(isWide) && options.map((option, index) => {
                const isSelected = isPermissionSelected(option.permission)

                return (
                    <Container
                        key={index}
                        padding="10px"
                        borderRadius="6px"
                        margin={index !== options.length - 1 ? "0 0 10px 0" : ""}
                        onClick={() => handlePermissionClick(option.permission)}
                        backgroundColor={isSelected ? AppTheme.primary : AppTheme.primaryLight}
                    >
                        <Text text={option.permission} size={14} color={isSelected ? AppTheme.secondary : AppTheme.primary} />
                        <SizedBox height={10} />
                        <Text text={option.description} size={12} color={AppTheme.hint} />
                    </Container>
                )
            })}
        </Container>
    )
})

export default InviteAdminModal