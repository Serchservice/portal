// RequestedPermissionAccountDetailsResponse.ts

interface IRequestedPermissionAccountDetailsResponse {
    account: string;
    name: string;
    role: string;
}

class RequestedPermissionAccountDetailsResponse implements IRequestedPermissionAccountDetailsResponse {
    account: string;
    name: string;
    role: string;

    constructor({
        account = '',
        name = '',
        role = '',
    }: Partial<IRequestedPermissionAccountDetailsResponse> = {}) {
        this.account = account;
        this.name = name;
        this.role = role;
    }

    static fromJson(json: any): RequestedPermissionAccountDetailsResponse {
        return new RequestedPermissionAccountDetailsResponse({
            account: json.account || '',
            name: json.name || '',
            role: json.role || '',
        });
    }

    toJson(): any {
        return {
            account: this.account,
            name: this.name,
            role: this.role,
        };
    }
}

export default RequestedPermissionAccountDetailsResponse;