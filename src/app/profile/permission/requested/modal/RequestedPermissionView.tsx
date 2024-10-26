import { Icon } from "@iconify/react/dist/iconify.js";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import {
    Column, Container, DrawerDialog, ExtraButton, ModalProps, Notify,
    Padding, Row, SimpleStep, SizedBox, Spacer, Text, Utility, Wrap
} from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import Connect from "../../../../../backend/api/Connect";
import authStore from "../../../../../backend/database/auth/AuthStore";
import GroupRequestedPermission from "../../../../../backend/models/permission/GroupRequestedPermission";
import RequestedPermission from "../../../../../backend/models/permission/RequestedPermission";
import { RouteConfig } from "../../../../../configuration/Route";
import AppTheme from "../../../../../configuration/Theme";
import Utils from "../../../../../utils/Utils";
import { PermissionExpiration } from "../../../../../widgets/PermissionTable";

interface RequestedPermissionViewProps extends ModalProps {
    permission: RequestedPermission;
    onUpdated: (list: GroupRequestedPermission[]) => void
}

const RequestedPermissionView: React.FC<RequestedPermissionViewProps> = observer(({permission, isOpen, handleClose, onUpdated}) => {
    const [permit, setPermit] = React.useState(permission)

    const [isGranting, setIsGranting] = React.useState(false);
    const [showTime, setShowTime] = React.useState(false);
    const [isRevoking, setIsRevoking] = React.useState(false);
    const [isDeclining, setIsDeclining] = React.useState(false);
    const [isCancelling, setIsCancelling] = React.useState(false)

    const connect = new Connect({})
    const [expiration, setExpiration] = React.useState<string | null>(null)

    async function handleGrant() {
        if(!showTime) {
            setShowTime(true)
            return
        } else if(isGranting) {
            return
        } else {
            setIsGranting(true)

            const param = expiration ? `&expiration=${expiration}` : ''
            const response = await connect.patch(`/admin/permission/grant?id=${permit.id}${param}`)
            setIsGranting(false)

            if(response) {
                if(response.isSuccess) {
                    if(Array.isArray(response.data)) {
                        handleUpdate(response.data.map((d) => GroupRequestedPermission.fromJson(d)))
                    }
                    setShowTime(false)
                    Notify.success(response.message)
                } else {
                    Notify.error(response.message)
                }
            }
        }
    }

    const handleUpdate = (result: GroupRequestedPermission[]) => {
        const current = result.flatMap(r => r.requests).find(d => d.id === permit.id);
        if(current) {
            setPermit(current)
        }
        onUpdated(result)
    }

    async function handleRevoke() {
        if(isRevoking) {
            return
        } else {
            setIsRevoking(true)
            const response = await connect.patch(`/admin/permission/revoke?id=${permit.id}`)
            setIsRevoking(false)

            if(response) {
                if(response.isSuccess) {
                    if(Array.isArray(response.data)) {
                        handleUpdate(response.data.map((d) => GroupRequestedPermission.fromJson(d)))
                    }
                    Notify.success(response.message)
                } else {
                    Notify.error(response.message)
                }
            }
        }
    }

    async function handleDecline() {
        if(isDeclining) {
            return
        } else {
            setIsDeclining(true)
            const response = await connect.patch(`/admin/permission/decline?id=${permit.id}`)
            setIsDeclining(false)

            if(response) {
                if(response.isSuccess) {
                    if(Array.isArray(response.data)) {
                        handleUpdate(response.data.map((d) => GroupRequestedPermission.fromJson(d)))
                    }
                    Notify.success(response.message)
                } else {
                    Notify.error(response.message)
                }
            }
        }
    }

    async function handleCancel() {
        if(isCancelling) {
            return
        } else {
            setIsCancelling(true)
            const response = await connect.patch(`/admin/permission/cancel?id=${permit.id}`)
            setIsCancelling(false)

            if(response) {
                if(response.isSuccess) {
                    if(Array.isArray(response.data)) {
                        handleUpdate(response.data.map((d) => GroupRequestedPermission.fromJson(d)))
                    }
                    Notify.success(response.message)
                } else {
                    Notify.error(response.message)
                }
            }
        }
    }

    const updateButtons = [
        permit.isPending && {
            title: "Grant permission",
            state: isGranting,
            onClick: handleGrant,
            color: AppTheme.success
        },
        permit.isGranted && {
            title: "Revoke permission",
            state: isRevoking,
            onClick: handleRevoke,
            color: AppTheme.error
        },
        permit.isPending && {
            title: "Decline permission",
            state: isDeclining,
            onClick: handleDecline,
            color: AppTheme.error
        }
    ]

    const isSpecific = permit.account && permit.account.account !== ""
    const requestedByCurrentAdmin = permit.details && permit.details.admin === authStore.read.id;
    const requestingAdminLink = requestedByCurrentAdmin ? undefined : RouteConfig.getAccountRoute("admin", permit.details.admin)

    const updatedByCurrentAdmin = permit.details && permit.details.updatedBy && permit.details.updatedBy === authStore.read.id;
    const updatingAdminLink = updatedByCurrentAdmin
        ? undefined
        : permit.details.updatedBy
            ? RouteConfig.getAccountRoute("admin", permit.details.updatedBy)
            : undefined

    const color = permit.isGranted ? AppTheme.success : permit.isPending ? AppTheme.pending : AppTheme.error
    const icon = permit.isGranted ? "duo-icons:check-circle" : permit.isRevoked ? "lets-icons:cancel-duotone" : "solar:clock-circle-bold-duotone"

    const steps = [
        {
            title: "Identifier",
            value: `${permit.id}`
        },
        {
            title: "Time of Request",
            value: permit.label
        },
        {
            title: "Scope",
            value: permit.scope
        },
        {
            title: "Permission",
            value: permit.permission
        },
        {
            title: "Status",
            value: permit.status
        }
    ]

    const accountSteps = permit.account && permit.account.account ? [
        {
            title: "Name",
            value: permit.account.name
        },
        {
            title: "Identifier",
            value: permit.account.account
        },
        {
            title: "Role",
            value: permit.account.role
        }
    ] : undefined

    const requestingAdminSteps = (permit.details && !requestedByCurrentAdmin) ? [
        {
            title: "Name",
            value: permit.details.name
        },
        {
            title: "Identifier",
            value: permit.details.admin
        }
    ] : undefined

    const updatingAdminSteps = (permit.details && (permit.details.updatedByName || permit.details.updatedBy)) ? [
        {
            title: "Name",
            value: permit.details.updatedByName || ""
        },
        {
            title: "Identifier",
            value: permit.details.updatedBy || ""
        }
    ] : undefined

    return (
        <DrawerDialog isOpen={isOpen} handleClose={handleClose} position="right" bgColor={AppTheme.appbar} width={380}>
            <Column>
                <Container padding="12px" backgroundColor={AppTheme.background}>
                    <Row crossAxis="center" mainAxisSize="max">
                        <Column style={{gap: "4px"}}>
                            <Text text={isSpecific ? "SPECIFIC" : "CLUSTER"} color={AppTheme.hint} size={11} />
                            <Text text={`${Utils.clearRole(permit.scope)} ::: ${permit.permission}`} color={AppTheme.primary} opacity={8} size={12} />
                        </Column>
                        <Spacer />
                        <Icon icon={icon} height="2.5em" width="2.5em" color={ color } />
                    </Row>
                </Container>
                <Padding all={12}>
                    <Column gap="20px">
                        <Container width="100%">
                            <Text text="Request Information" size={12} color={AppTheme.hint} />
                            <SizedBox height={12} />
                            {steps.map((step, index) => {
                                const color = (step.value && step.value.toLowerCase() === "granted")
                                    ? AppTheme.success
                                    : (step.value && step.value.toLowerCase() === "revoked")
                                    ? AppTheme.error
                                    : (step.value && step.value.toLowerCase() === "pending")
                                    ? AppTheme.pending
                                    : AppTheme.primary

                                return (
                                    <SimpleStep
                                        key={index}
                                        content={
                                            <Padding only={{top: 3}}>
                                                <Row mainAxisSize="max" crossAxis="center" style={{width: "100%"}}>
                                                    <Text text={`${step.title}:`} size={14} color={AppTheme.primary} />
                                                    <Spacer />
                                                    <Text text={Utils.clearRole(step.value)} size={14} color={color} />
                                                </Row>
                                            </Padding>
                                        }
                                        height={10}
                                        color={AppTheme.hint}
                                        showBottom={steps.length - 1 !== index}
                                    />
                                )
                            })}
                        </Container>
                        {permit.expiration && !permit.isRevoked && (<PermissionExpiration message={permit.expiration} />)}
                        <Container backgroundColor={AppTheme.background} borderRadius="6px" padding="6px">
                            <Text text="Request Detail" color={AppTheme.hint} size={12} />
                            <SizedBox height={10} />
                            <Text text={permit.message} color={AppTheme.primary} size={14} />
                        </Container>
                        <Container backgroundColor={AppTheme.background} borderRadius="6px" padding="6px">
                            <Text text="Reason for request" color={AppTheme.hint} size={12} />
                            <SizedBox height={10} />
                            <Text text={permit.reason} color={AppTheme.primary} size={14} />
                        </Container>
                        {accountSteps && (
                            <Container width="100%">
                                <Text text="Associated Account" size={12} color={AppTheme.hint} />
                                <SizedBox height={12} />
                                {accountSteps.map((step, index) => {
                                    return (
                                        <SimpleStep
                                            key={index}
                                            content={
                                                <Padding only={{top: 3}}>
                                                    <Row mainAxisSize="max" crossAxis="center" style={{width: "100%"}}>
                                                        <Text text={`${step.title}:`} size={14} color={AppTheme.primary} />
                                                        <Spacer />
                                                        <Text text={Utils.clearRole(step.value)} size={14} color={AppTheme.primary} />
                                                    </Row>
                                                </Padding>
                                            }
                                            height={10}
                                            color={AppTheme.hint}
                                            showBottom={accountSteps.length - 1 !== index}
                                        />
                                    )
                                })}
                                <SizedBox height={6} />
                                <Row crossAxis="center">
                                    <Container
                                        borderRadius="10px"
                                        backgroundColor={AppTheme.background}
                                        padding="5px 5px 4px"
                                        link={RouteConfig.getAccountRoute(permit.account.role, permit.account.account)}
                                    >
                                        <Row crossAxis="center" crossAxisSize="min" mainAxisSize="min" gap="10px">
                                            <Text text="View profile" size={11} color={AppTheme.hint} />
                                            <Icon icon="fluent:open-20-filled" width="0.7em" height="0.7em" style={{color: AppTheme.hint}} />
                                        </Row>
                                    </Container>
                                </Row>
                            </Container>
                        )}
                        {requestingAdminSteps && (
                            <Container width="100%">
                                <Text text="Requesting Admin Information" size={12} color={AppTheme.hint} />
                                <SizedBox height={12} />
                                {requestingAdminSteps.map((step, index) => {
                                    return (
                                        <SimpleStep
                                            key={index}
                                            content={
                                                <Padding only={{top: 3}}>
                                                    <Row mainAxisSize="max" crossAxis="center" style={{width: "100%"}}>
                                                        <Text text={`${step.title}:`} size={14} color={AppTheme.primary} />
                                                        <Spacer />
                                                        <Text text={Utils.clearRole(step.value)} size={14} color={AppTheme.primary} />
                                                    </Row>
                                                </Padding>
                                            }
                                            height={10}
                                            color={AppTheme.hint}
                                            showBottom={requestingAdminSteps.length - 1 !== index}
                                        />
                                    )
                                })}
                                <SizedBox height={6} />
                                <Row crossAxis="center">
                                    <Container borderRadius="10px" backgroundColor={AppTheme.background} padding="5px 5px 4px" link={requestingAdminLink}>
                                        <Row crossAxis="center" crossAxisSize="min" mainAxisSize="min" gap="10px">
                                            <Text text="View profile" size={11} color={AppTheme.hint} />
                                            <Icon icon="fluent:open-20-filled" width="0.7em" height="0.7em" style={{color: AppTheme.hint}} />
                                        </Row>
                                    </Container>
                                </Row>
                            </Container>
                        )}
                        {updatingAdminSteps && (
                            <Container width="100%">
                                <Text text="Updating Admin Information (Admin who made last update to this request)" size={12} color={AppTheme.hint} />
                                <SizedBox height={12} />
                                {updatingAdminSteps.map((step, index) => {
                                    return (
                                        <SimpleStep
                                            key={index}
                                            content={
                                                <Padding only={{top: 3}}>
                                                    <Row mainAxisSize="max" crossAxis="center" style={{width: "100%"}}>
                                                        <Text text={`${step.title}:`} size={14} color={AppTheme.primary} />
                                                        <Spacer />
                                                        <Text text={Utils.clearRole(step.value)} size={14} color={AppTheme.primary} />
                                                    </Row>
                                                </Padding>
                                            }
                                            height={10}
                                            color={AppTheme.hint}
                                            showBottom={updatingAdminSteps.length - 1 !== index}
                                        />
                                    )
                                })}
                                <SizedBox height={6} />
                                <Row crossAxis="center">
                                    <Container borderRadius="10px" backgroundColor={AppTheme.background} padding="5px 5px 4px" link={updatingAdminLink}>
                                        <Row crossAxis="center" crossAxisSize="min" mainAxisSize="min" gap="10px">
                                            <Text text="View profile" size={11} color={AppTheme.hint} />
                                            <Icon icon="fluent:open-20-filled" width="0.7em" height="0.7em" style={{color: AppTheme.hint}} />
                                        </Row>
                                    </Container>
                                </Row>
                            </Container>
                        )}
                        {(requestedByCurrentAdmin && permit.isPending) && (
                            <ExtraButton
                                title="Cancel request"
                                color={AppTheme.primary}
                                backgroundColor={AppTheme.background}
                                padding="4px 8px"
                                borderRadius="24px"
                                onClick={handleCancel}
                                hoverColor={AppTheme.hover}
                                fontSize="12px"
                                state={isCancelling}
                            />
                        )}
                        {showTime && (<SizedBox height={10} />)}
                        {showTime && (
                            <Container>
                                <Text text="Set an expiration time for this permission (Optional)" color={AppTheme.hint} size={12} />
                                <SizedBox height={10} />
                                <MobileDateTimePicker
                                    orientation="landscape"
                                    onChange={(date) => {
                                        if (date) {
                                            setExpiration(date.toISOString());
                                        }
                                    }}
                                    sx={{
                                        width: "100%",
                                        '& .MuiInputBase-root input': {
                                            padding: "12px",
                                            color: AppTheme.primary,
                                            borderRadius: "12px",
                                            cursor: "pointer"
                                        },
                                        '& .MuiInputBase-root fieldset': {
                                            borderColor: AppTheme.hint,
                                            borderRadius: "12px"
                                        },
                                    }}
                                />
                            </Container>
                        )}
                        {!requestedByCurrentAdmin && (<SizedBox height={showTime ? 0 : 20} />)}
                        {!requestedByCurrentAdmin && (
                            <Wrap spacing={10} runSpacing={10}>
                                {updateButtons.map((button, index) => {
                                    if(button) {
                                        return (
                                            <ExtraButton
                                                title={button.title}
                                                color={button.color}
                                                key={index}
                                                backgroundColor={Utility.lightenColor(button.color, 70)}
                                                padding="4px 8px"
                                                borderRadius="24px"
                                                onClick={button.onClick}
                                                hoverColor={AppTheme.hover}
                                                fontSize="12px"
                                                state={button.state}
                                            />
                                        )
                                    } else {
                                        return(<React.Fragment key={index}></React.Fragment>)
                                    }
                                })}
                            </Wrap>
                        )}
                    </Column>
                </Padding>
            </Column>
        </DrawerDialog>
    )
})

export default RequestedPermissionView;