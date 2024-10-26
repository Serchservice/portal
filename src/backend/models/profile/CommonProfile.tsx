export interface ICommonProfile {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    status: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    role: string;
    category: string;
}

export class CommonProfile implements ICommonProfile {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    status: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    category: string;
    role: string;

    constructor(data: Partial<ICommonProfile> = {}) {
        this.id = data.id || '';
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.emailAddress = data.emailAddress || '';
        this.status = data.status || '';
        this.avatar = data.avatar || '';
        this.createdAt = data.createdAt || '';
        this.updatedAt = data.updatedAt || '';
        this.category = data.category || '';
        this.role = data.role || '';
    }

    static fromJson(json: any): CommonProfile {
        return new CommonProfile({
            id: json.id || '',
            firstName: json.firstName || '',
            lastName: json.lastName || '',
            emailAddress: json.emailAddress || '',
            status: json.status || '',
            avatar: json.avatar || '',
            createdAt: json.createdAt || '',
            updatedAt: json.updatedAt || '',
            category: json.category || '',
            role: json.role || '',
        });
    }

    toJson(): ICommonProfile {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            emailAddress: this.emailAddress,
            status: this.status,
            avatar: this.avatar,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            category: this.category,
            role: this.role,
        };
    }

    copyWith(changes: Partial<ICommonProfile>): CommonProfile {
        return new CommonProfile({
            ...this.toJson(),
            ...changes,
        });
    }

    get name(): string {
        return `${ this.firstName } ${ this.lastName }`
    }
}