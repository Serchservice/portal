import AccountDeviceResponse from "./AccountDeviceResponse";

interface IAccountAuthResponse {
    hasMFA: boolean;
    mustHaveMFA: boolean;
    method: string;
    level: string;
    devices: AccountDeviceResponse[];
}

class AccountAuthResponse implements IAccountAuthResponse {
    constructor(
        public hasMFA: boolean,
        public mustHaveMFA: boolean,
        public method: string,
        public level: string,
        public devices: AccountDeviceResponse[]
    ) { }

    static fromJson(data: any): AccountAuthResponse {
        return new AccountAuthResponse(
            data.hasMFA,
            data.mustHaveMFA,
            data.method,
            data.level,
            data.devices.map((device: any) => AccountDeviceResponse.fromJson(device))
        );
    }

    toJson(): any {
        return {
            hasMFA: this.hasMFA,
            mustHaveMFA: this.mustHaveMFA,
            method: this.method,
            level: this.level,
            devices: this.devices.map((device) => device.toJson()),
        };
    }

    copyWith(updatedData: Partial<IAccountAuthResponse>): AccountAuthResponse {
        return new AccountAuthResponse(
            updatedData.hasMFA || this.hasMFA,
            updatedData.mustHaveMFA || this.mustHaveMFA,
            updatedData.method || this.method,
            updatedData.level || this.level,
            updatedData.devices || this.devices
        );
    }
}

export default AccountAuthResponse