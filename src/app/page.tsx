import React from "react";
import { RouteInterface } from "../configuration/Route";
import Title from "../widgets/Title";
import authStore from "../backend/database/auth/AuthStore";
import { AccessService } from "../backend/api/AccessService";
import Access from "../backend/api/Access";

export const HomeRoute: RouteInterface = {
    path: "/",
    page: <HomePage />,
}

export default function HomePage() {
    console.log(authStore.read.toJson())
    /// Handle background tasks
    const access: AccessService = new Access()

    React.useEffect(() => {
        access.fetchPermissionScopes();
        access.updateTimezone()
    }, []);

    return (
        <React.Fragment>
            <Title title="Dashboard" />
        </React.Fragment>
    )
}