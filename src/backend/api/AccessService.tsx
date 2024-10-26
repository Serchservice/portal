/**
 * Interface for AccessService, which provides methods to manage access-related operations
 * such as updating the timezone, fetching permission scopes, and fetching transaction types.
 */
export interface AccessService {
    /**
     * Updates the user's timezone.
     * This method should be used to set or synchronize the user's current timezone
     * with the backend service.
     *
     * @returns {Promise<void>} A promise that resolves when the timezone update is complete.
     */
    updateTimezone(): Promise<void>;

    /**
     * Fetches the available permission scopes.
     * This method should be used to retrieve the different scopes of permissions
     * that a user can have within the application.
     *
     * @returns {Promise<void>} A promise that resolves when the permission scopes are fetched.
     */
    fetchPermissionScopes(): Promise<void>;

    /**
     * Fetches the list of transaction types.
     * This method should be used to retrieve the available types of transactions
     * that can be performed within the application.
     *
     * @returns {Promise<void>} A promise that resolves when the transaction types are fetched.
     */
    fetchTransactionTypes(): Promise<void>;
}