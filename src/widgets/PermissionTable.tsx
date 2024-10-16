import { ActionButton, Column, Container, Row, Shimmer, SizedBox, Text, Utility } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import AppTheme from "../configuration/Theme";
import { GrantedPermissionScopeResponse } from "../backend/models/permission/GrantedPermissionScopeResponse";
import permissionStore from "../backend/database/device/PermissionStore";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Permission } from "../utils/Enums";
import preferenceStore from "../backend/database/device/PreferenceStore";

interface DataTableProps {
    headers: string[];
    permissions: GrantedPermissionScopeResponse[];
    account?: string;
    canUpdate?: boolean;
    onUpdated?: (update: UpdatePermissionRequest[]) => void;
}

interface PermissionTableProps extends DataTableProps {
    isLoading?: boolean;
}

const mainWidth = "48%";
const childWidth = "14%";

const PermissionTable: React.FC<PermissionTableProps> = observer(({
    headers,
    permissions,
    account,
    canUpdate,
    isLoading,
    onUpdated
}) => {
    if(isLoading) {
        return (<LoadingTable />)
    } else {
        return (<DataTable headers={headers} permissions={permissions} account={account} canUpdate={canUpdate} onUpdated={onUpdated} />)
    }
})

const LoadingTable: React.FC = observer(() => {
    const dimmed = preferenceStore.read.isDark;

    const buildHeader = (): JSX.Element => {
        return (
            <Row crossAxis="center" mainAxisSize="max">
                {Utility.itemGenerate(5).map((_, index) => {
                    const isFirst = index === 0
                    return (
                        <Container key={index} width={isFirst ? mainWidth : childWidth} border={`1px solid ${AppTheme.hint}`} padding="10px">
                            <Shimmer height={20} width={isFirst ? 140 : 50} dimmed={dimmed} />
                        </Container>
                    )
                })}
            </Row>
        )
    }

    const buildBody = () => {
        return (
            <React.Fragment>
                {Utility.itemGenerate(10).map((_, index) => {
                    return (
                        <Row key={index} crossAxis="center" mainAxisSize="max">
                            <Container key={index} width={mainWidth} padding="14px 10px">
                                <Shimmer height={14} width={100} dimmed={dimmed} />
                            </Container>
                            {Utility.itemGenerate(4).map((_, i) => {
                                return (
                                    <Container key={i} width={childWidth} padding="10px">
                                        <Shimmer height={20} width={20} dimmed={dimmed} />
                                    </Container>
                                )
                            })}
                        </Row>
                    )
                })}
            </React.Fragment>
        )
    }

    return (
        <Column crossAxis="flex-start">
            {buildHeader()}
            <Container backgroundColor={AppTheme.appbar} width="100%">
                {buildBody()}
            </Container>
        </Column>
    )
})

interface ScopeRow {
    scope: string;
    scopeId?: number;
    scopeName: string;
    account?: string;
    permissions: PermissionRow[]
}

interface PermissionRow {
    can: boolean;
    id?: number;
    expiration?: string;
    permission: Permission;
}

function createRow({scope = '', scopeId, scopeName = "", account, permissions = []}: ScopeRow): ScopeRow {
    return { scope, scopeId, scopeName, account, permissions };
}

export interface UpdatePermissionRequest {
    id?: number,
    scope: string,
    permissions: PermissionRequest[]
}

interface PermissionRequest {
    permission: string,
    id?: number
}

