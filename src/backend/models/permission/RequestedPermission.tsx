import { RequestedPermissionDetailsResponse } from "./RequestedPermissionDetailsResponse";
import RequestedPermissionAccountDetailsResponse from "./RequestedPermissionAccountDetailsResponse";
import { PermissionStatus } from "../../../utils/Enums";

interface IRequestedPermission {
    permission: string;
    scope: string;
    message: string;
    id: number;
    status: string;
    label: string;
    account: RequestedPermissionAccountDetailsResponse;
    expiration: string;
    details: RequestedPermissionDetailsResponse;
    reason: string;
}

class RequestedPermission implements IRequestedPermission {
    permission: string;
    scope: string;
    message: string;
    id: number;
    status: string;
    label: string;
    account: RequestedPermissionAccountDetailsResponse;
    expiration: string;
    details: RequestedPermissionDetailsResponse;
    reason: string;

    constructor({
        permission = '',
        scope = '',
        message = '',
        id = 0,
        status = '',
        label = '',
        account = new RequestedPermissionAccountDetailsResponse(),
        expiration = '',
        details = {} as RequestedPermissionDetailsResponse,
        reason = '',
    }: Partial<IRequestedPermission> = {}) {
        this.permission = permission;
        this.scope = scope;
        this.message = message;
        this.id = id;
        this.status = status;
        this.label = label;
        this.account = account;
        this.expiration = expiration;
        this.details = details;
        this.reason = reason;
    }

    static fromJson(json: any): RequestedPermission {
        return new RequestedPermission({
            permission: json.permission || '',
            scope: json.scope || '',
            message: json.message || '',
            id: json.id || 0,
            status: json.status || '',
            label: json.label || '',
            account: json.account ? RequestedPermissionAccountDetailsResponse.fromJson(json.account) : new RequestedPermissionAccountDetailsResponse(),
            expiration: json.expiration || '',
            details: json.details ? RequestedPermissionDetailsResponse.fromJson(json.details) : RequestedPermissionDetailsResponse.empty(),
            reason: json.reason || '',
        });
    }

    toJson(): any {
        return {
            permission: this.permission,
            scope: this.scope,
            message: this.message,
            id: this.id,
            status: this.status,
            label: this.label,
            account: this.account.toJson(),
            expiration: this.expiration,
            details: this.details,
            reason: this.reason,
        };
    }

    copyWith({
        permission,
        scope,
        message,
        id,
        status,
        label,
        account,
        expiration,
        details,
        reason,
    }: Partial<IRequestedPermission> = {}): RequestedPermission {
        return new RequestedPermission({
            permission: permission !== undefined ? permission : this.permission,
            scope: scope !== undefined ? scope : this.scope,
            message: message !== undefined ? message : this.message,
            id: id !== undefined ? id : this.id,
            status: status !== undefined ? status : this.status,
            label: label !== undefined ? label : this.label,
            account: account !== undefined ? account : this.account,
            expiration: expiration !== undefined ? expiration : this.expiration,
            details: details !== undefined ? details : this.details,
            reason: reason !== undefined ? reason : this.reason,
        });
    }

    get title(): string {
        if (this.account.account) {
            return `${this.scope} (${this.account.account}) - ${this.permission}`;
        } else {
            return `${this.scope} - ${this.permission}`;
        }
    }

    get isGranted(): boolean {
        return this.status.toUpperCase() === PermissionStatus.APPROVED;
    }

    get isRevoked(): boolean {
        return this.status.toUpperCase() === PermissionStatus.REVOKED;
    }

    get isPending(): boolean {
        return this.status.toUpperCase() === PermissionStatus.PENDING;
    }

    get isDeclined(): boolean {
        return this.status.toUpperCase() === PermissionStatus.REJECTED;
    }
}

export default RequestedPermission;