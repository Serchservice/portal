import React from "react";
import { useNavigate } from "react-router-dom";

interface RouteUpdate {
    openTeamTab: string;
    handleTeamTab: (value: string) => void;
    openAdminTab: string;
    handleAdminTab: (value: string) => void;
}

const useAdminUpdate = (): RouteUpdate => {
    const navigate = useNavigate();

    /// TEAM TAB
    const [openTeamTab, setOpenTeamTab] = React.useState<string>("")
    const handleTeamTab = (value: string) => {
        setOpenTeamTab(value)

        if(value && value !== "") {
            const currentPath = location.pathname;
            const searchParams = new URLSearchParams(location.search);
            searchParams.set('view', value.toLowerCase());

            // Update the URL without reloading the page
            navigate(`${currentPath}?${searchParams.toString()}`, { replace: true });
        } else {
            const currentPath = location.pathname;
            navigate(currentPath, { replace: true });
        }
    }

    /// ADMIN TAB
    const [openAdminTab, setOpenAdminTab] = React.useState<string>("")
    const handleAdminTab = (value: string) => {
        setOpenAdminTab(value)

        if(value && value !== "") {
            const currentPath = location.pathname;
            const searchParams = new URLSearchParams(location.search);
            searchParams.set('view', value.toLowerCase());

            // Update the URL without reloading the page
            navigate(`${currentPath}?${searchParams.toString()}`, { replace: true });
        } else {
            const currentPath = location.pathname;
            navigate(currentPath, { replace: true });
        }
    }

    return {
        openTeamTab: openTeamTab,
        handleTeamTab: handleTeamTab,
        openAdminTab: openAdminTab,
        handleAdminTab: handleAdminTab,
    }
}

export default useAdminUpdate