const DataTable: React.FC<DataTableProps> = observer(({ headers, permissions, account, canUpdate, onUpdated }) => {
    const permitList = permissionStore.read

    const getPermissions = (): ScopeRow[] => {
        const mergedScopes = permitList.map((store) => {
            const scope = permissions.find((permit) => permit.scope === store.scope);
            const list = scope?.permissions;

            const read = list?.find(permission => permission.permission.toLowerCase().includes('read'));
            const write = list?.find(permission => permission.permission.toLowerCase().includes('write'));
            const update = list?.find(permission => permission.permission.toLowerCase().includes('update'));
            const remove = list?.find(permission => permission.permission.toLowerCase().includes('delete'));

            const canRead = !!read;
            const canWrite = !!write;
            const canUpdate = !!update;
            const canDelete = !!remove;

            return createRow({
                scope: store.scope,
                scopeId: scope?.id,
                scopeName: store.name,
                account: account,
                permissions: [
                    {can: canRead, id: read && read.id, permission: Permission.READ, expiration: read?.expiration},
                    {can: canWrite, id: write && write.id, permission: Permission.WRITE, expiration: write?.expiration},
                    {can: canUpdate, id: update && update.id, permission: Permission.UPDATE, expiration: update?.expiration},
                    {can: canDelete, id: remove && remove.id, permission: Permission.DELETE, expiration: remove?.expiration},
                ]
            });
        });

        return mergedScopes;
    }

    const [update, setUpdate] = React.useState<ScopeRow[]>(getPermissions())
    const [list] = React.useState<ScopeRow[]>(getPermissions())
    const hasChanges = JSON.stringify(list) !== JSON.stringify(update);

    const handleUpdate = (can: boolean, scope: string, permission: Permission, id?: number) => {
        const updated = update.map(row => {
            if (row.scope === scope) {
                const updatedPermissions = row.permissions.map(perm => {
                    if ((id !== undefined && perm.id === id) || perm.permission === permission) {
                        return { ...perm, can };
                    }
                    return perm;
                });

                return { ...row, permissions: updatedPermissions };
            }
            return row;
        })

        setUpdate(updated);
    };

    const handleChanges = () => {
        const updateList: UpdatePermissionRequest[] = update
            .filter(data => data.permissions.some(perm => perm.can))
            .map(data => {
                if(data.scopeId) {
                    return ({
                        id: data.scopeId,
                        scope: data.scope,
                        permissions: data.permissions
                            .filter(perm => perm.can)
                            .map(perm => {
                                if(perm.id) {
                                    return ({
                                        permission: perm.permission.toUpperCase(),
                                        id: perm.id || 0
                                    })
                                } else {
                                    return ({
                                        permission: perm.permission.toUpperCase(),
                                    })
                                }
                            })
                    })
                } else {
                    return ({
                        scope: data.scope,
                        permissions: data.permissions
                            .filter(perm => perm.can)
                            .map(perm => ({
                                permission: perm.permission.toUpperCase(),
                            }))
                    })
                }
            })
            .filter(scope => scope.permissions.length > 0);

        if(onUpdated) {
            onUpdated(updateList);
        }
    };

    const buildHeader = (): JSX.Element => {
        return (
            <Row crossAxis="center" mainAxisSize="max">
                {headers.map((header, index) => {
                    const isFirst = index === 0
                    return (
                        <Container key={index} width={isFirst ? mainWidth : childWidth} border={`1px solid ${AppTheme.hint}`} padding="10px">
                            <Text text={header} size={14} color={AppTheme.hint} align={isFirst ? "left" : "center"} />
                        </Container>
                    )
                })}
            </Row>
        )
    }

    const buildBody = () => {
        return (
            <React.Fragment>
                {update.map((item, index) => {
                    return (
                        <Row key={index} crossAxis="center" mainAxisSize="max">
                            <Container key={index} width={mainWidth} padding="14px 10px">
                                <Text text={item.scopeName} size={14} color={AppTheme.primary} />
                            </Container>
                            {item.permissions.map((permit, i) => {
                                return (
                                    <Container key={i} width={childWidth} padding="10px">
                                        <Checker
                                            check={permit.can}
                                            canCheck={canUpdate ?? false}
                                            expiration={permit.expiration}
                                            onUpdate={v => handleUpdate(v, item.scope, permit.permission, permit.id)}
                                        />
                                    </Container>
                                )
                            })}
                        </Row>
                    )
                })}
            </React.Fragment>
        )
    }

    return (
        <Column crossAxis="flex-start">
            {buildHeader()}
            <Container backgroundColor={AppTheme.appbar} width="100%">
                {buildBody()}
                {hasChanges && (<SizedBox height={30} />)}
                {hasChanges && (
                    <Row crossAxis="center" mainAxis="center">
                        <ActionButton
                            padding="8px 12px"
                            backgroundColor={AppTheme.background}
                            color={AppTheme.primary}
                            fontSize={14}
                            borderRadius="10px"
                            onClick={handleChanges}
                            title="Update permissions"
                        />
                    </Row>
                )}
                {hasChanges && (<SizedBox height={20} />)}
            </Container>
        </Column>
    )
})

