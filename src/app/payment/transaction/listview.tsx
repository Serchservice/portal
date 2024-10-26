import { Icon } from "@iconify/react/dist/iconify.js";
import {
    Column, Container, ExtraButton, Field, Notify, Padding,
    Pager, Row, SizedBox, Spacer, StyledMenu, Text, Utility, Wrap
} from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import Connect from "../../../backend/api/Connect";
import commonStore from "../../../backend/database/device/CommonStore";
import transactionStore from "../../../backend/database/temp/TransactionStore";
import { PaymentApiResponse } from "../../../backend/models/payment/base/PaymentApiResponse";
import { TransactionGroupScopeResponse } from "../../../backend/models/payment/TransactionGroupScopeResponse";
import { TransactionScopeResponse } from "../../../backend/models/payment/TransactionScopeResponse";
import useRouteUpdate from "../../../configuration/hooks/useRouteUpdate";
import AppTheme from "../../../configuration/Theme";
import Utils from "../../../utils/Utils";
import TransactionModal from "./modal/TransactionModal";

interface ListViewProps {
    status: string;
    title: string;
    total: number;
    isSearching: boolean;
    list: TransactionGroupScopeResponse[];
    onReload: () => void;
}

const TransactionListView: React.FC<ListViewProps> = observer(({ list, status, title, total, isSearching, onReload }) => {
    const filter = transactionStore.getItem(status);
    const [quantity, setQuantity] = React.useState(total)
    const [transactions, setTransactions] = React.useState<TransactionGroupScopeResponse[]>([]);
    const [anchor, setAnchor] = React.useState<HTMLButtonElement | undefined>(undefined);
    const [openFilter, setOpenFilter] = React.useState<string>();

    React.useEffect(() => {
        setQuantity(total)
    }, [total])

    const filterButtons = [
        { id: "date", header: "Date Range" },
        { id: "type", header: "Transaction Type" },
        { id: "more", header: "si:dashboard-customize-duotone" }
    ]

    async function handleFilter(option: string) {
        const selected = filterButtons.find(d => d.id === openFilter);
        if (!selected) return;

        // Set the filter details in the store
        transactionStore.setItem(status, {
            id: openFilter || "",
            header: selected.header,
            title: title,
            text: `${selected.header || 'By' } | ${option}`
        });

        if(selected.id === "type") {
            transactionStore.setItem(status, { type: option });
            handleFetch()
        }

        setAnchor(undefined);
    }

    const removeFilter = () => {
        transactionStore.clearItem(status);
        setTransactions(list)
        setQuantity(total)
        setOpenFilter(undefined);
    };

    React.useEffect(() => {
        if (filter?.transactions !== undefined) {
            setTransactions(filter.transactions);
        } else {
            setTransactions(list);
        }
    }, [list, filter]);

    const [isFetching, setIsFetching] = React.useState(false)

    const connect = new Connect({})
    async function handleFetch() {
        if(isFetching) {
            return
        }

        setIsFetching(true)
        const params = new URLSearchParams({
            status: status,
            page: ((filter?.page ?? 0) + 1).toString(),
            size: (filter?.pageSize ?? 20).toString(),
        });

        if (filter?.type) params.append('type', filter.type);
        if (filter?.start) params.append('start', filter.start);
        if (filter?.end) params.append('end', filter.end);

        const response = await connect.get(`/scope/payment/transaction/filter?${params.toString()}`)
        setIsFetching(false)
        if (response) {
            if (response.isSuccess) {
                if (response.data) {
                    const data: PaymentApiResponse<TransactionGroupScopeResponse> = PaymentApiResponse.fromJson(response.data)
                    setTransactions(data.transactions)
                    setQuantity(data.total)
                    transactionStore.setItem(status, {page: Number(params.get('page'))})
                }
            } else {
                Notify.error(response.message);
            }
        }
    }

    const name = `Serch | ${title} Transactions`;

    const buildFilterOption = () => {
        if (openFilter === filterButtons[0].id) {
            return (<></>);
        } else if (openFilter === filterButtons[1].id) {
            return commonStore.read.types.map((option, index) => {
                return (
                    <Container
                        key={index}
                        padding="10px"
                        onClick={() => handleFilter(option.name)}
                        hoverBackgroundColor={AppTheme.hover}
                        backgroundColor={"transparent"}
                    >
                        <Text text={option.name} size={12} color={AppTheme.primary} />
                    </Container>
                );
            });
        } else {
            return [
                {
                    title: "Export to Json",
                    onClick: () => Utils.exportToJson(transactions, name),
                    icon: "carbon:json",
                },
                {
                    title: "Export to csv",
                    onClick: () => Utils.exportToCsv(transactions, name),
                    icon: "hugeicons:csv-02",
                }
            ].map((option, index) => {
                return (
                    <Container
                        key={index}
                        padding="10px"
                        onClick={() => {
                            option.onClick();
                            setAnchor(undefined)
                        }}
                        hoverBackgroundColor={AppTheme.hover}
                        backgroundColor={"transparent"}
                        width="150px"
                    >
                        <Row crossAxis="center" crossAxisSize="min" gap="10px">
                            <Icon icon={option.icon} width="1.2em" height="1.2em" color={AppTheme.primary} />
                            <Text text={option.title} color={AppTheme.primary} size={12} />
                        </Row>
                    </Container>
                );
            })
        }
    };

    return (
        <React.Fragment>
            <Container backgroundColor={AppTheme.appbar} padding="8px" borderRadius="10px">
                <Row mainAxisSize="max" mainAxis="flex-end">
                    <Wrap spacing={10} runSpacing={10}>
                        {filterButtons.map((button, index) => {
                            const isLast = index === filterButtons.length - 1

                            return (
                                <ExtraButton
                                    key={index}
                                    padding={isLast ? "6px" : "6px 10px"}
                                    borderRadius="16px"
                                    backgroundColor={AppTheme.background}
                                    fontSize="12px"
                                    color={AppTheme.primary}
                                    onClick={e => {
                                        setOpenFilter(button.id);
                                        setAnchor(e.currentTarget);
                                    }}
                                    iconSize={1}
                                    hoverColor={AppTheme.hover}
                                    iconStyle={{margin: "0"}}
                                    rootStyle={{width: "auto", minWidth: "auto"}}
                                    icon={isLast ? button.header : ""}
                                    title={!isLast ? button.header : ""}
                                />
                            )
                        })}
                    </Wrap>
                </Row>
                {openFilter && (
                    <StyledMenu anchorEl={anchor} backgroundColor={AppTheme.background} isOpen={Boolean(anchor)} onClose={() => setAnchor(undefined)}>
                        {buildFilterOption()}
                    </StyledMenu>
                )}
                {(filter && filter.text) && (<SizedBox height={10} />)}
                {(filter && filter.text) && (
                    <Row crossAxis="center" style={{ gap: "10px" }} mainAxisSize="min">
                        <Text text="Current Filter" color={AppTheme.hint} size={11.5} />
                        <Row crossAxis="center" crossAxisSize="min" mainAxisSize="min" style={{ backgroundColor: AppTheme.background, borderRadius: "10px", padding: "6px 6px 4px", gap: "10px" }}>
                            <Text text={filter.text} color={AppTheme.hint} size={11.5} />
                            <Container hoverBackgroundColor={AppTheme.hover} backgroundColor={"transparent"} padding="3px" borderRadius="50%" onClick={removeFilter}>
                                <Column mainAxis="center" crossAxis="center"><Icon icon="pajamas:close-xs" width="0.8em" height="0.8em" color={AppTheme.primary} /></Column>
                            </Container>
                        </Row>
                    </Row>
                )}
            </Container>
            <Container backgroundColor={AppTheme.appbar} borderRadius="10px" height="100%" style={{overflow: "hidden"}}>
                <View
                    isSearching={isSearching}
                    transactions={transactions}
                    title={title}
                    total={quantity}
                    status={status}
                    isFetching={isFetching}
                    onFetch={handleFetch}
                    onReload={onReload}
                />
            </Container>
        </React.Fragment>
    );
});

