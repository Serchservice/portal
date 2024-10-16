export interface IRequestedPermissionDetailsResponse {
    admin: string;
    name: string;
    granted: string;
    updatedBy?: string;
    updatedByName?: string;
}

export class RequestedPermissionDetailsResponse implements IRequestedPermissionDetailsResponse {
    admin: string;
    name: string;
    granted: string;
    updatedBy?: string;
    updatedByName?: string;

    constructor({
        admin = '',
        name = '',
        granted = '',
        updatedBy = '',
        updatedByName = ''
    }: Partial<IRequestedPermissionDetailsResponse> = {}) {
        this.admin = admin;
        this.name = name;
        this.granted = granted;
        this.updatedBy = updatedBy;
        this.updatedByName = updatedByName;
    }

    copyWith({
        admin,
        name,
        granted,
        updatedBy,
        updatedByName
    }: Partial<IRequestedPermissionDetailsResponse> = {}): RequestedPermissionDetailsResponse {
        return new RequestedPermissionDetailsResponse({
            admin: admin !== undefined ? admin : this.admin,
            name: name !== undefined ? name : this.name,
            granted: granted !== undefined ? granted : this.granted,
            updatedBy: updatedBy !== undefined ? updatedBy : this.updatedBy,
            updatedByName: updatedByName !== undefined ? updatedByName : this.updatedByName,
        });
    }

    static fromJson(json: any): RequestedPermissionDetailsResponse {
        return new RequestedPermissionDetailsResponse({
            admin: json.admin || '',
            name: json.name || '',
            granted: json.granted || '',
            updatedBy: json.updated_by || '',
            updatedByName: json.updated_by_name || '',
        });
    }

    static empty(): RequestedPermissionDetailsResponse {
        return new RequestedPermissionDetailsResponse({
            admin: '',
            name: '',
            granted: '',
            updatedBy: '',
            updatedByName: '',
        });
    }

    toJson(): any {
        return {
            admin: this.admin,
            name: this.name,
            granted: this.granted,
            updated_by: this.updatedBy,
            updated_by_name: this.updatedByName,
        };
    }
}