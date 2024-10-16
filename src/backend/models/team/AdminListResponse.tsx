import { AdminGroupResponse } from "./AdminGroupResponse";
import { CompanyStructureResponse } from "./CompanyStructureResponse";

export interface IAdminListResponse {
    admins: AdminGroupResponse[];
    structure: CompanyStructureResponse | null;
}

export class AdminListResponse implements IAdminListResponse {
    admins: AdminGroupResponse[];
    structure: CompanyStructureResponse | null;

    constructor({ admins = [], structure = null }: Partial<IAdminListResponse> = {}) {
        this.admins = admins;
        this.structure = structure;
    }

    copyWith({ admins, structure }: Partial<IAdminListResponse> = {}): AdminListResponse {
        return new AdminListResponse({
            admins: admins || this.admins,
            structure: structure || this.structure,
        });
    }

    static fromJson(json: any): AdminListResponse {
        return new AdminListResponse({
            admins: json.admins ? json.admins.map((group: any) => AdminGroupResponse.fromJson(group)) : [],
            structure: json.structure ? CompanyStructureResponse.fromJson(json.structure) : null,
        });
    }

    toJson(): any {
        return {
            admins: this.admins.map(group => group.toJson()),
            structure: this.structure ? this.structure.toJson() : null,
        };
    }
}