interface ViewProps {
    transactions: TransactionGroupScopeResponse[];
    isSearching: boolean;
    status: string;
    title: string;
    total: number;
    isFetching: boolean;
    onFetch: () => void;
    onReload: () => void;
}

const View: React.FC<ViewProps> = observer(({ transactions, isSearching, status, title, total, isFetching, onFetch, onReload }) => {
    const [filtered, setFiltered] = React.useState<TransactionGroupScopeResponse[]>([])
    const filter = transactionStore.getItem(status)
    const name = `Serch | ${title} Transactions`;

    const handleSelect = (data: TransactionScopeResponse | TransactionScopeResponse[]) => {
        let list = filter?.selected ?? [];

        if (Array.isArray(data)) {
            data.forEach((dataItem) => {
                const exists = list.includes(dataItem.id);
                if (exists) {
                    list = list.filter(item => item !== dataItem.id);
                } else {
                    list.push(dataItem.id);
                }
            });
        } else {
            const exists = list.includes(data.id);
            if (exists) {
                list = list.filter(item => item !== data.id);
            } else {
                list.push(data.id);
            }
        }

        transactionStore.setItem(status, {selected: list});
    };

    const { openTransaction, handleOpenTransaction, handleCloseTransaction } =  useRouteUpdate()

    const connect = new Connect({})
    React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const transactionId = searchParams.get('id');

        if(transactionStore.getOpenId() !== transactionId && transactionId !== null) {
            async function fetchScope() {
                const response = await connect.get(`/scope/payment/transaction?id=${transactionId}`);
                if (response) {
                    if (response.isSuccess) {
                        if (response.data) {
                            handleOpenTransaction(TransactionScopeResponse.fromJson(response.data))
                        }
                    } else {
                        Notify.error(response.message);
                    }
                }
            }

            fetchScope()
        }
    }, [location.search, transactionStore.getOpenId()]);

    const build = () => {
        if(isSearching || isFetching) {
            return (
                <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center">
                    <Icon icon="eos-icons:three-dots-loading" width="15em" height="15em"  style={{color: AppTheme.primary, opacity: "0.5"}} />
                    <Text text={`Fetching ${title.toLowerCase()} transactions`} color={AppTheme.hint} size={16} align="center" opacity={8} />
                </Column>
            )
        } else if(transactions.length > 0) {
            const color = status.toLowerCase().includes("success")
                ? AppTheme.success
                : status.toLowerCase().includes("fail")
                    ? AppTheme.error
                    : AppTheme.pending;
            const totalFetched = transactions.flatMap(d => d.transactions).length
            const showText = `Showing ${filtered.flatMap(d => d.transactions).length} out of ${totalFetched}`

            return (
                <Column mainAxisSize="max">
                    <Container backgroundColor={AppTheme.hint} padding="12px 18px">
                        <Row gap="10px">
                            <Text text={`${total} Transactions | ${showText} `} color={AppTheme.primary} />
                            <Spacer />
                            {[
                                {
                                    title: "View results per page:",
                                    update: (value: number) => transactionStore.setItem(status, {itemsPerPage: value}),
                                    value: filter?.itemsPerPage ?? 5
                                }
                            ].map((item, index) => (
                                <Row mainAxisSize="min" gap="3px" key={index}>
                                    <Text text={item.title} color={AppTheme.primary} />
                                    <Field
                                        type="tel"
                                        value={`${item.value}`}
                                        fontSize={13}
                                        onChange={e => {
                                            if(e === "") {
                                                item.update(5)
                                            } else {
                                                item.update(Number(e))
                                            }
                                        }}
                                        backgroundColor={AppTheme.primary}
                                        color={AppTheme.secondary}
                                        borderRadius={6}
                                        inputStyle={{padding: "5px", height: "100%"}}
                                        inputFocusStyle={{borderWidth: "0"}}
                                        parentStyle={{width: "30px", height: "25px", margin: "0"}}
                                    />
                                </Row>
                            ))}
                            {(total > totalFetched) && (
                                <ExtraButton
                                    padding="6px 10px"
                                    borderRadius="16px"
                                    backgroundColor={AppTheme.background}
                                    fontSize="12px"
                                    color={AppTheme.primary}
                                    iconSize={1}
                                    onClick={() => onFetch()}
                                    hoverColor={AppTheme.hover}
                                    iconStyle={{margin: "0 4px 0 0"}}
                                    rootStyle={{width: "auto", minWidth: "auto"}}
                                    icon="line-md:downloading-loop"
                                    title="See more"
                                />
                            )}
                            {(filter?.selected && filter?.selected.length > 0) && (
                                [
                                    {
                                        title: "Export selected to Json",
                                        onClick: () => Utils.exportToJson(transactions, name),
                                        icon: "carbon:json",
                                    },
                                    {
                                        title: "Export selected to csv",
                                        onClick: () => Utils.exportToCsv(transactions, name),
                                        icon: "hugeicons:csv-02",
                                    }
                                ].map((item, index) => (
                                    <ExtraButton
                                        key={index}
                                        padding="6px 10px"
                                        borderRadius="16px"
                                        backgroundColor={AppTheme.background}
                                        onClick={() => {
                                            item.onClick()
                                            transactionStore.setItem(status, {selected: []})
                                        }}
                                        fontSize="12px"
                                        color={AppTheme.primary}
                                        iconSize={1}
                                        hoverColor={AppTheme.hover}
                                        iconStyle={{margin: "0 4px 0 0"}}
                                        rootStyle={{width: "auto", minWidth: "auto"}}
                                        icon={item.icon}
                                        title={item.title}
                                    />
                                ))
                            )}
                        </Row>
                    </Container>
                    <Table
                        list={filtered}
                        status={status}
                        color={color}
                        onSelect={handleSelect}
                        onTransactionUpdated={onFetch}
                    />
                    <Row style={{margin: "10px 0"}}>
                        <Pager
                            items={transactions}
                            onSlice={setFiltered}
                            itemsPerPage={filter?.itemsPerPage ?? 5}
                            pagerStyle={{margin: "0"}}
                        />
                    </Row>
                </Column>
            )
        } else {
            return (
                <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center">
                    <Icon icon="solar:bomb-emoji-bold-duotone" width="15em" height="15em"  style={{color: AppTheme.primary, opacity: "0.5"}} />
                    <Text text={`No ${title.toLowerCase()} transactions`} color={AppTheme.hint} size={16} align="center" opacity={8} />
                </Column>
            )
        }
    }

    return (
        <React.Fragment>
            {build()}
            {openTransaction && (
                <TransactionModal
                    isOpen={openTransaction !== undefined}
                    handleClose={handleCloseTransaction}
                    data={openTransaction}
                    onTransactionUpdated={onReload}
                />
            )}
        </React.Fragment>
    )
})

