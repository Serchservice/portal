import HomeRoute from "../app/page";
import PaymentRoute from "../app/payment/page";
import PayoutRoute from "../app/payment/payout/page";
import RevenueRoute from "../app/payment/revenue/page";
import TransactionRoute from "../app/payment/transaction/page";
import WalletRoute from "../app/payment/wallet/page";
import ProfileRoute from "../app/profile/page";
import GrantedPermissionRoute from "../app/profile/permission/granted/page";
import RequestedPermissionRoute from "../app/profile/permission/requested/page";
import SecurityAndPrivacyRoute from "../app/profile/security-and-privacy/page";
import ComplaintsRoute from "../app/support/complaints/page";
import SupportRoute from "../app/support/page";
import SpeakWithSerchRoute from "../app/support/speak-with-serch/page";
import OrganizationRoute from "../app/team/organization/page";
import TeamRoute from "../app/team/page";
import { RouteConfig, RouteInterface } from "./Route";

class Routing {
    static instance = new Routing();

    /** Home Route */
    home: RouteInterface = HomeRoute();

    /// PROFILE
    /** Profile Route */
    profile: RouteInterface = ProfileRoute();

    /** Profile - Security and Privacy */
    securityAndPrivacy: RouteInterface = SecurityAndPrivacyRoute();

    /** Profile - Granted Permission */
    grantedPermission: RouteInterface = GrantedPermissionRoute();

    /** Profile - Requested Permission */
    requestedPermission: RouteInterface = RequestedPermissionRoute();

    /// TEAM
    /** Team Route */
    team: RouteInterface = TeamRoute();

    /** Organization Route */
    organization: RouteInterface = OrganizationRoute();

    /// SUPPORT
    /** Support Route */
    support: RouteInterface = SupportRoute();

    /** Support - Speak With Serch */
    speakWithSerch: RouteInterface = SpeakWithSerchRoute();

    /** Support - Complaint */
    complaint: RouteInterface = ComplaintsRoute();

    /// PAYMENT
    /** Payment */
    payment: RouteInterface = PaymentRoute();

    /** Payment - Transaction */
    transaction: RouteInterface = TransactionRoute();

    /** Payment - Wallet */
    wallet: RouteInterface = WalletRoute();

    /** Payment - Payout */
    payout: RouteInterface = PayoutRoute();

    /** Payment - Revenue */
    revenue: RouteInterface = RevenueRoute();

    /** Automatically collect all routes */
    getAllRoutes(): RouteInterface[] {
        return Object.values(this).filter((route) => RouteConfig.isRouteInterface(route));
    }

    gatherRoutes(route: RouteInterface): RouteInterface[] {
        const routes: RouteInterface[] = [route];

        // If the route has children, gather them recursively
        if (route.children && route.children.length > 0) {
            route.children.forEach((child) => {
                routes.push(...this.gatherRoutes(child));
            });
        }

        return routes;
    }

    /** Get the current route */
    get(route: string): RouteInterface | undefined {
        const routes: RouteInterface[] = [];

        Object.values(this).forEach((route) => {
            if (RouteConfig.isRouteInterface(route)) {
                routes.push(...this.gatherRoutes(route));
            }
        });

        if(route.startsWith("/profile")) {
            return routes.find((r) => route === r.path)
        } else {
            return routes.find((r) => route === r.path || (route.startsWith(r.path) && r.path !== '/' && route !== '/'))
        }
    }
}

export default Routing;