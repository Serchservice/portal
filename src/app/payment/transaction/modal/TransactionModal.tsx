import {
    BackdropLoader, Column, Container, DrawerDialog, ExtraButton, ModalProps,
    Notify, Padding, Row, SimpleStep, SizedBox, Spacer, Text, Utility, Wrap
} from "@serchservice/web-ui-kit";
import { TransactionScopeResponse } from "../../../../backend/models/payment/TransactionScopeResponse";
import React from "react";
import { observer } from "mobx-react-lite";
import AppTheme from "../../../../configuration/Theme";
import { Icon } from "@iconify/react/dist/iconify.js";
import Utils from "../../../../utils/Utils";
import TimeUtils from "../../../../utils/TimeUtils";
import Connect from "../../../../backend/api/Connect";

interface TransactionModalProps extends ModalProps {
    data: TransactionScopeResponse;
    onTransactionUpdated: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = observer(({ data, isOpen, handleClose, onTransactionUpdated }) => {
    const [transaction, setTransaction] = React.useState(data)

    React.useEffect(() => {
        const transactionData = TransactionScopeResponse.fromJson(data);
        setTransaction(transactionData);
    }, []);

    const hasEvent = transaction.event && transaction.event !== "";
    const hasResolution = transaction.resolution !== 0;
    const hasDetails = (transaction.sender && transaction.sender.id) || (transaction.recipient && transaction.recipient.id)

    const [isLoading, setIsLoading] = React.useState(false)

    const connect = new Connect({})
    async function handleResolve(status: string) {
        if(isLoading) {
            return
        }

        setIsLoading(true)
        const response = await connect.patch(`/scope/payment/transaction/resolve?id=${transaction.id}&status=${status}`)
        setIsLoading(false)

        if(response) {
            if(response.isSuccess) {
                if(response.data) {
                    setTransaction(TransactionScopeResponse.fromJson(response.data))
                    handleClose()
                    onTransactionUpdated()
                }
                Notify.success(response.message)
            } else {
                Notify.error(response.message)
            }
        }
    }

    return (
        <React.Fragment>
            <DrawerDialog isOpen={isOpen} handleClose={handleClose} position="right" bgColor={AppTheme.appbar} width="90%">
                <Column gap="10px" style={{overflow: "hidden"}} mainAxisSize="max">
                    <Container padding="18px" backgroundColor={AppTheme.background}>
                        <Column gap="6px">
                            <Row>
                                <Container borderRadius="12px" padding="3px 6px" hoverBackgroundColor={AppTheme.hover} onClick={handleClose}>
                                    <Row mainAxisSize="min" gap="6px">
                                        <Icon icon="solar:arrow-left-line-duotone" color={AppTheme.primary} height="1.2em" width="1.2em" />
                                        <Text text="Back" color={AppTheme.primary} size={12} />
                                    </Row>
                                </Container>
                            </Row>
                            <Row gap="10px">
                                <Text text={`Transaction #${transaction.id}`} weight="bold" color={AppTheme.primary} size={20} />
                                <ExtraButton
                                    padding="6px"
                                    borderRadius="16px"
                                    backgroundColor={AppTheme.appbar}
                                    color={AppTheme.primary}
                                    iconSize={1}
                                    hoverColor={AppTheme.hover}
                                    iconStyle={{margin: "0"}}
                                    rootStyle={{width: "auto", minWidth: "auto"}}
                                    icon="stash:copy-duotone"
                                    title=""
                                    onClick={() => Utility.copy(transaction.id)}
                                />
                            </Row>
                        </Column>
                    </Container>
                    <Column mainAxisSize="max" style={{overflow: "scroll", padding: "12px"}}>
                        <Column gap="20px">
                            {(hasEvent || hasResolution) && (
                                <Row>
                                    {hasResolution && (
                                        <Container backgroundColor={AppTheme.hover} padding="8px" borderRadius="10px">
                                            <Text
                                                text={[
                                                    "This transaction had an issue which was resolved by an admin",
                                                    "To view the full details of this resolution, tap on the button below."
                                                ].join(". ")}
                                                color={AppTheme.primary}
                                            />
                                            <SizedBox height={20} />
                                            <ExtraButton
                                                padding="6px 10px"
                                                borderRadius="16px"
                                                backgroundColor={AppTheme.background}
                                                fontSize="12px"
                                                color={AppTheme.primary}
                                                iconSize={1}
                                                hoverColor={AppTheme.hover}
                                                iconStyle={{margin: "0 4px 0 0"}}
                                                rootStyle={{width: "auto", minWidth: "auto"}}
                                                icon="line-md:circle-filled-to-confirm-circle-filled-transition"
                                                title="View resolution"
                                            />
                                        </Container>
                                    )}
                                    <Spacer />
                                    {hasEvent && (
                                        <ExtraButton
                                            padding="6px 10px"
                                            borderRadius="16px"
                                            backgroundColor={AppTheme.background}
                                            fontSize="12px"
                                            color={AppTheme.primary}
                                            iconSize={1}
                                            hoverColor={AppTheme.hover}
                                            iconStyle={{margin: "0 4px 0 0"}}
                                            rootStyle={{width: "auto", minWidth: "auto"}}
                                            icon="lsicon:open-new-filled"
                                            title="View event"
                                        />
                                    )}
                                </Row>
                            )}
                            <Text text="Transaction Details" color={AppTheme.primary} size={16} />
                            <Wrap spacing={60} runSpacing={20}>
                                {[
                                    {
                                        title: "Type of transaction",
                                        value: transaction.type
                                    },
                                    {
                                        title: "Label",
                                        value: transaction.label
                                    },
                                    {
                                        title: "Transaction mode",
                                        value: transaction.mode
                                    },
                                    {
                                        title: "Reference",
                                        value: transaction.reference
                                    },
                                    {
                                        title: "Amount",
                                        value: transaction.amount
                                    },
                                    {
                                        title: "Reason",
                                        value: transaction.reason && transaction.reason.length > 0 ? transaction.reason : "N/A"
                                    },
                                    {
                                        title: "Verification",
                                        value: transaction.verified
                                    },
                                    {
                                        title: "Status",
                                        value: transaction.status,
                                        color: transaction.isPending ? AppTheme.pending : transaction.isFailed ? AppTheme.error : AppTheme.success
                                    }
                                ].map((item, index) => {
                                    return (
                                        <Column key={index} gap="7px" mainAxisSize="min" crossAxisSize="min" crossAxis="flex-start">
                                            <Text text={item.title} color={AppTheme.hint} size={12} />
                                            {item.color !== undefined && (
                                                <Row
                                                    mainAxisSize="min"
                                                    mainAxis="center"
                                                    style={{
                                                        backgroundColor: Utility.lightenColor(item.color, 55),
                                                        padding: "4px",
                                                        borderRadius: "6px"
                                                    }}
                                                >
                                                    <Text text={item.value} color={item.color} align="center" size={12} />
                                                </Row>
                                            )}
                                            {(typeof item.value === 'string' && item.color === undefined) && (
                                                <Text text={Utils.clearRole(item.value)} color={AppTheme.primary} size={15} />
                                            )}
                                            {typeof item.value === 'boolean' && (
                                                <Icon
                                                    icon={item.value === true ? "lets-icons:check-fill" : "lets-icons:close-round-duotone"}
                                                    width="1.3em"
                                                    height="1.3em"
                                                    style={{color: item.value === true ? AppTheme.success : AppTheme.error}}
                                                />
                                            )}
                                        </Column>
                                    )
                                })}
                            </Wrap>
                            <SizedBox height={20} />
                            <Text text="Transaction History" color={AppTheme.primary} size={16} />
                            <Column>
                                {[
                                    {
                                        title: "Transaction was created at",
                                        value: transaction.createdAt,
                                    },
                                    {
                                        title: "Transaction was last updated at",
                                        value: transaction.updatedAt,
                                    }
                                ].map((step, index) => {
                                    return (
                                        <SimpleStep
                                            key={index}
                                            content={
                                                <Padding only={{top: 3}}>
                                                    <Row mainAxisSize="max" crossAxis="center" style={{width: "100%"}}>
                                                        <Text text={`${step.title}:`} size={14} color={AppTheme.primary} />
                                                        <Spacer />
                                                        <Text text={TimeUtils.dayWithTimezone(step.value)} size={14} color={AppTheme.primary} />
                                                    </Row>
                                                </Padding>
                                            }
                                            height={10}
                                            color={AppTheme.hint}
                                            showBottom={index !== 1}
                                        />
                                    )
                                })}
                            </Column>
                            <SizedBox height={20} />
                            {hasDetails && (
                                <>
                                    <Text text="Participant Details" color={AppTheme.primary} size={16} />
                                    <Row gap="20px">
                                        {[
                                            (transaction.sender && transaction.sender.id) && {
                                                title: "View sender details",
                                                onClick: () => {}
                                            },
                                            (transaction.recipient && transaction.recipient.id) && {
                                                title: "View recipient details",
                                                onClick: () => {}
                                            }
                                        ].map((button, index) => {
                                            if(button) {
                                                return (
                                                    <ExtraButton
                                                        key={index}
                                                        padding="6px 10px"
                                                        borderRadius="16px"
                                                        backgroundColor={AppTheme.background}
                                                        fontSize="12px"
                                                        color={AppTheme.primary}
                                                        iconSize={1}
                                                        onClick={() => button.onClick()}
                                                        hoverColor={AppTheme.hover}
                                                        iconStyle={{margin: "0 4px 0 0"}}
                                                        rootStyle={{width: "auto", minWidth: "auto"}}
                                                        icon="lsicon:open-new-filled"
                                                        title={button.title}
                                                    />
                                                )
                                            } else {
                                                return <React.Fragment key={index}></React.Fragment>
                                            }
                                        })}
                                    </Row>
                                    <SizedBox height={20} />
                                </>
                            )}
                            <Wrap spacing={20}>
                                {[
                                    (transaction.isSuccess || transaction.isPending) && {
                                        title: "Resolve as failed",
                                        status: "FAILED",
                                        icon: "lets-icons:cancel-duotone-line",
                                        color: AppTheme.error
                                    },
                                    (transaction.isFailed || transaction.isPending) && {
                                        title: "Resolve as successful",
                                        status: "SUCCESSFUL",
                                        icon: "ep:success-filled",
                                        color: AppTheme.success
                                    },
                                    (transaction.isSuccess || transaction.isFailed) && {
                                        title: "Resolve as pending",
                                        status: "PENDING",
                                        icon: "ic:twotone-schedule",
                                        color: AppTheme.pending
                                    }
                                ].map((button, index) => {
                                    if(button) {
                                        return (
                                            <ExtraButton
                                                key={index}
                                                padding="6px 10px"
                                                borderRadius="16px"
                                                backgroundColor={Utility.lightenColor(button.color, 50)}
                                                fontSize="12px"
                                                color={button.color}
                                                iconSize={1}
                                                onClick={() => handleResolve(button.status)}
                                                hoverColor={AppTheme.hover}
                                                iconStyle={{margin: "0 4px 0 0"}}
                                                rootStyle={{width: "auto", minWidth: "auto"}}
                                                icon={button.icon}
                                                title={button.title}
                                            />
                                        )
                                    } else {
                                        return <React.Fragment key={index}></React.Fragment>
                                    }
                                })}
                            </Wrap>
                        </Column>
                    </Column>
                </Column>
            </DrawerDialog>
            <BackdropLoader open={isLoading} color={AppTheme.primary} />
        </React.Fragment>
    )
})

export default TransactionModal