interface SelectedProps {
    color: string;
    status: string;
    onSelect: (data: TransactionScopeResponse | TransactionScopeResponse[]) => void;
    onTransactionUpdated: () => void;
}

interface TableProps extends SelectedProps {
    list: TransactionGroupScopeResponse[];
}

const columns = ['', 'ID', "Type", "Verified", "Amount", "Reference"]
const widths = [4, 30, 15, 15, 20, 16]

const Table: React.FC<TableProps> = observer(({ list, status, color, onSelect, onTransactionUpdated }) => {
    const isAllSelected = list.flatMap(d => d.transactions).every(transaction => transactionStore.getItem(status)?.selected?.includes(transaction.id))
    const isSomeSelected = list.flatMap(d => d.transactions).some(transaction => transactionStore.getItem(status)?.selected?.includes(transaction.id))

    const handleSelect = () => {
        const data = list.flatMap(d => d.transactions)
        let listed = transactionStore.getItem(status)?.selected ?? [];

        if(isAllSelected) {
            listed = []
        } else if(isSomeSelected) {
            data.forEach((dataItem) => {
                const exists = listed.includes(dataItem.id);
                if (!exists) {
                    listed.push(dataItem.id);
                }
            });
        } else {
            data.forEach((dataItem) => {
                const exists = listed.includes(dataItem.id);
                if (exists) {
                    listed = listed.filter(item => item !== dataItem.id);
                } else {
                    listed.push(dataItem.id);
                }
            });
        }

        transactionStore.setItem(status, {selected: listed});
    };

    return (
        <React.Fragment>
            <Row style={{backgroundColor: "#101010FF", marginBottom: "10px"}}>
                {columns.map((column, index) => {
                    if(index === 0) {
                        return (
                            <Checker
                                color={color}
                                key={index}
                                width={widths[index]}
                                onCheck={handleSelect}
                                isAll={isAllSelected}
                                isSome={isSomeSelected}
                            />
                        )
                    } else {
                        return (
                            <Container key={index} width={`${widths[index]}%`} padding="16px 10px">
                                <Text text={column} color="#fff" align={index !== 1 ? "center" : "left"} />
                            </Container>
                        )
                    }
                })}
            </Row>
            <Column style={{overflow: "scroll"}} mainAxisSize="max" crossAxisSize="max">
                <Column gap="10px" crossAxisSize="max">
                    {list.map((group, index) => (
                        <GroupListItem
                            onTransactionUpdated={onTransactionUpdated}
                            group={group}
                            key={index}
                            status={status}
                            color={color}
                            onSelect={onSelect}
                        />
                    ))}
                </Column>
            </Column>
        </React.Fragment>
    )
})

