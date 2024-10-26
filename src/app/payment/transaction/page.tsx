import { Icon } from "@iconify/react/dist/iconify.js";
import { ActionButton, Column, Container, Field, Notify, Row, SearchBar, Spacer, Text } from "@serchservice/web-ui-kit";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import React from "react";
import Access from "../../../backend/api/Access";
import { AccessService } from "../../../backend/api/AccessService";
import Connect from "../../../backend/api/Connect";
import Keys from "../../../backend/api/Keys";
import { PaymentApiResponse } from "../../../backend/models/payment/base/PaymentApiResponse";
import { TransactionGroupScopeResponse } from "../../../backend/models/payment/TransactionGroupScopeResponse";
import { RouteInterface } from "../../../configuration/Route";
import AppTheme from "../../../configuration/Theme";
import Utils from "../../../utils/Utils";
import Title from "../../../widgets/Title";
import TransactionListView from "./listview";
import { TransactionLoadingView } from "./loader";
import useRouteUpdate from "../../../configuration/hooks/useRouteUpdate";

export default function TransactionRoute(): RouteInterface {
    return {
        path: "/payment/transactions",
        page: (
            <React.Fragment>
                <Title title="Transactions" description="List of transactions in the Serchservice platform" useDesktopWidth />
                <LayoutView />
            </React.Fragment>
        )
    }
}

const LayoutView: React.FC = observer(() => {
    const access: AccessService = new Access()

    React.useEffect(() => {
        access.fetchTransactionTypes()
    }, []);

    const connect = new Connect({});

    const { data, isLoading } = useQuery({
        queryKey: [Keys.PAYMENT_PAGE("TRANSACTION")],
        queryFn: () => connect.get("/scope/payment/transaction/all")
    })

    const [response, setResponse] = React.useState<PaymentApiResponse<TransactionGroupScopeResponse>[]>()

    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                if (data.data) {
                    if(Array.isArray(data.data)) {
                        setResponse(data.data.map(d => PaymentApiResponse.fromJson(d)))
                    }
                }
            } else {
                Notify.error(data.message);
            }
        }
    }, [ data ])

    async function onReload() {
        const data = await connect.get("/scope/payment/transaction/all")
        if (data) {
            if (data.isSuccess) {
                if (data.data) {
                    if(Array.isArray(data.data)) {
                        setResponse(data.data.map(d => PaymentApiResponse.fromJson(d)))
                    }
                }
            } else {
                Notify.error(data.message);
            }
        }
    }

    const buildView = () => {
        if(isLoading || !data || !response) {
            return (<TransactionLoadingView />)
        } else {
            return (<View response={response} onReload={onReload} />)
        }
    }

    return (
        <Column crossAxisSize="max" mainAxisSize="max" gap="5px" style={{padding: "8px"}}>
            {buildView()}
        </Column>
    )
})

interface ViewProps {
    response: PaymentApiResponse<TransactionGroupScopeResponse>[];
    onReload: () => void;
}

