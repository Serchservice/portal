import { observer } from "mobx-react-lite"
import React from "react"
import Connect from "../../../backend/api/Connect"
import { useQuery } from "@tanstack/react-query"
import Keys from "../../../backend/api/Keys"
import Title from "../../../widgets/Title"
import { OrganizationResponse } from "../../../backend/models/team/OrganizationResponse"
import { Column, Container, ExtraButton, Image, Notify, Pager, Row, SearchBar, SizedBox, Spacer, Text, useDesign, Wrap } from "@serchservice/web-ui-kit"
import { RouteInterface } from "../../../configuration/Route"
import AppTheme from "../../../configuration/Theme"
import { Icon } from "@iconify/react/dist/iconify.js"
import { OrganizationLoadingView } from "./loader"
import CreateOrganization from "./modals/CreateOrganization"
import UpdateAndViewOrganization from "./modals/UpdateAndViewOrganization"
import useOrganizationUpdate from "../../../configuration/hooks/useOrganizationUpdate"

export default function OrganizationRoute(): RouteInterface {
    return {
        path: "/team/organization",
        page: (
            <React.Fragment>
                <Title title="Organization Overview" description="View and manage employee information" />
                <Layout />
            </React.Fragment>
        )
    }
}

const Layout: React.FC = observer(() => {
    const connect = new Connect({})

    const { data, isLoading } = useQuery({
        queryKey: [Keys.TEAM_PAGE("ORGANIZATION")],
        queryFn: () => connect.get("/organization/all")
    })

    const [list, setList] = React.useState<OrganizationResponse[]>()
    React.useEffect(() => {
        if (data) {
            if (data.isSuccess) {
                if(Array.isArray(data.data)) {
                    setList(data.data.map(d => OrganizationResponse.fromJson(d)))
                }
            } else {
                Notify.error(data.message);
            }
        }
    }, [ data ])

    const buildView = () => {
        if(isLoading || !data || !list) {
            return (<OrganizationLoadingView />)
        } else {
            return (<View list={list} onUpdated={setList} />)
        }
    }

    return (
        <Column crossAxisSize="max" mainAxisSize="max" gap="5px" style={{padding: "8px"}}>
            {buildView()}
        </Column>
    )
})

interface ViewProps {
    list: OrganizationResponse[];
    onUpdated: (data: OrganizationResponse[]) => void
}

const View: React.FC<ViewProps> = observer(({ list, onUpdated }) => {
    const minSearchWidth = 105
    const [searchWidth, setSearchWidth] = React.useState<number>(minSearchWidth)
    const {
        isCreateOrganizationOpen,
        handleCreateOrganization,
        openOrganization,
        handleOpenOrganization,
        handleCloseOrganization
    } = useOrganizationUpdate()
    const [filtered, setFiltered] = React.useState<OrganizationResponse[]>(list);
    const [paginated, setPaginated] = React.useState<OrganizationResponse[]>(list);

    React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const action = searchParams.get("action");
        const tag = searchParams.get("tag");

        if(action && action === 'create') {
            handleCreateOrganization(true)
        }

        if(tag && tag !== '') {
            const found = list.find(d => d.username === tag)
            if(found) {
                handleOpenOrganization(found)
            }
        }
    }, [location.search])

    const handleSearch = React.useCallback((results: OrganizationResponse[]) => {
        setFiltered(results);
    }, []);

    const buildResult = () => {
        if(paginated.length > 0) {
            return (
                <Column style={{overflow: "scroll"}}>
                    <Wrap spacing={20} runSpacing={20}>
                        {paginated.map((org, index) => <OrganizationView key={index} org={org} />)}
                    </Wrap>
                </Column>
            )
        } else {
            return (
                <Container height={300} width ="100%">
                    <Column mainAxisSize="max" crossAxisSize="max" mainAxis="center" crossAxis="center" style={{gap: "12px"}}>
                        <Icon icon="lets-icons:ticket-alt-duotone" width="5em" height="5em" color={AppTheme.primary} />
                        <Text text={`No organization members found`} color={AppTheme.hint} size={16} opacity={8} />
                    </Column>
                </Container>
            )
        }
    }

    return (
        <React.Fragment>
            <Container backgroundColor={AppTheme.appbar} padding="10px" borderRadius="12px">
                <Column crossAxisSize="max" gap="20px">
                    <Row mainAxisSize="max" style={{gap: "8px"}}>
                        <Text text="Organization" size={20} weight="bold" color={AppTheme.primary} />
                        <Spacer />
                        <ExtraButton
                            padding="6px 10px"
                            borderRadius="16px"
                            backgroundColor={AppTheme.background}
                            fontSize="12px"
                            color={AppTheme.primary}
                            iconSize={1}
                            onClick={() => handleCreateOrganization(true)}
                            hoverColor={AppTheme.hover}
                            iconStyle={{margin: "0 4px 0 0"}}
                            rootStyle={{width: "auto", minWidth: "auto"}}
                            icon="lets-icons:user-add-duotone"
                            title="Add new employee"
                        />
                    </Row>
                    <SearchBar
                        list={list}
                        onSearch={handleSearch}
                        placeholder="Search names, email addresses, usernames..."
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
                </Column>
            </Container>
            {buildResult()}
            <Pager items={filtered} onSlice={setPaginated} itemsPerPage={20} />
            <CreateOrganization
                isOpen={isCreateOrganizationOpen}
                handleClose={() => handleCreateOrganization(false)}
                onUpdated={onUpdated}
            />
            {openOrganization && (
                <UpdateAndViewOrganization
                    isOpen={openOrganization !== undefined}
                    handleClose={() => handleCloseOrganization()}
                    org={openOrganization}
                    onUpdated={onUpdated}
                />
            )}
        </React.Fragment>
    )
})

interface OrganizationViewProps {
    org: OrganizationResponse;
}

const OrganizationView: React.FC<OrganizationViewProps> = observer(({ org }) => {
    const [elevation, setElevation] = React.useState(0)
    const [isOpen, setIsOpen] = React.useState(false)
    const { width } = useDesign()
    const { handleOpenOrganization } = useOrganizationUpdate()

    React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const tag = searchParams.get("tag");

        if(tag && tag !== '') {
            setIsOpen(org.username === tag)
        } else {
            setIsOpen(false)
        }

    }, [location.search])

    return (
        <React.Fragment>
            <Container
                backgroundColor={isOpen ? AppTheme.hover : AppTheme.appbar}
                borderRadius="10px"
                padding="12px"
                width={width <= 800 ? "100%" : "220px"}
                elevation={elevation}
                onClick={() => handleOpenOrganization(org)}
                onHover={v => v ? setElevation(4) : setElevation(0)}
            >
                <Image image={org.avatar} height={120} width={120} style={{
                    borderRadius: "50%",
                    backgroundColor: AppTheme.appbarDark,
                    padding: "1px"
                }}/>
                <SizedBox height={10} />
                <Text text={org.name} flow="ellipsis" size={14} color={AppTheme.primary} />
                <SizedBox height={7} />
                <Text text={org.position} size={12} color={AppTheme.primary} />
                <SizedBox height={20} />
                <Text text={org.emailAddress} size={12} color={AppTheme.primary} flow="ellipsis" />
            </Container>
            {/* {openOrganization && (
                <UpdateAndViewOrganization
                    isOpen={openOrganization !== undefined}
                    handleClose={() => handleCloseOrganization()}
                    org={org}
                    onUpdated={onUpdated}
                />
            )} */}
        </React.Fragment>
    )
})