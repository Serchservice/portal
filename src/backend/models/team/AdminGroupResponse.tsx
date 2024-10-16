import { AdminProfile } from "../profile/AdminProfile";

export interface IAdminGroupResponse {
    role: string;
    admins: AdminProfile[]
}

export class AdminGroupResponse implements IAdminGroupResponse {
    admins: AdminProfile[];
    role: string;

    constructor({ admins = [], role = "" }: Partial<IAdminGroupResponse> = {}) {
        this.admins = admins;
        this.role = role;
    }

    copyWith({ admins, role }: Partial<IAdminGroupResponse> = {}): AdminGroupResponse {
        return new AdminGroupResponse({
            admins: admins || this.admins,
            role: role || this.role,
        });
    }

    static fromJson(json: any): AdminGroupResponse {
        return new AdminGroupResponse({
            admins: json.admins ? json.admins.map((profile: any) => AdminProfile.fromJson(profile)) : [],
            role: json.role ? json.role : "",
        });
    }

    toJson(): any {
        return {
            admins: this.admins.map(profile => profile.toJson()),
            role: this.role ? this.role : "",
        };
    }
}