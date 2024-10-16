import React from "react"
import { RouteInterface } from "../../../configuration/Route"
import Title from "../../../widgets/Title"

export const SpeakWithSerchRoute: RouteInterface = {
    path: "/support/speak-with-serch",
    page: <SpeakWithSerchPage />,
}

export default function SpeakWithSerchPage() {
    return (
        <React.Fragment>
            <Title title="Dashboard" />
        </React.Fragment>
    )
}