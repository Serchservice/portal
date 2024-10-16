export interface IAccountMFAResponse {
    createdAt: string;
    updatedAt: string;
    id: string;
}

class AccountMFAResponse implements IAccountMFAResponse {
    constructor(
        public createdAt: string,
        public updatedAt: string,
        public id: string
    ) { }

    static fromJson(data: any): AccountMFAResponse {
        return new AccountMFAResponse(
            data["createdAt"] != null ? data.createdAt : "",
            data["updatedAt"] != null ? data.updatedAt : "",
            data["id"] != null ? data.id : ""
        );
    }

    toJson(): any {
        return {
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            id: this.id,
        };
    }

    copyWith(updatedData: Partial<IAccountMFAResponse>): AccountMFAResponse {
        return new AccountMFAResponse(
            updatedData.createdAt ?? this.createdAt,
            updatedData.updatedAt ?? this.updatedAt,
            updatedData.id ?? this.id
        );
    }
}

export default AccountMFAResponse