export interface IPermissionResponse {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
    permission: string;
    expiration?: string;
}

export class PermissionResponse implements IPermissionResponse {
    id?: number;
    createdAt?: string;
    updatedAt?: string;
    permission: string;
    expiration?: string;

    constructor({ id, createdAt, updatedAt, permission = '', expiration = '' }: Partial<IPermissionResponse> = {}) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.permission = permission;
        this.expiration = expiration;
    }

    copyWith({ id, createdAt, updatedAt, permission, expiration }: Partial<IPermissionResponse> = {}): PermissionResponse {
        return new PermissionResponse({
            id: id ?? this.id,
            createdAt: createdAt ?? this.createdAt,
            updatedAt: updatedAt ?? this.updatedAt,
            permission: permission ?? this.permission,
            expiration: expiration || this.expiration,
        });
    }

    static fromJson(json: any): PermissionResponse {
        return new PermissionResponse({
            id: json.id,
            createdAt: json.createdAt,
            updatedAt: json.updatedAt,
            permission: json.permission || '',
            expiration: json.expiration || ''
        });
    }

    toJson(): any {
        return {
            id: this.id,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            permission: this.permission,
            expiration: this.expiration
        };
    }
}
