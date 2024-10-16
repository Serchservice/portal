export interface IMFAUsage {
    used: number;
    unused: number;
    total: number;
}

class MFAUsage implements IMFAUsage {
    used: number;
    unused: number;
    total: number;

    constructor({ used = 0, unused = 0, total = 0 }: Partial<IMFAUsage> = {}) {
        this.used = used;
        this.unused = unused;
        this.total = total;
    }

    static fromJson(json: any): MFAUsage {
        return new MFAUsage({
            used: json.used || 0,
            unused: json.unused || 0,
            total: json.total || 0,
        });
    }

    toJson(): any {
        return {
            used: this.used,
            unused: this.unused,
            total: this.total,
        };
    }

    copyWith({ used, unused, total }: Partial<IMFAUsage> = {}): MFAUsage {
        return new MFAUsage({
            used: used !== undefined ? used : this.used,
            unused: unused !== undefined ? unused : this.unused,
            total: total !== undefined ? total : this.total,
        });
    }
}

export interface IMFARecoveryCode {
    code: string;
    isUsed: boolean;
}

class MFARecoveryCode implements IMFARecoveryCode {
    code: string;
    isUsed: boolean;

    constructor({ code = '', isUsed = false }: Partial<IMFARecoveryCode> = {}) {
        this.code = code;
        this.isUsed = isUsed;
    }

    static fromJson(json: any): MFARecoveryCode {
        return new MFARecoveryCode({
            code: json.code || '',
            isUsed: json.isUsed || json.is_used || false,
        });
    }

    toJson(): any {
        return {
            code: this.code,
            isUsed: this.isUsed,
        };
    }

    copyWith({ code, isUsed }: Partial<IMFARecoveryCode> = {}): MFARecoveryCode {
        return new MFARecoveryCode({
            code: code !== undefined ? code : this.code,
            isUsed: isUsed !== undefined ? isUsed : this.isUsed,
        });
    }
}

export interface IMFA {
    usage: MFAUsage;
    codes: MFARecoveryCode[];
}

class MFA implements IMFA {
    usage: MFAUsage;
    codes: MFARecoveryCode[];

    constructor({ usage = new MFAUsage(), codes = [] }: Partial<IMFA> = {}) {
        this.usage = usage;
        this.codes = codes;
    }

    static fromJson(json: any): MFA {
        return new MFA({
            usage: MFAUsage.fromJson(json.usage || {}),
            codes: (json.codes || []).map((code: any) => MFARecoveryCode.fromJson(code)),
        });
    }

    toJson(): any {
        return {
            usage: this.usage.toJson(),
            codes: this.codes.map(code => code.toJson()),
        };
    }

    copyWith({ usage, codes }: Partial<IMFA> = {}): MFA {
        return new MFA({
            usage: usage !== undefined ? usage : this.usage,
            codes: codes !== undefined ? codes : this.codes,
        });
    }
}

export default MFA;
export { MFARecoveryCode, MFAUsage };
