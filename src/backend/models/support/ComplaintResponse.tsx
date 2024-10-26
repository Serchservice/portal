import { CommonProfile } from "../profile/CommonProfile";

export interface IComplaintResponse {
    id: string;
    comment: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    admin?: CommonProfile;
}

class ComplaintResponse implements IComplaintResponse {
    id: string;
    comment: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    admin?: CommonProfile

    constructor({
        id = '',
        comment = '',
        status = '',
        createdAt = '',
        updatedAt = '',
        admin
    }: Partial<IComplaintResponse> = {}) {
        this.id = id;
        this.comment = comment;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.admin = admin;
    }

    static fromJson(json: any): ComplaintResponse {
        return new ComplaintResponse({
            id: json.id || '',
            comment: json.comment || '',
            status: json.status || '',
            createdAt: json.createdAt || '',
            updatedAt: json.updatedAt || '',
            admin: json.admin ? CommonProfile.fromJson(json.admin) : undefined,
        });
    }

    toJson(): any {
        return {
            id: this.id,
            comment: this.comment,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            admin: this.admin?.toJson(),
        };
    }

    copyWith({
        id = this.id,
        comment = this.comment,
        status = this.status,
        createdAt = this.createdAt,
        updatedAt = this.updatedAt,
        admin = this.admin,
    }: Partial<IComplaintResponse> = {}): ComplaintResponse {
        return new ComplaintResponse({
            id,
            comment,
            status,
            createdAt,
            updatedAt,
            admin
        });
    }

    get isOpen(): boolean {
        return this.status !== "RESOLVED"
    }
}

export default ComplaintResponse