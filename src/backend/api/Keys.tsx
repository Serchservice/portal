class Keys {
    /** BASE URL SERCH SERVER */
    static BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

    /** LOCATION IP URL */
    static IP_URL = 'https://api.ipify.org?format=json';

    /** Query Key - For Admin Profile Page */
    static LOGGED_IN_ADMIN_PROFILE = "ProfilePage";

    /** Query Key - For Admin Requested Permissions Page */
    static LOGGED_IN_ADMIN_REQUESTED_PERMISSIONS = "RequestedPermissions";

    /** Query Key - For Security and Privacy Page */
    static LOGGED_IN_SECURITY_AND_PRIVACY = (type: string) => `SecurityAndPrivacyPage-${type}`;

    /** Query Key - For Team Page */
    static TEAM_PAGE = (view: string) => `TeamPage-${view}`;

    /** Query Key - For Admin Page */
    static ADMIN_PAGE = (id: string) => `ADMINPAGE-${id}`;
}

export default Keys;