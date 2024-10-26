import { Column, Container, Row, Shimmer, SizedBox, Spacer, Utility, Wrap } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import preferenceStore from "../../../backend/database/device/PreferenceStore";
import AppTheme from "../../../configuration/Theme";

export const OrganizationLoadingView: React.FC = observer(() => {
    const dimmed = preferenceStore.read.isDark;

    return (
        <React.Fragment>
            <Container backgroundColor={AppTheme.appbar} padding="10px" borderRadius="12px">
                <Column crossAxisSize="max" gap="20px">
                    <Row mainAxisSize="max" style={{gap: "8px"}}>
                        <Shimmer height={20} width={300} dimmed={dimmed} radius={6} />
                        <Spacer />
                        <Shimmer dimmed={dimmed} height={50} width={150} radius={12} />
                    </Row>
                    <Shimmer height={40} width={100} dimmed={dimmed} radius={6} />
                </Column>
            </Container>
            <Wrap crossAxisAlignment="center" spacing={20} runSpacing={20}>
                {Utility.itemGenerate(4).map((_, index) => {
                    return (
                        <Container key={index} backgroundColor={AppTheme.appbar} borderRadius="10px" padding="12px">
                            <Shimmer height={90} width={90} type="circular" dimmed={dimmed} />
                            <SizedBox height={10} />
                            <Shimmer key={index} height={16} width={200} radius={6} dimmed={dimmed} />
                            <SizedBox height={7} />
                            <Shimmer key={index} height={10} width={110} radius={6} dimmed={dimmed} />
                            <SizedBox height={20} />
                            <Shimmer key={index} height={10} width={160} radius={6} dimmed={dimmed} />
                            <SizedBox height={7} />
                            <Shimmer key={index} height={10} width={140} radius={6} dimmed={dimmed} />
                            <SizedBox height={7} />
                            <Shimmer key={index} height={30} width={120} radius={10} dimmed={dimmed} />
                        </Container>
                    )
                })}
            </Wrap>
        </React.Fragment>
    )
})