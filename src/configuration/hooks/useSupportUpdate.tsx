import React from "react";
import { useNavigate } from "react-router-dom";
import SpeakWithSerchResponse from "../../backend/models/support/SpeakWithSerchResponse";
import supportStore from "../../backend/database/device/SupportStore";
import ComplaintScopeResponse from "../../backend/models/support/ComplaintScopeResponse";

interface RouteUpdate {
    openTicket: SpeakWithSerchResponse | undefined;
    handleOpenTicket: (data: SpeakWithSerchResponse) => void;
    handleCloseTicket: () => void;
    openComplaint: ComplaintScopeResponse | undefined;
    handleOpenComplaint: (data: ComplaintScopeResponse) => void;
    handleCloseComplaint: () => void;
}

const useSupportUpdate = (): RouteUpdate => {
    const navigate = useNavigate();

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

    return {
        openTicket: openTicket,
        handleCloseTicket: handleCloseTicket,
        handleOpenTicket: handleOpenTicket,
        openComplaint: openComplaint,
        handleCloseComplaint: handleCloseComplaint,
        handleOpenComplaint: handleOpenComplaint,
    }
}

export default useSupportUpdate