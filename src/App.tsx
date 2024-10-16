import WebUiKit, * as Uikit from "@serchservice/web-ui-kit";
import { Outlet, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { RouteInterface } from "./configuration/Route";
import Routing from "./configuration/Routing";
// import { GlobalWorkerOptions } from "pdfjs-dist";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthRouting from "./configuration/AuthRouting";
import MainLayout from "./layouts/main/MainLayout";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from "@mui/x-date-pickers";

// GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

const ParentPage = () => {
    return (<Outlet />)
}

const renderRoutes = (routes: RouteInterface[]) => {
    return routes.map((route, index) => {
        if (route.children) {
            if(route.withParent && route.parent) {
                return (
                    <Route key={index} path={route.path} element={route.page}>
                        <Route index element={route.parent} />
                        {renderRoutes(route.children)}
                    </Route>
                );
            } else {
                return (
                    <Route key={index} path={route.path} element={<ParentPage />}>
                        <Route index element={route.page} />
                        {renderRoutes(route.children)}
                    </Route>
                );
            }
        } else {
            return <Route key={index} path={route.path} element={route.page} />;
        }
    });
};

const queryClient = new QueryClient()

export default function Main() {
    return (
        <QueryClientProvider client={queryClient}>
            <WebUiKit>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Router>
                        <Uikit.Scroller>
                            <Routes>
                                <Route path="*" element={AuthRouting.instance.error.page} />
                                {renderRoutes(AuthRouting.instance.getAllRoutes())}
                                <Route element={<MainLayout />}>
                                    {renderRoutes(Routing.instance.getAllRoutes())}
                                </Route>
                            </Routes>
                        </Uikit.Scroller>
                    </Router>
                </LocalizationProvider>
            </WebUiKit>
        </QueryClientProvider>
    );
}