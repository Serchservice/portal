class Keys {
    /** BASE URL SERCH SERVER */
    static BASE_URL = import.meta.env.VITE_BASE_URL ?? "";

    /** LOCATION IP URL */
    static IP_URL = 'https://api.ipify.org?format=json';

    /** Query Key - For Logged In Admin Page Views */
    static LOGGED_IN_ADMIN = (view: string) => `LoggedInAdmin-${view}`;

    /** Query Key - For Team Page Views */
    static TEAM_PAGE = (view: string) => `TeamPage-${view}`;

    /** Query Key - For Admin Page Views */
    static ADMIN_PAGE = (id: string) => `AdminPage-${id}`;

    /** Query Key - For Support Page Views */
    static SUPPORT_PAGE = (id: string) => `SupportPage-${id}`;

    /** Query Key - For Payment Page Views */
    static PAYMENT_PAGE = (id: string) => `PaymentPage-${id}`;
}

export default Keys;