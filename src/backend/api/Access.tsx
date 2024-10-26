import commonStore from "../database/device/CommonStore";
import permissionStore from "../database/device/PermissionStore";
import { TransactionTypeResponse } from "../models/payment/TransactionTypeResponse";
import { PermissionScopeResponse } from "../models/permission/PermissionScopeResponse";
import { AccessService } from "./AccessService";
import Connect from "./Connect";

class Access implements AccessService {
    connect: Connect;

    constructor() {
        this.connect = new Connect({withError: false});
    }

    async fetchTransactionTypes(): Promise<void> {
        const response = await this.connect.get("/scope/payment/transaction/types")
        if(response && response.data && Array.isArray(response.data)) {
            const types = response.data.map((d) => TransactionTypeResponse.fromJson(d));
            commonStore.update({types: types})
        }
    }

    async updateTimezone(): Promise<void> {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
        this.connect.patch(`/admin/profile/update/timezone?timezone=${timezone}`)
    };

    async fetchPermissionScopes(): Promise<void> {
        const response = await this.connect.get("/admin/permission/scopes")
        if(response && response.data && Array.isArray(response.data)) {
            const scopes = response.data.map((d) => PermissionScopeResponse.fromJson(d));
            permissionStore.set(scopes)
        }
    };
}

export default Access;