interface CheckerProps {
    isAll?: boolean;
    isSome?: boolean;
    isChecked?: boolean;
    onCheck: () => void;
    width: number;
    color: string;
}

const Checker: React.FC<CheckerProps> = observer(({ isAll, isSome, color, onCheck, width, isChecked }) => {
    const build = () => {
        if(isAll) {
            return <Container style={{cursor: "pointer"}} borderRadius="2px" backgroundColor={color} height="100%" width="100%" />
        } else if(isSome) {
            return <Container style={{cursor: "pointer"}} borderRadius="2px" backgroundColor={color} height="100%" width="100%" />
        } else if(isChecked) {
            return (
                <Container backgroundColor={color} borderRadius="2px" height="100%" width="100%" style={{cursor: "pointer"}}>
                    <Icon icon="mingcute:check-fill" height="100%" width="100%" style={{color: Utility.lightenColor(color, 60)}} />
                </Container>
            )
        }
    }

    return (
        <Row mainAxis="center" style={{width: `${width}%`}}>
            <Container
                border={`1px solid ${AppTheme.hint}`}
                width={16}
                height={16}
                borderRadius="4px"
                padding={isAll ? "" : isSome ? "2px" : ""}
                margin="0 0 2px 0"
                onClick={onCheck}
            >{build()}</Container>
        </Row>
    )
})

