export interface IInvite {
    secret: string;
    name: string;
}

class Invite implements IInvite {
    secret: string;
    name: string;

    constructor({ secret = '', name = '' }: Partial<IInvite> = {}) {
        this.secret = secret;
        this.name = name;
    }

    static fromJson(json: any): Invite {
        return new Invite({
            secret: json.secret || '',
            name: json.name || '',
        });
    }

    toJson(): any {
        return {
            secret: this.secret,
            name: this.name,
        };
    }
}

export default Invite;
