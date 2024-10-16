import { HomeRoute } from "../app/page";
import { ProfileRoute } from "../app/profile/page";
import { PermissionRoute } from "../app/profile/permission/page";
import { SecurityAndPrivacyRoute } from "../app/profile/security-and-privacy/page";
import { ComplaintsRoute } from "../app/support/complaints/page";
import { SupportRoute } from "../app/support/page";
import { SpeakWithSerchRoute } from "../app/support/speak-with-serch/page";
import { TeamRoute } from "../app/team/page";
import { RouteConfig, RouteInterface } from "./Route";

class Routing {
    static instance = new Routing();

    /** Home Route */
    home: RouteInterface = HomeRoute;

    /// PROFILE
    /** Profile Route */
    profile: RouteInterface = ProfileRoute;

    /** Profile - Security and Privacy Route */
    securityAndPrivacy: RouteInterface = SecurityAndPrivacyRoute;

    /** Profile - Requested Permissions Route */
    permission: RouteInterface = PermissionRoute;

    /// TEAM
    /** Team Route */
    team: RouteInterface = TeamRoute;

    /// SUPPORT
    /** Support Route */
    support: RouteInterface = SupportRoute;

    /** Complaints Route */
    complaint: RouteInterface = ComplaintsRoute;

    /** SpeakWithSerch Route */
    speakWithSerch: RouteInterface = SpeakWithSerchRoute;

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