import React from "react";
import { useNavigate } from "react-router-dom";
import RequestedPermission from "../../backend/models/permission/RequestedPermission";

interface RouteUpdate {
    openPermission: RequestedPermission | undefined;
    handleOpenPermission: (data: RequestedPermission) => void;
    handleClosePermission: () => void;
}

const useProfileUpdate = (): RouteUpdate => {
    const navigate = useNavigate();

    /// SPEAK WITH SERCH
    const [openPermission, setOpenPermission] = React.useState<RequestedPermission>()

    const handleOpenPermission = (data: RequestedPermission) => {
        setOpenPermission(data)
        const currentPath = location.pathname;
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('id', `${data.id}`);
        searchParams.set('permit', `${data.permission}`);
        searchParams.set('scope', `${data.scope}`);

        // Update the URL without reloading the page
        navigate(`${currentPath}?${searchParams.toString()}`, { replace: true });
    }

    const handleClosePermission = () => {
        const currentPath = location.pathname;
        navigate(currentPath, { replace: true });

        setOpenPermission(undefined)
    }

    return {
        openPermission: openPermission,
        handleClosePermission: handleClosePermission,
        handleOpenPermission: handleOpenPermission,
    }
}

export default useProfileUpdate