import React from "react"
import { RouteInterface } from "../../configuration/Route"
import Title from "../../widgets/Title"

export const SupportRoute: RouteInterface = {
    path: "/support",
    page: <SupportPage />,
}

export default function SupportPage() {
    return (
        <React.Fragment>
            <Title title="Dashboard" />
        </React.Fragment>
    )
}