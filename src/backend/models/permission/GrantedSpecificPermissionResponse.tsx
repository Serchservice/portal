import { GrantedPermissionScopeResponse } from "./GrantedPermissionScopeResponse";

export interface IGrantedSpecificPermissionResponse {
    name: string;
    account: string;
    scopes: GrantedPermissionScopeResponse[];
}

export class GrantedSpecificPermissionResponse implements IGrantedSpecificPermissionResponse {
    name: string;
    account: string;
    scopes: GrantedPermissionScopeResponse[];

    constructor({name = '', account = '', scopes = []}: Partial<IGrantedSpecificPermissionResponse> = {}) {
        this.name = name;
        this.account = account;
        this.scopes = scopes;
    }

    copyWith({name, account, scopes}: Partial<IGrantedSpecificPermissionResponse> = {}): GrantedSpecificPermissionResponse {
        return new GrantedSpecificPermissionResponse({
            name: name || this.name,
            account: account || this.account,
            scopes: scopes || this.scopes,
        });
    }

    static fromJson(json: any): GrantedSpecificPermissionResponse {
        return new GrantedSpecificPermissionResponse({
            name: json.name || '',
            account: json.account || '',
            scopes: json.scopes ? json.scopes.map((permission: any) => GrantedPermissionScopeResponse.fromJson(permission)) : [],
        });
    }

    toJson(): any {
        return {
            name: this.name,
            account: this.account,
            scopes: this.scopes.map(permission => permission.toJson()),
        };
    }
}
