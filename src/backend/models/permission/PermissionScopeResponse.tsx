export interface IPermissionScopeResponse {
    scope: string;
    name: string;
}

export class PermissionScopeResponse implements IPermissionScopeResponse {
    scope: string;
    name: string;

    constructor({ scope = '', name = '' }: Partial<IPermissionScopeResponse> = {}) {
        this.scope = scope;
        this.name = name;
    }

    copyWith({ scope, name }: Partial<IPermissionScopeResponse> = {}): PermissionScopeResponse {
        return new PermissionScopeResponse({
            scope: scope || this.scope,
            name: name || this.name,
        });
    }

    static fromJson(json: any): PermissionScopeResponse {
        return new PermissionScopeResponse({
            scope: json.scope || '',
            name: json.name || '',
        });
    }

    toJson(): any {
        return {
            scope: this.scope,
            name: this.name,
        };
    }

    static empty(): PermissionScopeResponse {
        return new PermissionScopeResponse();
    }
}