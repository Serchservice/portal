import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import authStore from '../database/auth/AuthStore';

interface ManagerMiddlewareProps {
    children: ReactNode;
}

const ManagerMiddleware: React.FC<ManagerMiddlewareProps> = ({ children }) => {
    const isAdmin = authStore.read.isAdmin || authStore.read.isSuper || authStore.read.isManager;

    // if (!authStore.read.isLoggedIn) {
    //     return <Navigate to={Links.login} />;
    // }

    // if (!isAdmin) {
    //     return <UnauthorizedPage showButton={false} />;
    // }

    return <>{children}</>;
};

export default observer(ManagerMiddleware);