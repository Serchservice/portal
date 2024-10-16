import { action, computed, makeAutoObservable, observable } from 'mobx';
import store from 'store2';
import Store from '../Store';
import { Permission, Role } from '../../../utils/Enums';
import { PermissionScopeResponse } from '../../models/permission/PermissionScopeResponse';
import authStore from '../auth/AuthStore';
import adminStore from '../auth/AdminStore';
import { GrantedSpecificPermissionResponse } from '../../models/permission/GrantedSpecificPermissionResponse';
import { GrantedPermissionScopeResponse } from '../../models/permission/GrantedPermissionScopeResponse';
import { PermissionResponse } from '../../models/permission/PermissionResponse';
import Admin from '../../models/profile/Admin';
import Connect from '../../api/Connect';

const STORAGE_KEY = "permissionDb"

/**
 * Store for managing PermissionScopeResponse data.
 * @implements Store<PermissionScopeResponse>
 */
class PermissionStore implements Store<PermissionScopeResponse[]> {
    /** The current permission data. */
    permissions: PermissionScopeResponse[] = [];
    admin: Admin;

    constructor() {
        makeAutoObservable(this, {
            permissions: observable,
            read: computed,
            set: action,
            clear: action,
            getAssignableRoles: action,
            getGrantedSpecificPermissions: action,
            getGrantedClusterPermissions: action,
        });

        this.admin = adminStore.read;
        const saved = store.get(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            if(Array.isArray(parsed)) {
                this.permissions = parsed.map((d) => PermissionScopeResponse.fromJson(d));
            }
        }
    }

    /**
     * Get the current permissions data.
     * @returns {PermissionScopeResponse} The current permissions data.
     */
    get read(): PermissionScopeResponse[] {
        return this.permissions;
    }

    /**
     * Set new permissions data.
     * @param {PermissionScopeResponse} data - The new permissions data.
     */
    set(data: PermissionScopeResponse[]): void {
        this.permissions = data;
        store.set(STORAGE_KEY, JSON.stringify(data.map((d) => d.toJson())));
    }

    /**
     * Clear the permissions data.
     */
    clear(): void {
        this.permissions = [];
        store.remove(STORAGE_KEY);
    }

    getAssignableRoles(): Role[] {
        if(authStore.read.isSuper) {
            return Object.values(Role).filter(role => role !== Role.SUPER)
        } else {
            return Object.values(Role).filter(role => role !== Role.SUPER && role !== Role.ADMIN)
        }
    }

    async getGrantedSpecificPermissions(): Promise<GrantedSpecificPermissionResponse[]> {
        const specific = this.admin.team.specific

        if(specific && specific.length > 0) {
            return specific;
        } else {
            const connect = new Connect({withError: false})
            const result = await connect.get<Admin>("/admin/profile");

            if(result && result.data) {
                const admin = Admin.fromJson(result.data);
                adminStore.set(admin);

                return admin.team.specific;
            }
        }

        return [];
    }

    async getGrantedClusterPermissions(): Promise<GrantedPermissionScopeResponse[]> {
        const auth = authStore.read;

        if(auth.isSuper) {
            return this.permissions.map(scope => new GrantedPermissionScopeResponse({
                id: 0,
                scope: scope.scope,
                permissions: Object.keys(Permission).map(permission => new PermissionResponse({
                    permission: permission
                }))
            }));
        } else {
            const cluster = this.admin.team.cluster

            if(cluster && cluster.length > 0) {
                return cluster;
            } else {
                const connect = new Connect({withError: false})
                const result = await connect.get<Admin>("/admin/profile");

                if(result && result.data) {
                    const admin = Admin.fromJson(result.data);
                    adminStore.set(admin);

                    return admin.team.cluster;
                }
            }

            return [];
        }
    }
}

const permissionStore = new PermissionStore();
export default permissionStore;