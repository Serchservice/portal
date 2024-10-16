export interface IAdminActivityResponse {
    id: number;
    activity: string;
    associated: string;
    label: string;
    createdAt: string;
    updatedAt: string;
    header: string;
    tag: string;
}

export class AdminActivityResponse implements IAdminActivityResponse {
    id: number;
    activity: string;
    associated: string;
    label: string;
    createdAt: string;
    updatedAt: string;
    header: string;
    tag: string;

    constructor({
        id = 0,
        activity = '',
        associated = '',
        label = '',
        createdAt = '',
        updatedAt = '',
        header = '',
        tag = ''
    }: Partial<IAdminActivityResponse> = {}) {
        this.id = id;
        this.activity = activity;
        this.associated = associated;
        this.label = label;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.header = header;
        this.tag = tag;
    }

    copyWith({
        id, activity, associated, label, createdAt, updatedAt, header, tag
    }: Partial<IAdminActivityResponse> = {}): AdminActivityResponse {
        return new AdminActivityResponse({
            id: id || this.id,
            activity: activity || this.activity,
            associated: associated || this.associated,
            label: label || this.label,
            createdAt: createdAt || this.createdAt,
            updatedAt: updatedAt || this.updatedAt,
            header: header || this.header,
            tag: tag || this.tag,
        });
    }

    static fromJson(json: any): AdminActivityResponse {
        return new AdminActivityResponse({
            id: json.id || 0,
            activity: json.activity || '',
            associated: json.associated || '',
            label: json.label || '',
            createdAt: json.createdAt || '',
            updatedAt: json.updatedAt || '',
            header: json.header || '',
            tag: json.tag || '',
        });
    }

    toJson(): any {
        return {
            id: this.id,
            activity: this.activity,
            associated: this.associated,
            label: this.label,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            header: this.header,
            tag: this.tag,
        };
    }
}