export interface IAccountRefreshTokenResponse {
    id: string;
    token: string;
    updatedAt: string;
    createdAt: string;
    revoked: boolean;
    refreshTokens?: AccountRefreshTokenResponse[]
}

class AccountRefreshTokenResponse implements IAccountRefreshTokenResponse {
    constructor(
        public id: string,
        public token: string,
        public updatedAt: string,
        public createdAt: string,
        public revoked: boolean,
        public refreshTokens: AccountRefreshTokenResponse[]
    ) { }

    static fromJson(data: any): AccountRefreshTokenResponse {
        return new AccountRefreshTokenResponse(
            data.id,
            data.token,
            data.updatedAt,
            data.createdAt,
            data.revoked,
            data.refreshTokens ?
                data.refreshTokens.map((token: any) => AccountRefreshTokenResponse.fromJson(token))
                : []
        );
    }

    toJson(): any {
        return {
            id: this.id,
            token: this.token,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt,
            revoked: this.revoked,
            refreshTokens: this.refreshTokens.map(token => token.toJson()),
        };
    }

    copyWith(updatedData: Partial<IAccountRefreshTokenResponse>): AccountRefreshTokenResponse {
        return new AccountRefreshTokenResponse(
            updatedData.id || this.id,
            updatedData.token || this.token,
            updatedData.updatedAt || this.updatedAt,
            updatedData.createdAt || this.createdAt,
            updatedData.revoked || this.revoked,
            updatedData.refreshTokens || this.refreshTokens
        );
    }
}

export default AccountRefreshTokenResponse