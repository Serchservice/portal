export interface IAccountMFAChallengeResponse {
    createdAt: string;
    updatedAt: string;
    verifiedAt: string;
    name: string;
    platform: string;
    osv: string;
    os: string;
    ipAddress: string;
    host: string;
    localHost: string;
    device: string;
    id: string;
}

class AccountMFAChallengeResponse implements IAccountMFAChallengeResponse {
    constructor(
        public createdAt: string,
        public updatedAt: string,
        public verifiedAt: string,
        public name: string,
        public platform: string,
        public osv: string,
        public os: string,
        public ipAddress: string,
        public host: string,
        public localHost: string,
        public device: string,
        public id: string
    ) { }

    static fromJson(data: any): AccountMFAChallengeResponse {
        return new AccountMFAChallengeResponse(
            data.createdAt,
            data.updatedAt,
            data.verifiedAt,
            data.name,
            data.platform,
            data.osv,
            data.os,
            data.ipAddress,
            data.host,
            data.localHost,
            data.device,
            data.id
        );
    }

    toJson(): any {
        return {
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            verifiedAt: this.verifiedAt,
            name: this.name,
            platform: this.platform,
            osv: this.osv,
            os: this.os,
            ipAddress: this.ipAddress,
            host: this.host,
            localHost: this.localHost,
            device: this.device,
            id: this.id,
        };
    }

    copyWith(updatedData: Partial<IAccountMFAChallengeResponse>): AccountMFAChallengeResponse {
        return new AccountMFAChallengeResponse(
            updatedData.createdAt ?? this.createdAt,
            updatedData.updatedAt ?? this.updatedAt,
            updatedData.verifiedAt ?? this.verifiedAt,
            updatedData.name ?? this.name,
            updatedData.platform ?? this.platform,
            updatedData.osv ?? this.osv,
            updatedData.os ?? this.os,
            updatedData.ipAddress ?? this.ipAddress,
            updatedData.host ?? this.host,
            updatedData.localHost ?? this.localHost,
            updatedData.device ?? this.device,
            updatedData.id ?? this.id
        );
    }
}

export default AccountMFAChallengeResponse