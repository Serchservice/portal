import { InviteRoute } from "../app/auth/invite/page";
import { VerifyInviteRoute } from "../app/auth/invite/verify/page";
import { LoginRoute } from "../app/auth/login/page";
import { VerifyLoginRoute } from "../app/auth/login/verify/page";
import { MFAuthRoute } from "../app/auth/mfa/page";
import { PasswordRoute } from "../app/auth/password/page";
import { ResetPasswordRoute } from "../app/auth/password/reset/page";
import { SignupRoute } from "../app/auth/signup/page";
import { ErrorRoute } from "../app/misc/error/page";
import { RouteConfig, RouteInterface } from "./Route";

class AuthRouting {
    static instance = new AuthRouting();

    /** Invite Route */
    invite: RouteInterface = InviteRoute;

    /** Verify Invite Route */
    verifyInvite: RouteInterface = VerifyInviteRoute;

    /** Login Route */
    login: RouteInterface = LoginRoute;

    /** Verify Login Route */
    verifyLogin: RouteInterface = VerifyLoginRoute;

    /** MFA Route */
    mfa: RouteInterface = MFAuthRoute;

    /** Password Route */
    password: RouteInterface = PasswordRoute;

    /** Password Reset Route */
    resetPassword: RouteInterface = ResetPasswordRoute;

    /** Signup Route */
    signup: RouteInterface = SignupRoute;

    /** Error Route */
    error: RouteInterface = ErrorRoute;

    /** Automatically collect all routes */
    getAllRoutes(): RouteInterface[] {
        return Object.values(this).filter((route) => RouteConfig.isRouteInterface(route));
    }
}

export default AuthRouting;