import React from "react";
import { RouteInterface } from "../../../../configuration/Route";
import Title from "../../../../widgets/Title";

export default function ResolvedPaymentRoute(): RouteInterface {
    return {
        path: "/payment/resolved",
        page: (
            <React.Fragment>
                <Title title="Resolved Payments" description="All resolved payments in the Serchservice platform" useDesktopWidth />
            </React.Fragment>
        )
    }
}