import { Session } from "@serchservice/connectify";

interface IAuth {
    id?: string;
    role?: string;
    session?: Session;
    firstName?: string;
    hasMfa?: boolean;
    hasRecoveryCodes?: boolean;
    lastName?: string;
    avatar?: string;
}

class Auth implements IAuth {
    id: string;
    role: string;
    session: Session;
    firstName: string;
    hasMfa: boolean;
    hasRecoveryCodes: boolean;
    lastName: string;
    avatar: string;

    constructor({
        id = '',
        role = '',
        session = Session.empty(),
        firstName = '',
        hasMfa = false,
        hasRecoveryCodes = false,
        lastName = '',
        avatar = '',
    }: IAuth = {}) {
        this.id = id;
        this.role = role;
        this.session = session;
        this.firstName = firstName;
        this.hasMfa = hasMfa;
        this.hasRecoveryCodes = hasRecoveryCodes;
        this.lastName = lastName;
        this.avatar = avatar;
    }

    copyWith({
        id,
        role,
        session,
        firstName,
        hasMfa,
        hasRecoveryCodes,
        lastName,
        avatar,
    }: IAuth = {}) {
        return new Auth({
            id: id !== undefined && id !== null ? id : this.id,
            role: role !== undefined && role !== null ? role : this.role,
            session: session !== undefined && session !== null ? session : this.session,
            firstName: firstName !== undefined && firstName !== null ? firstName : this.firstName,
            hasMfa: hasMfa !== undefined && hasMfa !== null ? hasMfa : this.hasMfa,
            hasRecoveryCodes: hasRecoveryCodes !== undefined && hasRecoveryCodes !== null ? hasRecoveryCodes : this.hasRecoveryCodes,
            lastName: lastName !== undefined && lastName !== null ? lastName : this.lastName,
            avatar: avatar !== undefined && avatar !== null ? avatar : this.avatar,
        });
    }

    static empty() {
        return new Auth();
    }

    static fromJson(json: any): Auth {
        return new Auth({
            id: json.id || '',
            role: json.role || '',
            session: json.session ? Session.fromJson(json.session) : Session.empty(),
            firstName: json.first_name || '',
            hasMfa: json.has_mfa || false,
            hasRecoveryCodes: json.has_recovery_codes || false,
            lastName: json.last_name || '',
            avatar: json.avatar || '',
        });
    }

    toJson() {
        return {
            id: this.id,
            role: this.role,
            session: this.session.toJson(),
            first_name: this.firstName,
            last_name: this.lastName,
            has_mfa: this.hasMfa,
            has_recovery_codes: this.hasRecoveryCodes,
            avatar: this.avatar,
        };
    }

    get isLoggedIn(): boolean {
        return this.session !== null &&
            this.session.accessToken !== null &&
            this.session.accessToken !== '' &&
            this.session.accessToken !== undefined;
    }

    get name(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    get initials(): string  {
        return `${this.firstName.charAt(0)}${this.lastName.charAt(0)}`;
    }

    // Check if the current user is ADMIN
    get isAdmin(): boolean {
        return this.role === "ADMIN";
    }

    // Check if the current user is MANAGER
    get isManager(): boolean {
        return this.role === "MANAGER";
    }

    // Check if the current user is SUPER_ADMIN
    get isSuper(): boolean {
        return this.role === "SUPER_ADMIN";
    }

    // Check if the current user is SUPER_ADMIN
    get isTeam(): boolean {
        return this.role === "TEAM";
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

export default Auth;