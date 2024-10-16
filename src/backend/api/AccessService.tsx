export interface AccessService {
    updateTimezone(): Promise<void>;
    fetchPermissionScopes(): Promise<void>;
}