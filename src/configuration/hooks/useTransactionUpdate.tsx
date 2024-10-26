import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import transactionStore from "../../backend/database/temp/TransactionStore";
import { TransactionScopeResponse } from "../../backend/models/payment/TransactionScopeResponse";

interface RouteUpdate {
    openTransactionTab: string;
    handleTransactionTab: (value: string) => void;
    openTransaction: TransactionScopeResponse | undefined;
    handleOpenTransaction: (scope: TransactionScopeResponse) => void;
    handleCloseTransaction: () => void;
}

const useTransactionUpdate = (): RouteUpdate => {
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

    return {
        openTransactionTab: openTransactionTab,
        handleTransactionTab: handleTransactionTab,
        openTransaction: openTransaction,
        handleCloseTransaction: handleCloseTransaction,
        handleOpenTransaction: handleOpenTransaction,
    }
}

export default useTransactionUpdate