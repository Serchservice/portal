export interface IPermissionAccountSearchResponse {
    id: string;
    name: string;
    avatar: string;
    role: string;
    scopes: string[];
}

export class PermissionAccountSearchResponse implements IPermissionAccountSearchResponse {
    id: string;
    name: string;
    avatar: string;
    role: string;
    scopes: string[];

    constructor({
        id = '', name = '', avatar = '', role = '', scopes = []
    }: Partial<IPermissionAccountSearchResponse> = {}) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.role = role;
        this.scopes = scopes;
    }

    copyWith({
        id, name, avatar, role, scopes
    }: Partial<IPermissionAccountSearchResponse> = {}): PermissionAccountSearchResponse {
        return new PermissionAccountSearchResponse({
            id: id || this.id,
            name: name || this.name,
            avatar: avatar || this.avatar,
            role: role || this.role,
            scopes: scopes || this.scopes,
        });
    }

    static fromJson(json: any): PermissionAccountSearchResponse {
        return new PermissionAccountSearchResponse({
            id: json.id || '',
            name: json.name || '',
            avatar: json.avatar || '',
            role: json.role || '',
            scopes: json.scopes || [],
        });
    }

    toJson(): any {
        return {
            id: this.id,
            name: this.name,
            avatar: this.avatar,
            role: this.role,
            scopes: this.scopes,
        };
    }
}