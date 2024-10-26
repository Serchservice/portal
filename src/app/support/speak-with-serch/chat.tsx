import { observer } from "mobx-react-lite";
import React from "react";
import supportStore from "../../../backend/database/device/SupportStore";
import SpeakWithSerchResponse from "../../../backend/models/support/SpeakWithSerchResponse";
import {
    BackdropLoader, CircularIconButton, Column, Container, ExtraButton, Image, Notify,
    Row, SearchBar, Shimmer, SizedBox, Spacer, StyledMenu, Text, TextAreaField, Utility
} from "@serchservice/web-ui-kit";
import Connect from "../../../backend/api/Connect";
import IssueResponse from "../../../backend/models/support/IssueResponse";
import AppTheme from "../../../configuration/Theme";
import preferenceStore from "../../../backend/database/device/PreferenceStore";
import Utils from "../../../utils/Utils";
import adminStore from "../../../backend/database/auth/AdminStore";
import CommonProfileView from "../../../modals/CommonProfileView";
import useRouteUpdate from "../../../configuration/hooks/useRouteUpdate";

interface SpeakWithSerchChatViewProps {
    onTicketUpdated: (update: SpeakWithSerchResponse) => void;
}

const SpeakWithSerchChatView: React.FC<SpeakWithSerchChatViewProps> = observer(({ onTicketUpdated }) => {
    const [isLoading, setIsLoading] = React.useState(false)

    const connect = new Connect({});
    const { openTicket, handleOpenTicket, handleCloseTicket } = useRouteUpdate()

    React.useEffect(() => {
        const savedTicket = supportStore.read.ticket;
        const speak = supportStore.read.speakWithSerch;
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("ticket");

        if((savedTicket === speak.ticket || token === speak.ticket) && speak.ticket !== "") {
            handleOpenTicket(speak)
        } else if((token && token !== "") || (savedTicket && savedTicket !== "")) {
            async function fetchChat() {
                const id = token || savedTicket

                setIsLoading(true);
                const response = await connect.get(`/scope/support/speak-with-serch/find?ticket=${id}`);
                setIsLoading(false);
                if (response) {
                    if (response.isSuccess) {
                        if (response.data) {
                            handleUpdate(SpeakWithSerchResponse.fromJson(response.data));
                        }
                    } else {
                        handleCloseTicket()
                        Notify.error(response.message);
                    }
                }
            }

            fetchChat()
        }
    }, [ supportStore.read.ticket, supportStore.read.speakWithSerch, location.search ])

    const handleUpdate = (update: SpeakWithSerchResponse) => {
        handleOpenTicket(update)
        onTicketUpdated(update)
    }

    const dimmed = preferenceStore.read.isDark;
    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);
    const [isUserOpen, setIsUserOpen] = React.useState(false);
    const [isAdminOpen, setIsAdminOpen] = React.useState(false);

    const [isClosing, setIsClosing] = React.useState(false);
    const handleClosingTicket = async () => {
        setIsClosing(true)
        const response = await connect.patch(`/scope/support/speak-with-serch/close?ticket=${openTicket?.ticket}`)
        setIsClosing(false)
        if (response) {
            if (response.isSuccess) {
                if (response.data) {
                    handleUpdate(SpeakWithSerchResponse.fromJson(response.data));
                }
                Notify.success(response.message)
            } else {
                Notify.error(response.message)
            }
        }
    };

    const [isResolving, setIsResolving] = React.useState(false);
    const handleResolveTicket = async () => {
        setIsResolving(true)
        const response = await connect.patch(`/scope/support/speak-with-serch/resolve?ticket=${openTicket?.ticket}`)
        setIsResolving(false)
        if (response) {
            if (response.isSuccess) {
                if (response.data) {
                    handleUpdate(SpeakWithSerchResponse.fromJson(response.data));
                }
                Notify.success(response.message)
            } else {
                Notify.error(response.message)
            }
        }
    };

    const buildHeader = () => {
        if(isLoading) {
            return (
                <Container backgroundColor={AppTheme.appbar} width="100%" borderRadius="16px 16px 0 0" padding="8px">
                    <Row style={{gap: "8px", padding: "2px"}}>
                        <Shimmer dimmed={dimmed} height={20} width={20} type="circular" />
                        <Shimmer dimmed={dimmed} height={40} width={40} type="circular" />
                        <Column mainAxisSize="min" crossAxisSize="max" crossAxis="flex-start" style={{gap: "2px"}}>
                            <Shimmer dimmed={dimmed} height={14} width={200} radius={6} />
                            <Shimmer dimmed={dimmed} height={12} width={300} radius={6} />
                        </Column>
                        <Spacer />
                        <Row crossAxis="center" mainAxisSize="min" style={{gap: "8px"}}>
                            <Shimmer dimmed={dimmed} height={12} width={70} radius={6} />
                            <Shimmer dimmed={dimmed} height={20} width={20} type="circular" />
                        </Row>
                    </Row>
                </Container>
            )
        } else if(!openTicket || !openTicket?.ticket) {
            return (<></>)
        } else {
            const more = [
                {
                    title: "Copy ticket id",
                    onClick: () => Utility.copy(openTicket.ticket),
                    color: AppTheme.primary
                },
                openTicket.isOpen && {
                    title: "Close ticket",
                    onClick: () => handleClosingTicket(),
                    color: AppTheme.error
                },
                openTicket.isOpen && {
                    title: "Resolve ticket",
                    onClick: () => handleResolveTicket(),
                    color: AppTheme.success
                },
                (openTicket.assignedAdmin && openTicket.assignedAdmin?.id !== adminStore.read.profile.id) && {
                    title: "View assigned admin",
                    onClick: () => setIsAdminOpen(true),
                    color: AppTheme.primary
                },
                {
                    title: "View user profile",
                    onClick: () => setIsUserOpen(true),
                    color: AppTheme.primary
                },
            ]

            return (
                <Container backgroundColor={AppTheme.appbar} width="100%" borderRadius="16px 16px 0 0" padding="8px">
                    <Row style={{gap: "8px", padding: "2px"}}>
                        <ExtraButton
                            icon="solar:arrow-left-line-duotone"
                            color={AppTheme.primary}
                            title=""
                            iconSize={1}
                            fontSize="14px"
                            borderRadius="50%"
                            rootStyle={{ width: "auto", minWidth: "auto" }}
                            padding="6px"
                            onClick={() => handleCloseTicket()}
                            hoverColor={AppTheme.hover}
                            iconStyle={{margin: "0"}}
                        />
                        <Image image={openTicket.user.avatar || Utility.DEFAULT_IMAGE} height={40} style={{ borderRadius: "50%" }}/>
                        <Column mainAxisSize="min" crossAxisSize="max" crossAxis="flex-start" style={{gap: "2px"}}>
                            <Text text={openTicket.user.name} size={14} color={AppTheme.primary} />
                            <Text text={openTicket.user.emailAddress} size={12} color={AppTheme.primary} />
                        </Column>
                        <Spacer />
                        <Row crossAxis="center" mainAxisSize="min" style={{gap: "8px"}}>
                            <Container backgroundColor={Utility.lightenColor(Utils.supportIconInfo(openTicket.status).color, 50)} padding="3px" borderRadius="6px">
                                <Text text={openTicket.status} size={11} color={Utils.supportIconInfo(openTicket.status).color} />
                            </Container>
                            <ExtraButton
                                icon="gg:details-more"
                                color={AppTheme.primary}
                                title=""
                                iconSize={1}
                                fontSize="14px"
                                borderRadius="50%"
                                rootStyle={{ width: "auto", minWidth: "auto" }}
                                padding="6px"
                                onClick={e => setAnchor(e.currentTarget)}
                                hoverColor={AppTheme.hover}
                                iconStyle={{margin: "0"}}
                            />
                        </Row>
                        <StyledMenu anchorEl={anchor} backgroundColor={AppTheme.appbar} isOpen={Boolean(anchor)} onClose={() => setAnchor(undefined)}>
                            {more.map((option, index) => {
                                if(option) {
                                    return (
                                        <Container
                                            key={index}
                                            padding="10px"
                                            onClick={() => {
                                                option.onClick()
                                                setAnchor(undefined)
                                            }}
                                            hoverBackgroundColor={AppTheme.hover}
                                            backgroundColor={"transparent"}
                                        >
                                            <Text text={option.title} size={12} color={option.color} />
                                        </Container>
                                    )
                                } else {
                                    return (<SizedBox key={index} height={0} />)
                                }
                            })}
                        </StyledMenu>
                    </Row>
                </Container>
            )
        }
    }

    const buildView = () => {
        if(isLoading) {
            return (
                <Column></Column>
            )
        } else if(!openTicket || !openTicket?.ticket) {
            return (<></>)
        } else {
            return (<View onTicketUpdated={handleUpdate} />)
        }
    }

    return (
        <React.Fragment>
            <Column mainAxisSize="max" crossAxisSize="max" crossAxis="flex-start">
                {buildHeader()}
                {buildView()}
            </Column>
            <BackdropLoader open={isResolving || isClosing} color={AppTheme.primary} />
            <CommonProfileView isOpen={isUserOpen} handleClose={() => setIsUserOpen(false)} profile={openTicket?.user} />
            <CommonProfileView isOpen={isAdminOpen} handleClose={() => setIsAdminOpen(false)} profile={openTicket?.assignedAdmin} />
        </React.Fragment>
    )
})

