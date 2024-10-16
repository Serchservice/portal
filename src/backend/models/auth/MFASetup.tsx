export interface IMFASetup {
    secret: string;
    qr_code: string;
}

class MFASetup implements IMFASetup {
    secret: string;
    qr_code: string;

    constructor({ secret = '', qr_code = '' }: Partial<IMFASetup> = {}) {
        this.secret = secret;
        this.qr_code = qr_code;
    }

    static fromJson(json: any): MFASetup {
        return new MFASetup({
            secret: json.secret || '',
            qr_code: json.qr_code || '',
        });
    }

    toJson(): any {
        return {
            secret: this.secret,
            qr_code: this.qr_code,
        };
    }
}

export default MFASetup;
