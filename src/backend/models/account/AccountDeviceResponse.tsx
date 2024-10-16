export interface IAccountDeviceResponse {
    name: string;
    platform: string;
    count: number;
    revoked: boolean;
}

class AccountDeviceResponse implements IAccountDeviceResponse {
    constructor(
        public name: string,
        public platform: string,
        public count: number,
        public revoked: boolean
    ) { }

    static fromJson(data: any): AccountDeviceResponse {
        return new AccountDeviceResponse(data.name, data.platform, data.count, data.revoked);
    }

    toJson(): any {
        return {
            name: this.name,
            platform: this.platform,
            count: this.count,
            revoked: this.revoked,
        };
    }

    copyWith(updatedData: Partial<IAccountDeviceResponse>): AccountDeviceResponse {
        return new AccountDeviceResponse(
            updatedData.name ?? this.name,
            updatedData.platform ?? this.platform,
            updatedData.count ?? this.count,
            updatedData.revoked ?? this.revoked
        );
    }
}

export default AccountDeviceResponse;