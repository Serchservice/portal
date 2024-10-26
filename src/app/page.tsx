import React from "react";
import { RouteInterface } from "../configuration/Route";
import Title from "../widgets/Title";
import authStore from "../backend/database/auth/AuthStore";
import { AccessService } from "../backend/api/AccessService";
import Access from "../backend/api/Access";
import { observer } from "mobx-react-lite";

export default function HomeRoute(): RouteInterface {
    return {
        path: "/",
        page: <Layout />,
    }
}

const Layout: React.FC = observer(() => {
    console.log(authStore.read.toJson())
    /// Handle background tasks
    const access: AccessService = new Access()

    React.useEffect(() => {
        access.fetchPermissionScopes();
        access.fetchTransactionTypes()
        access.updateTimezone()
    }, []);

    return (
        <React.Fragment>
            <Title title="Dashboard" />
        </React.Fragment>
    )
})