interface GroupListItemProps extends SelectedProps {
    group: TransactionGroupScopeResponse;
}

interface RowInterface {
    checked: boolean;
    item: TransactionScopeResponse;
}

const createRow = (props: RowInterface): RowInterface => {
    return {checked: props.checked, item: props.item}
}

const GroupListItem: React.FC<GroupListItemProps> = observer(({ group, color, onSelect, status, onTransactionUpdated }) => {
    const rows: RowInterface[] = group.transactions.map(item => createRow({
        checked: transactionStore.getItem(status)?.selected?.find(d => d === item.id) !== undefined,
        item: item
    }))

    return (
        <Column mainAxisSize="min" crossAxis="center">
            <Row>
                <Checker
                    color={color}
                    width={widths[0]}
                    onCheck={() => onSelect(group.transactions)}
                    isAll={group.transactions.every(transaction => transactionStore.getItem(status)?.selected?.includes(transaction.id))}
                    isSome={group.transactions.some(transaction => transactionStore.getItem(status)?.selected?.includes(transaction.id))}
                />
                <Padding symmetric={{horizontal: 8}}><Text text={group.label} color={AppTheme.hint} size={12} /></Padding>
            </Row>
            <SizedBox height={10} />
            <Column mainAxisSize="min">
                {rows.map((row, index) => (
                    <RowItem
                        row={row}
                        status={status}
                        key={index}
                        color={color}
                        onSelect={onSelect}
                        onTransactionUpdated={onTransactionUpdated}
                    />
                ))}
            </Column>
        </Column>
    );
});

interface RowItemProps extends SelectedProps {
    row: RowInterface;
}

const RowItem: React.FC<RowItemProps> = observer(({ row, color, onSelect, onTransactionUpdated }) => {
    const { openTransaction, handleOpenTransaction, handleCloseTransaction } =  useRouteUpdate()
    const rowData = ['', row.item.id, row.item.type, row.item.verified, row.item.amount, row.item.reference];
    const isOpen = openTransaction !== undefined && openTransaction.id === row.item.id

    return (
        <React.Fragment>
            <Container
                onClick={() => handleOpenTransaction(row.item)}
                backgroundColor={isOpen ? AppTheme.hover : row.checked ? color : AppTheme.background}
                padding="8px 0"
            >
                <Row>
                    {columns.map((_, index) => {
                        if(index === 0) {
                            return (
                                <Checker
                                    color="#fff"
                                    key={index}
                                    width={widths[index]}
                                    isChecked={row.checked}
                                    onCheck={() => onSelect(row.item)}
                                />
                            )
                        } else if(index === 3) {
                            const statusColor = rowData[index] === true ? AppTheme.success : AppTheme.error;
                            return (
                                <Row mainAxis="center" key={index} style={{width: `${widths[index]}%`, padding: "8px"}}>
                                    <Row
                                        mainAxisSize="min"
                                        mainAxis="center"
                                        style={{
                                            backgroundColor: Utility.lightenColor(statusColor, 55),
                                            padding: "4px",
                                            borderRadius: "6px"
                                        }}
                                    >
                                        <Text
                                            text={rowData[index] === true ? "Verified" : "Not verified"}
                                            color={statusColor}
                                            align="center"
                                            size={12}
                                        />
                                    </Row>
                                </Row>
                            )
                        } else {
                            return (
                                <Row mainAxis={index === 1 ? "flex-start" : "center"} key={index} style={{width: `${widths[index]}%`, padding: "8px"}}>
                                    <Text text={Utils.clearRole(`${rowData[index]}`)} color={row.checked ? "#fff" : AppTheme.primary} />
                                </Row>
                            )
                        }
                    })}
                </Row>
            </Container>
            {openTransaction && (
                <TransactionModal
                    isOpen={openTransaction !== undefined}
                    handleClose={handleCloseTransaction}
                    data={openTransaction}
                    onTransactionUpdated={onTransactionUpdated}
                />
            )}
        </React.Fragment>
    )
})

export default TransactionListView