interface CheckerProps {
    check: boolean;
    canCheck: boolean;
    expiration?: string;
    onUpdate: (check: boolean) => void;
}

const Checker: React.FC<CheckerProps> = observer(({ check, canCheck, onUpdate, expiration }) => {
    const [isChecked, setIsChecked] = React.useState(check);

    return (
        <Column mainAxis="center" crossAxis="center" style={{gap: "5px"}}>
            <Container
                border={`1px solid ${AppTheme.primary}`}
                height={20}
                width={20}
                borderRadius="6px"
                onClick={canCheck ? () => {
                    const value = !isChecked

                    setIsChecked(value);
                    onUpdate(value)
                } : undefined}
            >
                {isChecked && (<Icon icon="stash:square-check-duotone" height="100%" width="100%" color={AppTheme.success} />)}
            </Container>
            {expiration && (<PermissionExpiration message={expiration} short />)}
        </Column>
    )
})

const parseExpiration = (message: string): { days: number; hours: number; minutes: number } => {
    const parts = message.split(' : ').map(part => parseInt(part, 10));

    let days = 0;
    let hours = 0;
    let minutes = 0;

    // Assign values based on the number of parts
    if (parts.length === 3) {
        [days, hours, minutes] = parts;
    } else if (parts.length === 2) {
        [hours, minutes] = parts;
    } else if (parts.length === 1) {
        [minutes] = parts;
    }

    // Ensure that parsed values are set to 0 if they were NaN
    days = isNaN(days) ? 0 : days;
    hours = isNaN(hours) ? 0 : hours;
    minutes = isNaN(minutes) ? 0 : minutes;

    return { days, hours, minutes };
};

interface PermissionExpirationProps {
    message: string;
    short?: boolean;
}

export const PermissionExpiration: React.FC<PermissionExpirationProps> = observer(({ message, short }) => {
    const [timeLeft, setTimeLeft] = React.useState(parseExpiration(message));

    React.useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prevTime => {
                let { days, hours, minutes } = prevTime;

                if (minutes > 0) {
                    minutes -= 1;
                } else if (hours > 0) {
                    hours -= 1;
                    minutes = 59;
                } else if (days > 0) {
                    days -= 1;
                    hours = 23;
                    minutes = 59;
                } else {
                    // Time is up
                    clearInterval(interval);
                }

                return { days, hours, minutes };
            });
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

    const formatTimeLeft = (): string => {
        const { days, hours, minutes } = timeLeft;
        const parts: string[] = [];

        if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
        if (hours > 0) parts.push(`${hours} ${short ? "hr" : "hour"}${hours !== 1 ? 's' : ''}`);
        if (minutes > 0) parts.push(`${minutes} ${short ? "min" : "minute"}${minutes !== 1 ? 's' : ''}`);

        return parts.join(', ');
    };

    return (
        <div>
            {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 ? (
                <Text text="Expired" color={AppTheme.error} size={12} />
            ) : (
                <Text text={`Expires in: ${formatTimeLeft()}`} color={AppTheme.success} size={12} />
            )}
        </div>
    );
});

export default PermissionTable