import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react';
// import { Navigate } from 'react-router-dom';
// import authStore from '../database/auth/AuthStore';

interface SuperAdminMiddlewareProps {
    children: ReactNode;
}

const SuperAdminMiddleware: React.FC<SuperAdminMiddlewareProps> = ({ children }) => {
    // if (!authStore.read.isLoggedIn) {
    //     return <Navigate to={Links.login} />;
    // }

    // if (!authStore.read.isSuper) {
    //     return <UnauthorizedPage showButton={false} />;
    // }

    return <>{children}</>;
};

export default observer(SuperAdminMiddleware);