import AccountRefreshTokenResponse from "./AccountRefreshTokenResponse";

export interface IAccountSessionResponse {
    name: string;
    platform: string;
    osv: string;
    os: string;
    method: string;
    level: string;
    ipAddress: string;
    host: string;
    device: string;
    id: string;
    revoked: boolean;
    createdAt: string;
    updatedAt: string;
    refreshTokens?: AccountRefreshTokenResponse[];
}

class AccountSessionResponse implements IAccountSessionResponse {
    constructor(
        public name: string,
        public platform: string,
        public osv: string,
        public os: string,
        public method: string,
        public level: string,
        public ipAddress: string,
        public host: string,
        public device: string,
        public id: string,
        public revoked: boolean,
        public createdAt: string,
        public updatedAt: string,
        public refreshTokens: AccountRefreshTokenResponse[]
    ) { }

    static fromJson(data: any): AccountSessionResponse {
        return new AccountSessionResponse(
            data.name,
            data.platform,
            data.osv,
            data.os,
            data.method,
            data.level,
            data.ipAddress,
            data.host,
            data.device,
            data.id,
            data.revoked,
            data.createdAt,
            data.updatedAt,
            data.refreshTokens ?
                data.refreshTokens.map((token: any) => AccountRefreshTokenResponse.fromJson(token))
                : []
        );
    }

    toJson(): any {
        return {
            name: this.name,
            platform: this.platform,
            osv: this.osv,
            os: this.os,
            method: this.method,
            level: this.level,
            ipAddress: this.ipAddress,
            host: this.host,
            device: this.device,
            id: this.id,
            revoked: this.revoked,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            refreshTokens: this.refreshTokens.map((token) => token.toJson()),
        };
    }

    copyWith(updatedData: Partial<IAccountSessionResponse>): AccountSessionResponse {
        return new AccountSessionResponse(
            updatedData.name ?? this.name,
            updatedData.platform ?? this.platform,
            updatedData.osv ?? this.osv,
            updatedData.os ?? this.os,
            updatedData.method ?? this.method,
            updatedData.level ?? this.level,
            updatedData.ipAddress ?? this.ipAddress,
            updatedData.host ?? this.host,
            updatedData.device ?? this.device,
            updatedData.id ?? this.id,
            updatedData.revoked ?? this.revoked,
            updatedData.createdAt ?? this.createdAt,
            updatedData.updatedAt ?? this.updatedAt,
            updatedData.refreshTokens ?? this.refreshTokens
        );
    }
}

export default AccountSessionResponse