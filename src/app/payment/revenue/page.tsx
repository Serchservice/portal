import React from "react";
import { RouteInterface } from "../../../configuration/Route";
import Title from "../../../widgets/Title";

export default function RevenueRoute(): RouteInterface {
    return {
        path: "/payment/revenue",
        page: (
            <React.Fragment>
                <Title title="Revenue Overview" description="Revenue analysis and details" useDesktopWidth />
            </React.Fragment>
        )
    }
}