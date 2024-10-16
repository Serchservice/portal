import { RouteInterface } from "../../../configuration/Route"

export const UnknownRoute: RouteInterface = {
    path: "/misc/unknown",
    page: <UnknownPage />,
}

export default function UnknownPage() {
    return (<></>)
}