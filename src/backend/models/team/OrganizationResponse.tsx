import { CommonProfile } from "../profile/CommonProfile";

export interface IOrganizationResponse {
    id: number;
    username: string;
    avatar: string;
    instagram: string;
    linkedIn: string;
    twitter: string;
    position: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    qrCode: string;
    admin: CommonProfile | null;
}

export class OrganizationResponse implements IOrganizationResponse {
    id: number;
    username: string;
    avatar: string;
    instagram: string;
    linkedIn: string;
    twitter: string;
    position: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    qrCode: string;
    admin: CommonProfile | null;

    constructor(data: Partial<IOrganizationResponse> = {}) {
        this.id = data.id ?? 0;
        this.username = data.username ?? "";
        this.avatar = data.avatar ?? "";
        this.instagram = data.instagram ?? "";
        this.linkedIn = data.linkedIn ?? "";
        this.twitter = data.twitter ?? "";
        this.position = data.position ?? "";
        this.firstName = data.firstName ?? "";
        this.lastName = data.lastName ?? "";
        this.emailAddress = data.emailAddress ?? "";
        this.phoneNumber = data.phoneNumber ?? "";
        this.qrCode = data.qrCode ?? "";
        this.admin = data.admin ? new CommonProfile(data.admin) : null;
    }

    static fromJson(json: any): OrganizationResponse {
        return new OrganizationResponse({
            id: json.id ?? null,
            username: json.username ?? null,
            avatar: json.avatar ?? null,
            instagram: json.instagram ?? null,
            linkedIn: json.linkedIn ?? "",
            twitter: json.twitter ?? "",
            position: json.position ?? null,
            firstName: json.first_name ?? null,
            lastName: json.last_name ?? null,
            emailAddress: json.email_address ?? null,
            phoneNumber: json.phone_number ?? null,
            qrCode: json.qr_code ?? null,
            admin: json.admin ? CommonProfile.fromJson(json.admin) : null,
        });
    }

    toJson(): any {
        return {
            id: this.id,
            username: this.username,
            avatar: this.avatar,
            instagram: this.instagram,
            linkedIn: this.linkedIn,
            twitter: this.twitter,
            position: this.position,
            first_name: this.firstName,
            last_name: this.lastName,
            email_address: this.emailAddress,
            phone_number: this.phoneNumber,
            qr_code: this.qrCode,
            admin: this.admin ? this.admin.toJson() : null,
        };
    }

    copyWith(changes: Partial<IOrganizationResponse>): OrganizationResponse {
        return new OrganizationResponse({
            id: changes.id ?? this.id,
            username: changes.username ?? this.username,
            avatar: changes.avatar ?? this.avatar,
            instagram: changes.instagram ?? this.instagram,
            linkedIn: changes.linkedIn ?? this.linkedIn,
            twitter: changes.twitter ?? this.twitter,
            position: changes.position ?? this.position,
            firstName: changes.firstName ?? this.firstName,
            lastName: changes.lastName ?? this.lastName,
            emailAddress: changes.emailAddress ?? this.emailAddress,
            phoneNumber: changes.phoneNumber ?? this.phoneNumber,
            qrCode: changes.qrCode ?? this.qrCode,
            admin: changes.admin ?? this.admin,
        });
    }

    get name(): string{
        return `${this.firstName} ${this.lastName}`
    }
}