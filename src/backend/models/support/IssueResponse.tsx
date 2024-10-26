import { CommonProfile } from "../profile/CommonProfile";

export interface IIssueResponse {
    id: number;
    message: string;
    label: string;
    sentAt: string;
    isRead: boolean;
    isSerch: boolean;
    profile: CommonProfile;
}

class IssueResponse implements IIssueResponse {
    id: number;
    message: string;
    label: string;
    sentAt: string;
    isRead: boolean;
    isSerch: boolean;
    profile: CommonProfile;

    constructor({
        id = 0,
        message = '',
        label = '',
        sentAt = '',
        isRead = false,
        isSerch = false,
        profile = new CommonProfile()
    }: Partial<IIssueResponse> = {}) {
        this.id = id;
        this.message = message;
        this.label = label;
        this.sentAt = sentAt;
        this.isRead = isRead;
        this.isSerch = isSerch;
        this.profile = profile;
    }

    static fromJson(json: any): IssueResponse {
        return new IssueResponse({
            id: json.id || 0,
            message: json.message || '',
            label: json.label || '',
            sentAt: json.sent_at || '',
            isRead: json.is_read || false,
            isSerch: json.is_serch || false,
            profile: json.profile ? CommonProfile.fromJson(json.profile) : new CommonProfile(),
        });
    }

    toJson(): any {
        return {
            id: this.id,
            message: this.message,
            label: this.label,
            sent_at: this.sentAt,
            profile: this.profile.toJson(),
            is_read: this.isRead,
            is_serch: this.isSerch,
        };
    }

    copyWith({
        id = this.id,
        message = this.message,
        label = this.label,
        sentAt = this.sentAt,
        isRead = this.isRead,
        isSerch = this.isSerch,
        profile = this.profile,
    }: Partial<IIssueResponse> = {}): IssueResponse {
        return new IssueResponse({
            id,
            message,
            label,
            sentAt,
            isRead,
            isSerch,
            profile
        });
    }
}

export default IssueResponse