const View: React.FC<SpeakWithSerchChatViewProps> = observer(({ onTicketUpdated }) => {
    const openTicket = supportStore.read.speakWithSerch;

    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const [list, setList] = React.useState<IssueResponse[]>(openTicket.issues || []);
    const handleSearch = React.useCallback((results: IssueResponse[]) => {
        setList(results);
    }, []);

    React.useEffect(() => {
        scrollToBottom();
    }, [list]);

    const [message, setMessage] = React.useState("");
    const [isSending, setIsSending] = React.useState(false);
    const [rows, setRows] = React.useState(1);
    const [height, setHeight] = React.useState<number | string>('auto');
    const maxHeight = 200;

    const connect = new Connect({});

    const handleSend = async () => {
        if (message === "") {
            Notify.info("Message cannot be empty");
        } else {
            setIsSending(true);
            const response = await connect.post("/scope/support/speak-with-serch/reply", {
                ticket: openTicket.ticket,
                comment: message,
            });
            setIsSending(false);
            if (response) {
                if (response.isSuccess) {
                    setMessage("");
                    setRows(1); // Reset rows after sending
                    setHeight('auto')
                    if (response.data) {
                        onTicketUpdated(SpeakWithSerchResponse.fromJson(response.data));
                    }
                    Notify.success("Message sent");
                } else {
                    Notify.error(response.message);
                }
            }
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const currentMessage = e.target.value;
        setMessage(currentMessage);

        const textarea = e.target;
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);
        textarea.style.height = `${newHeight}px`;

        // Update the component state to reflect the new height
        setHeight(newHeight);
    };

    return (
        <Column mainAxisSize="max" crossAxisSize="max">
            <Column mainAxisSize="max" crossAxisSize="max" style={{ overflow: "scroll" }}>
                <Column mainAxisSize="max" crossAxisSize="max" style={{gap: "8px", padding: "8px", height: "300px"}}>
                    <SearchBar
                        onSearch={handleSearch}
                        list={openTicket.issues}
                        placeholder="Search dates, ids, messages..."
                        backgroundColor={AppTheme.appbar}
                        inputStyle={{fontSize: "14px", backgroundColor: "transparent"}}
                        boxStyle={{borderRadius: "24px"}}
                        textColor={AppTheme.primary}
                        textFocusedColor={AppTheme.hint}
                        textUnfocusedColor={AppTheme.appbar}
                        parentStyle={{margin: "0", padding: "0"}}
                    />
                    {list.map((issue, key) => (<SpeakWithSerch issue={issue} key={key} ticket={openTicket.ticket} />))}
                    <div ref={messagesEndRef} />
                </Column>
            </Column>
            <Row style={{ marginTop: "5px", gap: "12px", backgroundColor: AppTheme.appbar, padding: "12px 8px", borderRadius: "0 0 16px 16px" }}>
                <TextAreaField
                    placeHolder="Reply to this ticket"
                    value={message}
                    onChangeEvent={e => handleInputChange(e)}
                    borderRadius={8}
                    rows={rows}
                    needSpacer={false}
                    backgroundColor={AppTheme.secondary}
                    color={AppTheme.primary}
                    borderColor={AppTheme.secondary}
                    onKeyDown={handleKeyPress}
                    parentStyle={{
                        width: "90%",
                        height: typeof height === 'string' ? height : `${height}px`,
                        maxHeight: `${maxHeight}px`,
                        overflowY: 'auto'
                    }}
                    inputStyle={{
                        resize: "none",
                        height: typeof height === 'string' ? height : `${height}px`,
                        maxHeight: `${maxHeight}px`,
                    }}
                    inputFocusStyle={{borderColor: AppTheme.secondary}}
                />
                <Spacer />
                <CircularIconButton
                    icon="lets-icons:send-duotone"
                    onClick={handleSend}
                    size={1}
                    title="Send"
                    backgroundColor={AppTheme.primary}
                    color={AppTheme.appbar}
                    loading={isSending}
                />
            </Row>
        </Column>
    );
});

interface SpeakWithSerchProps {
    issue: IssueResponse;
    ticket: string;
}

const SpeakWithSerch: React.FC<SpeakWithSerchProps> = observer(({ issue, ticket }) => {
    React.useEffect(() => {
        const connect = new Connect({ withError: false })
        connect.patch(`/company/speak_with_serch/${ticket}`)
    }, [ticket])

    return (
        <Container
            padding="8px"
            margin="0 8px 0 0"
            borderRadius="12px"
            maxWidth="80%"
            backgroundColor={AppTheme.appbar}
            style={{
                alignSelf: issue.isSerch ? "flex-end" : "flex-start",
                marginLeft: issue.isSerch ? "none" : "8px",
            }}
        >
            <Text text={issue.label} size={12} color={AppTheme.hint} />
            <SizedBox height={6} />
            <Text text={issue.message} size={14} color={AppTheme.primary} />
        </Container>
    )
})

export default SpeakWithSerchChatView