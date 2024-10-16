import { PermissionResponse } from "./PermissionResponse";

export interface IGrantedPermissionScopeResponse {
    id?: number;
    scope: string;
    createdAt?: string;
    updatedAt?: string;
    permissions: PermissionResponse[];
}

export class GrantedPermissionScopeResponse implements IGrantedPermissionScopeResponse {
    id?: number;
    scope: string;
    createdAt?: string;
    updatedAt?: string;
    permissions: PermissionResponse[];

    constructor({id, scope = '', createdAt, updatedAt, permissions = []}: Partial<IGrantedPermissionScopeResponse> = {}) {
        this.id = id;
        this.scope = scope;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.permissions = permissions;
    }

    copyWith({id, scope, createdAt, updatedAt, permissions}: Partial<IGrantedPermissionScopeResponse> = {}): GrantedPermissionScopeResponse {
        return new GrantedPermissionScopeResponse({
            id: id || this.id,
            scope: scope || this.scope,
            createdAt: createdAt || this.createdAt,
            updatedAt: updatedAt || this.updatedAt,
            permissions: permissions || this.permissions,
        });
    }

    static fromJson(json: any): GrantedPermissionScopeResponse {
        return new GrantedPermissionScopeResponse({
            id: json.id,
            scope: json.scope || '',
            createdAt: json.createdAt,
            updatedAt: json.updatedAt,
            permissions: json.permissions ? json.permissions.map((permission: any) => PermissionResponse.fromJson(permission)) : [],
        });
    }

    toJson(): any {
        return {
            id: this.id,
            scope: this.scope,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            permissions: this.permissions.map(permission => permission.toJson()),
        };
    }
}