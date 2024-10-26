import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import transactionStore from "../../backend/database/temp/TransactionStore";
import { TransactionScopeResponse } from "../../backend/models/payment/TransactionScopeResponse";
import SpeakWithSerchResponse from "../../backend/models/support/SpeakWithSerchResponse";
import supportStore from "../../backend/database/device/SupportStore";
import ComplaintScopeResponse from "../../backend/models/support/ComplaintScopeResponse";
import { OrganizationResponse } from "../../backend/models/team/OrganizationResponse";

interface RouteUpdate {
    openTeamTab: string;
    handleTeamTab: (value: string) => void;
    openAdminTab: string;
    handleAdminTab: (value: string) => void;
    openTransactionTab: string;
    handleTransactionTab: (value: string) => void;
    openTransaction: TransactionScopeResponse | undefined;
    handleOpenTransaction: (scope: TransactionScopeResponse) => void;
    handleCloseTransaction: () => void;
    openTicket: SpeakWithSerchResponse | undefined;
    handleOpenTicket: (data: SpeakWithSerchResponse) => void;
    handleCloseTicket: () => void;
    openComplaint: ComplaintScopeResponse | undefined;
    handleOpenComplaint: (data: ComplaintScopeResponse) => void;
    handleCloseComplaint: () => void;
    isCreateOrganizationOpen: boolean;
    handleCreateOrganization: (value: boolean) => void;
    openOrganization: OrganizationResponse | undefined;
    handleOpenOrganization: (data: OrganizationResponse) => void;
    handleCloseOrganization: () => void;
}

const useRouteUpdate = (): RouteUpdate => {
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

    /// TRANSACTION TAB
    const [openTransactionTab, setOpenTransactionTab] = React.useState<string>("")
    const handleTransactionTab = (value: string) => {
        setOpenTransactionTab(value)

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

    /// TRANSACTION
    const [openTransaction, setOpenTransaction] = React.useState<TransactionScopeResponse>()
    const navigate = useNavigate();
    const location = useLocation();

    // Open the modal and update the URL parameters
    const handleOpenTransaction = (scope: TransactionScopeResponse) => {
        const currentPath = location.pathname;
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('id', scope.id);
        searchParams.set('type', scope.type);

        // Update the URL without reloading the page
        navigate(`${currentPath}?${searchParams.toString()}`, { replace: true });
        setOpenTransaction(scope);
        transactionStore.setOpenId(scope.id)
    };

    // Close the modal and remove the URL parameters
    const handleCloseTransaction = () => {
        const currentPath = location.pathname;

        const searchParams = new URLSearchParams(location.search);
        if(searchParams.get('view')) {
            navigate(`${currentPath}?view=${searchParams.get('view')}`, { replace: true });
        } else {
            navigate(currentPath, { replace: true });
        }

        setOpenTransaction(undefined);
        transactionStore.clearOpenId()
    };

    /// SPEAK WITH SERCH
    const [openTicket, setOpenTicket] = React.useState<SpeakWithSerchResponse>()

    const handleOpenTicket = (data: SpeakWithSerchResponse) => {
        setOpenTicket(data)
        const currentPath = location.pathname;
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('ticket', data.ticket);

        // Update the URL without reloading the page
        navigate(`${currentPath}?${searchParams.toString()}`, { replace: true });
        supportStore.set(supportStore.read.copyWith({
            ticket: data.ticket,
            speakWithSerch: data
        }))
    }

    const handleCloseTicket = () => {
        const currentPath = location.pathname;
        navigate(currentPath, { replace: true });

        setOpenTicket(undefined)
        supportStore.set(supportStore.read.copyWith({
            ticket: '',
            speakWithSerch: new SpeakWithSerchResponse()
        }))
    }

    /// COMPLAINT
    const [openComplaint, setOpenComplaint] = React.useState<ComplaintScopeResponse>()

    const handleOpenComplaint = (data: ComplaintScopeResponse) => {
        setOpenComplaint(data)
        const currentPath = location.pathname;
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('from', data.emailAddress);

        // Update the URL without reloading the page
        navigate(`${currentPath}?${searchParams.toString()}`, { replace: true });
        supportStore.set(supportStore.read.copyWith({
            emailAddress: data.emailAddress,
            complaint: data
        }))
    }

    const handleCloseComplaint = () => {
        setOpenComplaint(undefined)
        supportStore.set(supportStore.read.copyWith({
            emailAddress: '',
            complaint: new ComplaintScopeResponse()
        }))

        const currentPath = location.pathname;
        navigate(currentPath, { replace: true });
    }

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
        openTeamTab: openTeamTab,
        handleTeamTab: handleTeamTab,
        openAdminTab: openAdminTab,
        handleAdminTab: handleAdminTab,
        openTransactionTab: openTransactionTab,
        handleTransactionTab: handleTransactionTab,
        openTransaction: openTransaction,
        handleCloseTransaction: handleCloseTransaction,
        handleOpenTransaction: handleOpenTransaction,
        openTicket: openTicket,
        handleCloseTicket: handleCloseTicket,
        handleOpenTicket: handleOpenTicket,
        openComplaint: openComplaint,
        handleCloseComplaint: handleCloseComplaint,
        handleOpenComplaint: handleOpenComplaint,
        isCreateOrganizationOpen: isCreateOrganizationOpen,
        handleCreateOrganization: handleCreateOrganization,
        openOrganization: openOrganization,
        handleCloseOrganization: handleCloseOrganization,
        handleOpenOrganization: handleOpenOrganization,
    }
}

export default useRouteUpdate