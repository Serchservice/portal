import React from "react";
import { RouteInterface } from "../../../configuration/Route";
import Title from "../../../widgets/Title";

export default function PayoutRoute(): RouteInterface {
    return {
        path: "/payment/payouts",
        page: (
            <React.Fragment>
                <Title title="Payouts" description="All payouts in the Serchservice platform" useDesktopWidth />
            </React.Fragment>
        )
    }
}