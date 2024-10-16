import { ActionButton, Column, Container, DrawerDialog, ModalProps, Notify, Row, SizedBox, Text, TextAreaField } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import AppTheme from "../../../../../configuration/Theme";
import { Permission, PermissionType } from "../../../../../utils/Enums";
import PermissionScopeSelector from "./PermissionScopeSelector";
import PermissionSelector from "./PermissionSelector";
import PermissionTypeSelector from "./PermissionTypeSelector";
import Connect from "../../../../../backend/api/Connect";

const RequestPermission: React.FC<ModalProps> = observer(({isOpen, handleClose}) => {
    const [selectedScope, setSelectedScope] = React.useState<string>();
    const [selectedSpecificScope, setSelectedSpecificScope] = React.useState<string>()
    const [selectedType, setSelectedType] = React.useState<PermissionType>();
    const [selectedPermissions, setSelectedPermissions] = React.useState<Permission[]>();
    const [reasons, setReasons] = React.useState<{ [key: string]: string }>({});

    const [isRequesting, setIsRequesting] = React.useState(false);

    const connect = new Connect({})

    async function handleRequest() {
        const isCluster = selectedType === PermissionType.CLUSTER;

        const cluster = isCluster ? {
            scope: selectedScope,
            permissions: selectedPermissions?.map((permission) => ({
                permission: permission.toUpperCase(),
                reason: reasons[permission] || "",
            }))
        } : null

        const specific = isCluster ? null : {
            account: selectedSpecificScope,
            scopes: [
                {
                    scope: selectedScope,
                    permissions: selectedPermissions?.map((permission) => ({
                        permission: permission.toUpperCase(),
                        reason: reasons[permission] || "",
                    }))
                }
            ]
        }

        setIsRequesting(true)
        const response = await connect.post("/admin/permission/request", {cluster: cluster, specific: specific})
        setIsRequesting(false)

        if(response) {
            if(response.isSuccess) {
                Notify.success(response.message)
                handleClose()
            } else {
                Notify.error(response.message)
            }
        }
    }

    const handleReasonChange = (permission: Permission, value: string) => {
        setReasons((prevReasons) => ({
            ...prevReasons,
            [permission]: value,
        }));
    };

    return (
        <DrawerDialog isOpen={isOpen} handleClose={handleClose} position="right" bgColor={AppTheme.appbar} width={380}>
            <Column>
                <Container padding="18px" backgroundColor={AppTheme.background}>
                    <Text text="What permission do you want to request?" color={AppTheme.primary} size={16} />
                </Container>
                <SizedBox height={30} />
                <PermissionTypeSelector
                    selected={selectedType}
                    onSelected={type => {
                        setSelectedType(type);
                        setSelectedScope("")
                    }}
                />
                <SizedBox height={20} />
                <PermissionScopeSelector
                    scope={selectedScope}
                    onScopeUpdated={scope => {
                        setSelectedScope(scope)
                        setSelectedPermissions([])
                    }}
                    specificScope={selectedSpecificScope}
                    onSpecificScopeUpdated={scope => {
                        setSelectedSpecificScope(scope)
                        setSelectedPermissions([])
                    }}
                    type={selectedType}
                />
                <SizedBox height={20} />
                {(selectedScope && selectedType) && (
                    <PermissionSelector
                        selected={selectedPermissions}
                        onPermissionAdded={permission => {
                            const found = selectedPermissions?.includes(permission);
                            if(found) {
                                setSelectedPermissions(selectedPermissions?.filter((i) => i !== permission))
                            } else {
                                setSelectedPermissions(prev => ([...prev ?? [], permission]))
                            }
                        }}
                    />
                )}
                <SizedBox height={20} />
                {(selectedScope && selectedType && selectedPermissions && selectedPermissions.length > 0) && (
                    selectedPermissions.map((perm, index) => {
                        return (
                            <Column key={index} mainAxisSize="min" crossAxisSize="min" style={{margin: "0 12px 12px"}}>
                                <Text text={`Reason for ${perm} request`} color={AppTheme.hint} />
                                <SizedBox height={10} />
                                <TextAreaField
                                    isRequired={true}
                                    placeHolder=""
                                    value={reasons[perm] || ""}
                                    onChange={(value) => handleReasonChange(perm, value)}
                                    borderRadius={8}
                                    rows={6}
                                    needSpacer={false}
                                    backgroundColor={AppTheme.appbar}
                                    color={AppTheme.primary}
                                    borderColor={AppTheme.primary}
                                />
                            </Column>
                        )
                    })
                )}
                <SizedBox height={50} />
                {(selectedScope && selectedType && selectedPermissions && selectedPermissions.length > 0) && (
                    <Row crossAxis="flex-end" mainAxis="flex-end">
                        <ActionButton
                            padding="14px"
                            backgroundColor={AppTheme.secondary}
                            color={AppTheme.primary}
                            fontSize={14}
                            borderRadius="0"
                            onClick={handleRequest}
                            useLoader={isRequesting}
                            state={isRequesting}
                            title="Request"
                        />
                    </Row>
                )}
                {(selectedScope && selectedType && selectedPermissions) && (<SizedBox height={20} />)}
            </Column>
        </DrawerDialog>
    )
})

export default RequestPermission;