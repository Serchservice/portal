import RequestedPermission from "./RequestedPermission";

interface IGroupRequestedPermission {
    label: string;
    createdAt: string;
    requests: RequestedPermission[];
}

class GroupRequestedPermission implements IGroupRequestedPermission {
    label: string;
    createdAt: string;
    requests: RequestedPermission[];

    constructor({
        label = '',
        createdAt = '',
        requests = [],
    }: Partial<IGroupRequestedPermission> = {}) {
        this.label = label;
        this.createdAt = createdAt;
        this.requests = requests.map(request => new RequestedPermission(request));
    }

    static fromJson(json: any): GroupRequestedPermission {
        return new GroupRequestedPermission({
            label: json.label || '',
            createdAt: json.createdAt || '',
            requests: json.requests ? json.requests.map((req: any) => RequestedPermission.fromJson(req)) : [],
        });
    }

    toJson(): any {
        return {
            label: this.label,
            createdAt: this.createdAt,
            requests: this.requests.map(request => request.toJson()),
        };
    }

    copyWith({
        label,
        createdAt,
        requests,
    }: Partial<IGroupRequestedPermission> = {}): GroupRequestedPermission {
        return new GroupRequestedPermission({
            label: label !== undefined ? label : this.label,
            createdAt: createdAt !== undefined ? createdAt : this.createdAt,
            requests: requests !== undefined ? requests.map(request => new RequestedPermission(request)) : this.requests,
        });
    }
}

export default GroupRequestedPermission;