import { IProfile } from "./Profile";

export interface IAdminProfile extends IProfile {
    empId: string;
    shouldResendInvite: boolean;
}

export class AdminProfile implements IAdminProfile {
    id: string;
    empId: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    status: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    accountCreatedAt: string;
    accountUpdatedAt: string;
    profileCreatedAt: string;
    profileUpdatedAt: string;
    emailConfirmedAt: string;
    passwordUpdatedAt: string;
    lastSignedIn: string;
    role: string;
    shouldResendInvite: boolean;

    constructor(data: Partial<IAdminProfile> = {}) {
        this.id = data.id || '';
        this.empId = data.empId || '';
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.emailAddress = data.emailAddress || '';
        this.status = data.status || '';
        this.avatar = data.avatar || '';
        this.createdAt = data.createdAt || '';
        this.updatedAt = data.updatedAt || '';
        this.accountCreatedAt = data.accountCreatedAt || '';
        this.accountUpdatedAt = data.accountUpdatedAt || '';
        this.profileCreatedAt = data.profileCreatedAt || '';
        this.profileUpdatedAt = data.profileUpdatedAt || '';
        this.emailConfirmedAt = data.emailConfirmedAt || '';
        this.passwordUpdatedAt = data.passwordUpdatedAt || '';
        this.lastSignedIn = data.lastSignedIn || '';
        this.role = data.role || '';
        this.shouldResendInvite = data.shouldResendInvite || false;
    }

    static fromJson(json: any): AdminProfile {
        return new AdminProfile({
            id: json.id || '',
            empId: json.empId || '',
            firstName: json.firstName || '',
            lastName: json.lastName || '',
            emailAddress: json.emailAddress || '',
            status: json.status || '',
            avatar: json.avatar || '',
            createdAt: json.createdAt || '',
            updatedAt: json.updatedAt || '',
            accountCreatedAt: json.accountCreatedAt || '',
            accountUpdatedAt: json.accountUpdatedAt || '',
            profileCreatedAt: json.profileCreatedAt || '',
            profileUpdatedAt: json.profileUpdatedAt || '',
            emailConfirmedAt: json.emailConfirmedAt || '',
            passwordUpdatedAt: json.passwordUpdatedAt || '',
            lastSignedIn: json.lastSignedIn || '',
            role: json.role || '',
            shouldResendInvite: json.shouldResendInvite || false,
        });
    }

    toJson(): IAdminProfile {
        return {
            id: this.id,
            empId: this.empId,
            firstName: this.firstName,
            lastName: this.lastName,
            emailAddress: this.emailAddress,
            status: this.status,
            avatar: this.avatar,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            accountCreatedAt: this.accountCreatedAt,
            accountUpdatedAt: this.accountUpdatedAt,
            profileCreatedAt: this.profileCreatedAt,
            profileUpdatedAt: this.profileUpdatedAt,
            emailConfirmedAt: this.emailConfirmedAt,
            passwordUpdatedAt: this.passwordUpdatedAt,
            lastSignedIn: this.lastSignedIn,
            role: this.role,
            shouldResendInvite: this.shouldResendInvite,
        };
    }

    copyWith(changes: Partial<IAdminProfile>): AdminProfile {
        return new AdminProfile({
            ...this.toJson(),
            ...changes,
        });
    }

    get name(): string {
        return `${ this.firstName } ${ this.lastName }`
    }

    get isActive(): boolean {
        return this.status === "ACTIVE";
    }

    get short(): string {
        if(this.firstName && this.lastName) {
            return (this.firstName.charAt(0) + this.lastName.charAt(0)).toUpperCase();
        } else if(this.firstName) {
            return this.firstName.charAt(0).toUpperCase();
        } else if(this.lastName) {
            return this.lastName.charAt(0).toUpperCase();
        }
        return "";
    }
}