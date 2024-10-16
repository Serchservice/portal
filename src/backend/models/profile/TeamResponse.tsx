import { GrantedPermissionScopeResponse } from "../permission/GrantedPermissionScopeResponse";
import { GrantedSpecificPermissionResponse } from "../permission/GrantedSpecificPermissionResponse";

export interface ITeamResponse {
    role: string;
    position: string;
    department: string;
    cluster: GrantedPermissionScopeResponse[];
    specific: GrantedSpecificPermissionResponse[];
}

export class TeamResponse implements ITeamResponse {
    role: string;
    position: string;
    department: string;
    cluster: GrantedPermissionScopeResponse[];
    specific: GrantedSpecificPermissionResponse[];

    constructor(data: Partial<ITeamResponse> = {}) {
        this.role = data.role || '';
        this.position = data.position || '';
        this.department = data.department || '';
        this.cluster = data.cluster || [];
        this.specific = data.specific || [];
    }

    static fromJson(json: any): TeamResponse {
        return new TeamResponse({
            role: json.role || '',
            position: json.position || '',
            department: json.department || '',
            cluster: json.cluster ? json.cluster.map((c: any) => GrantedPermissionScopeResponse.fromJson(c)) : [],
            specific: json.specific ? json.specific.map((s: any) => GrantedSpecificPermissionResponse.fromJson(s)) : [],
        });
    }

    toJson(): any {
        return {
            role: this.role,
            position: this.position,
            department: this.department,
            cluster: this.cluster.map(c => c.toJson()),
            specific: this.specific.map(s => s.toJson()),
        };
    }

    copyWith(changes: Partial<ITeamResponse>): TeamResponse {
        return new TeamResponse({
            ...this,
            ...changes,
            cluster: changes.cluster ? changes.cluster.map(c => new GrantedPermissionScopeResponse(c)) : this.cluster,
            specific: changes.specific ? changes.specific.map(s => new GrantedSpecificPermissionResponse(s)) : this.specific,
        });
    }
}