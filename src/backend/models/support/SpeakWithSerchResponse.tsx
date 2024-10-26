import { CommonProfile } from "../profile/CommonProfile";
import IssueResponse from "./IssueResponse";

export interface ISpeakWithSerchResponse {
    ticket: string;
    label: string;
    time: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    issues: IssueResponse[];
    assignedAdmin?: CommonProfile;
    closedBy?: CommonProfile;
    resolvedBy?: CommonProfile;
    user: CommonProfile;
}

class SpeakWithSerchResponse implements ISpeakWithSerchResponse {
    ticket: string;
    label: string;
    time: string;
    issues: IssueResponse[];
    assignedAdmin?: CommonProfile;
    closedBy?: CommonProfile;
    resolvedBy?: CommonProfile;
    user: CommonProfile;
    createdAt: string;
    updatedAt: string;
    status: string;

    constructor({
        ticket = '',
        label = '',
        time = '',
        issues = [],
        createdAt = '',
        updatedAt = '',
        assignedAdmin,
        resolvedBy,
        closedBy,
        status = '',
        user = new CommonProfile({})
    }: Partial<ISpeakWithSerchResponse> = {}) {
        this.ticket = ticket;
        this.label = label;
        this.time = time;
        this.issues = issues;
        this.assignedAdmin = assignedAdmin;
        this.resolvedBy = resolvedBy;
        this.closedBy = closedBy;
        this.user = user;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.status = status;
    }

    static fromJson(json: any): SpeakWithSerchResponse {
        return new SpeakWithSerchResponse({
            ticket: json.ticket || '',
            status: json.status || '',
            label: json.label || '',
            time: json.time || '',
            createdAt: json.created_at || '',
            updatedAt: json.updated_at || '',
            issues: json.issues ? json.issues.map((c: any) => IssueResponse.fromJson(c)) : [],
            assignedAdmin: json.assignedAdmin && CommonProfile.fromJson(json.assignedAdmin),
            resolvedBy: json.resolvedBy && CommonProfile.fromJson(json.resolvedBy),
            closedBy: json.closedBy && CommonProfile.fromJson(json.closedBy),
            user: json.user ? CommonProfile.fromJson(json.user) : new CommonProfile(),
        });
    }

    toJson(): any {
        return {
            ticket: this.ticket,
            label: this.label,
            time: this.time,
            status: this.status,
            issues: this.issues.map(c => c.toJson()),
            assignedAdmin: this.assignedAdmin?.toJson(),
            resolvedBy: this.resolvedBy?.toJson(),
            closedBy: this.closedBy?.toJson(),
            user: this.user.toJson(),
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        };
    }

    copyWith({
        ticket = this.ticket,
        label = this.label,
        time = this.time,
        status = this.status,
        issues = this.issues,
        assignedAdmin = this.assignedAdmin,
        resolvedBy = this.resolvedBy,
        closedBy = this.closedBy,
        user = this.user,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
    }: Partial<ISpeakWithSerchResponse> = {}): SpeakWithSerchResponse {
        return new SpeakWithSerchResponse({
            ticket,
            label,
            time,
            issues,
            status,
            user,
            assignedAdmin,
            resolvedBy,
            closedBy,
            createdAt,
            updatedAt,
        });
    }

    get pendingCount(): number {
        return this.issues.filter(complaint => !complaint.isRead && !complaint.isSerch).length
    }

    get totalCount(): number {
        return this.issues.length
    }

    get isOpen(): boolean {
        return (this.status !== "CLOSED") && (this.status !== "RESOLVED")
    }
}

export default SpeakWithSerchResponse