const View: React.FC<ViewProps> = observer(({ response, onReload }) => {
    const [data, setData] = React.useState<PaymentApiResponse<TransactionGroupScopeResponse>[]>(response)

    const [isExportingCSV, setIsExportingCSV] = React.useState<boolean>(false);
    const [isExportingJson, setIsExportingJson] = React.useState<boolean>(false);

    const name = "Serch | Transactions";
    const handleCsvExport = () => {
        if (isExportingCSV) return;

        setIsExportingCSV(true);
        Utils.exportToCsv(data, name)
        setIsExportingCSV(false);
    };

    const handleJsonExport = () => {
        if (isExportingJson) return;

        setIsExportingJson(true);
        Utils.exportToJson(data, name)
        setIsExportingJson(false);
    };

    const quickButtons = [
        {
            title: "Export",
            onClick: () => handleJsonExport(),
            icon: "carbon:json",
            loading: isExportingJson
        },
        {
            title: "Export",
            onClick: () => handleCsvExport(),
            icon: "hugeicons:csv-02",
            loading: isExportingCSV
        }
    ]

    const tabs = data.map(d => ({
        title: d.title,
        count: d.transactions.flatMap(i => i.transactions).length
    }))
    const { openTransactionTab, handleTransactionTab } = useRouteUpdate()

    React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("view");

        if(token && token !== "") {
            handleTransactionTab(token)
        }
    }, [location.search])

    const minSearchWidth = 105
    const [searchWidth, setSearchWidth] = React.useState<number>(minSearchWidth)
    const [isSearching, setIsSearching] = React.useState(false)
    const [page, setPage] = React.useState<number>(0)
    const [size, setSize] = React.useState<number>(20)

    const connect = new Connect({})
    async function handleSearch(query: string) {
        setIsSearching(true)
        const search = await connect.get(`/scope/payment/transaction/search?query=${query}&page=${page}&size=${size}`)

        setIsSearching(false)
        if (search) {
            if (search.isSuccess) {
                if (search.data) {
                    if(Array.isArray(search.data)) {
                        setData(search.data.map(d => PaymentApiResponse.fromJson(d)))
                    }
                }
            } else {
                setData(response)
                Notify.error(search.message);
            }
        }
    }

    const buildBody = () => {
        const pages: React.ReactNode[] = data.map(d => (
            <TransactionListView
                total={d.total}
                list={d.transactions}
                status={d.status}
                title={d.title}
                isSearching={isSearching}
                onReload={onReload}
            />
        ))
        return (pages[tabs.flatMap(d => d.title.toUpperCase()).indexOf(openTransactionTab.toUpperCase())])
    }

    return (
        <React.Fragment>
            <Container backgroundColor={AppTheme.appbar} padding="10px" borderRadius="12px">
                <Column crossAxisSize="max" gap="20px">
                    <Row mainAxisSize="max" style={{gap: "8px"}}>
                        <Text text="Transactions" size={20} weight="bold" color={AppTheme.primary} />
                        <Spacer />
                        {quickButtons.map((button, index) => {
                            return (
                                <Container
                                    key={index}
                                    padding="8px"
                                    backgroundColor="transparent"
                                    border={`1px solid ${AppTheme.hint}`}
                                    borderRadius="12px"
                                    onClick={() => button.onClick()}
                                    hoverBackgroundColor={AppTheme.secondary}
                                >
                                    <Row crossAxis="center" crossAxisSize="min" style={{gap: "4px"}}>
                                        <Icon icon={button.loading ? "line-md:downloading-loop" : button.icon} width="1.2em" height="1.2em" color={AppTheme.primary} />
                                        <Text text={button.title} color={AppTheme.primary} size={12} />
                                    </Row>
                                </Container>
                            )
                        })}
                    </Row>
                    <Row gap="10px">
                        <Row style={{ overflow: "scroll", width: "400px", backgroundColor: AppTheme.background, borderRadius: "16px", padding: "4px"}} mainAxisSize="min">
                            <Row crossAxisSize="max" crossAxis="center" style={{gap: "6px"}}>
                                {tabs.map((tab, index) => {
                                    const isSelected = tab.title.toUpperCase() === openTransactionTab.toUpperCase();

                                    return (
                                        <ActionButton
                                            key={index}
                                            padding="6px"
                                            borderRadius="16px"
                                            backgroundColor={isSelected ? AppTheme.primary : AppTheme.appbar}
                                            fontSize={12}
                                            hoverBackgroundColor={isSelected ? AppTheme.primary : undefined}
                                            hoverColor={isSelected ? AppTheme.secondary : undefined}
                                            color={isSelected ? AppTheme.secondary : AppTheme.hint}
                                            onClick={() => handleTransactionTab(tab.title)}
                                            title={tab.title}
                                        />
                                    )
                                })}
                            </Row>
                        </Row>
                        <Spacer />
                        <SearchBar
                            showLoading={isSearching}
                            onQuerySearch={handleSearch}
                            placeholder="Search wallets, names, user ids, etc..."
                            backgroundColor={AppTheme.background}
                            inputStyle={{fontSize: "12px", backgroundColor: "transparent", padding: "0 8px"}}
                            boxStyle={{borderRadius: "16px", height: "100%", padding: "0 8px"}}
                            textColor={AppTheme.primary}
                            textFocusedColor={AppTheme.hint}
                            textUnfocusedColor={AppTheme.background}
                            iconStyle={{height: "30px"}}
                            onFocused={value => value ? setSearchWidth(400) : setSearchWidth(minSearchWidth)}
                            parentStyle={{margin: "0", padding: "0", width: `${searchWidth}px`, height: "40px", transition: "all 0.3s"}}
                        />
                        {[
                            { title: "Current Page:", update: setPage, value: page },
                            { title: "Page size:", update: setSize, value: size }
                        ].map((item, index) => (
                            <Row mainAxisSize="min" gap="3px" key={index}>
                                <Text text={item.title} color={AppTheme.primary} />
                                <Field
                                    type="number"
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
                                    parentStyle={{width: "45px", height: "25px", margin: "0"}}
                                />
                            </Row>
                        ))}
                    </Row>
                </Column>
            </Container>
            {buildBody()}
        </React.Fragment>
    )
})