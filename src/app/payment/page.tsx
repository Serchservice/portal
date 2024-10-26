import React from "react";
import { RouteInterface } from "../../configuration/Route";
import Title from "../../widgets/Title";
import PayoutRoute from "./payout/page";
import TransactionRoute from "./transaction/page";
import ResolvedPaymentRoute from "./transaction/resolved/page";
import WalletRoute from "./wallet/page";

export default function PaymentRoute(): RouteInterface {
    return {
        path: "/payment",
        page: (
            <React.Fragment>
                <Title
                    title="Payment Overview"
                    description="An in-depth view on payments in the Serchservice platform"
                    useDesktopWidth
                />
            </React.Fragment>
        ),
        children: [
            PayoutRoute(),
            TransactionRoute(),
            WalletRoute(),
            ResolvedPaymentRoute()
        ]
    }
}