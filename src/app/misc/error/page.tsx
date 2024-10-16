import React from "react"
import { RouteInterface } from "../../../configuration/Route"
import { observer } from "mobx-react-lite"
import { Column, Container, Image, SizedBox, Text, useDesign } from "@serchservice/web-ui-kit"
import AppTheme from "../../../configuration/Theme"
import Assets from "../../../assets/Assets"

export const ErrorRoute: RouteInterface = {
    path: "/misc/error",
    page: <ErrorPage />,
}

export default function ErrorPage() {
    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                overflow: "hidden",
                minHeight: '100vh',
                alignItems: 'center',
                flexDirection: 'column',
            }}
        >
            <View />
        </div>
    )
}

const View: React.FC = observer(() => {
    const { isMobile } = useDesign();

    return (
        <Container height="100vh" width="100%" backgroundColor={AppTheme.secondary} padding="30px">
            <Column crossAxis="center" mainAxis="center" crossAxisSize="max" mainAxisSize="max">
                <Image image={Assets.misc.error} height={isMobile ? 250 : 300} width={isMobile ? 250 : 300} />
                <SizedBox height={20} />
                <Text
                    text="Page not found"
                    color={AppTheme.primary}
                    size={isMobile ? 16 : 18}
                    align="center"
                />
                <Text
                    text="Might be an error from our own side, or you might have mistyped the link."
                    color={AppTheme.hint}
                    align="center"
                />
            </Column>
        </Container>
    )
})