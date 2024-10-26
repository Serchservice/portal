import React from "react";
import { RouteInterface } from "../../../configuration/Route";
import Title from "../../../widgets/Title";

export default function WalletRoute(): RouteInterface {
    return {
        path: "/payment/wallets",
        page: (
            <React.Fragment>
                <Title title="Wallets" description="List of wallets in the Serchservice platform" useDesktopWidth />
            </React.Fragment>
        )
    }
}