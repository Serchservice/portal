import React from "react"
import { RouteInterface } from "../../../configuration/Route"
import Title from "../../../widgets/Title"

export const ComplaintsRoute: RouteInterface = {
    path: "/support/complaints",
    page: <ComplaintsPage />,
}

export default function ComplaintsPage() {
    return (
        <React.Fragment>
            <Title title="Dashboard" />
        </React.Fragment>
    )
}