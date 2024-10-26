import React from "react";
import { useNavigate } from "react-router-dom";
import { OrganizationResponse } from "../../backend/models/team/OrganizationResponse";

interface RouteUpdate {
    isCreateOrganizationOpen: boolean;
    handleCreateOrganization: (value: boolean) => void;
    openOrganization: OrganizationResponse | undefined;
    handleOpenOrganization: (data: OrganizationResponse) => void;
    handleCloseOrganization: () => void;
}

const useOrganizationUpdate = (): RouteUpdate => {
    const navigate = useNavigate();

    /// CREATE ORGANIZATION
    const [isCreateOrganizationOpen, setIsCreateOrganizationOpen] = React.useState(false)
    const handleCreateOrganization = (value: boolean) => {
        setIsCreateOrganizationOpen(value)

        if(value) {
            const currentPath = location.pathname;
            const searchParams = new URLSearchParams(location.search);
            searchParams.set('action', 'create');

            // Update the URL without reloading the page
            navigate(`${currentPath}?${searchParams.toString()}`, { replace: true });
        } else {
            const currentPath = location.pathname;
            navigate(currentPath, { replace: true });
        }
    }

    /// UPDATE ORGANIZATION
    const [openOrganization, setOpenOrganization] = React.useState<OrganizationResponse>()

    const handleOpenOrganization = (data: OrganizationResponse) => {
        setOpenOrganization(data)
        const currentPath = location.pathname;
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('tag', data.username);

        // Update the URL without reloading the page
        navigate(`${currentPath}?${searchParams.toString()}`, { replace: true });
    }

    const handleCloseOrganization = () => {
        setOpenOrganization(undefined)

        const currentPath = location.pathname;
        navigate(currentPath, { replace: true });
    }

    return {
        isCreateOrganizationOpen: isCreateOrganizationOpen,
        handleCreateOrganization: handleCreateOrganization,
        openOrganization: openOrganization,
        handleCloseOrganization: handleCloseOrganization,
        handleOpenOrganization: handleOpenOrganization,
    }
}

export default useOrganizationUpdate