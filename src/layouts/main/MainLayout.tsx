import { observer } from "mobx-react-lite";
import React from "react";
import AppTheme from "../../configuration/Theme";
import { Outlet, useLocation } from "react-router-dom";
import { Column, HorizontalLoader, Row, useRedirect} from "@serchservice/web-ui-kit";
import authStore from "../../backend/database/auth/AuthStore";
import { RouteInterface } from "../../configuration/Route";
import Routing from "../../configuration/Routing";
import TopNavigation from "./TopNavigation";
import LeftNavigation from "./LeftNavigation";
import AuthRouting from "../../configuration/AuthRouting";

const MainLayout: React.FC = observer(() => {
    const location = useLocation();
    const current = Routing.instance.get(location.pathname);

    const redirect = useRedirect();
    React.useEffect(() => {
        if (!authStore.read.isLoggedIn) {
            redirect(AuthRouting.instance.login.path);
        }
    }, [current]);

    // const isAdmin = authStore.read.isAdmin || authStore.read.isSuper

    const render = (): JSX.Element => {
        if(current) {
            return (<Outlet />)
        } else {
            return (<HorizontalLoader isPlaying color={AppTheme.primary} />)
        }
    }

    return (
        <Column
            mainAxisSize="max"
            mainAxis="flex-start"
            crossAxis="flex-start"
            style={{
                overflow: "hidden",
                height: "100vh",
                backgroundColor: AppTheme.background
            }}
        >
            <TopNavigation current={current} />
            <Row
                mainAxisSize="max"
                crossAxisSize="max"
                mainAxis="flex-start"
                crossAxis="flex-start"
                style={{ flexGrow: 1, overflow: "hidden" }}
            >
                <LeftNavigation current={current} />
                {render()}
            </Row>
        </Column>
    )
})

export interface NavigationInterface {
    current: RouteInterface | undefined
}

export default MainLayout;