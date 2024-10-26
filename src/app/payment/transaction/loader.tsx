import { Column, Container, Row, Shimmer, Spacer, Utility, Wrap } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import preferenceStore from "../../../backend/database/device/PreferenceStore";
import AppTheme from "../../../configuration/Theme";

export const TransactionLoadingView: React.FC = observer(() => {
    const dimmed = preferenceStore.read.isDark;

    return (
        <React.Fragment>
            <Container backgroundColor={AppTheme.appbar} padding="10px" borderRadius="12px">
                <Column crossAxisSize="max" gap="20px">
                    <Row mainAxisSize="max" style={{gap: "8px"}}>
                        <Shimmer height={20} width={300} dimmed={dimmed} radius={6} />
                        <Spacer />
                        {Utility.itemGenerate(2).map((_, i) => <Shimmer key={i} dimmed={dimmed} height={50} width={150} radius={12} />)}
                    </Row>
                    <Row>
                        <Row style={{ overflow: "scroll", width: "400px", backgroundColor: AppTheme.background, borderRadius: "16px", padding: "4px"}} mainAxisSize="min">
                            <Row crossAxisSize="max" crossAxis="center" style={{gap: "6px"}}>
                                {Utility.itemGenerate(3).map((_, i) => <Shimmer key={i} dimmed={dimmed} height={40} width={100} radius={16} />)}
                            </Row>
                        </Row>
                        <Spacer />
                        <Shimmer height={40} width={100} dimmed={dimmed} radius={6} />
                    </Row>
                </Column>
            </Container>
            <Container backgroundColor={AppTheme.appbar} padding="8px" borderRadius="10px">
                <Row mainAxisSize="max">
                    <Shimmer height={40} width={105} dimmed={dimmed} radius={16} />
                    <Spacer />
                    <Wrap spacing={10} runSpacing={10}>
                        {Utility.itemGenerate(5).map((_, i) => <Shimmer key={i} dimmed={dimmed} height={40} width={80} radius={12} />)}
                    </Wrap>
                </Row>
            </Container>
            <Container backgroundColor={AppTheme.appbar} padding="8px" borderRadius="10px" height="100%" style={{overflow: "hidden"}}>
                <Column style={{overflow: "scroll"}} mainAxisSize="max">
                    <Column gap="12px">
                        {Utility.itemGenerate(5).map((_, i) => {
                            return (
                                <React.Fragment key={i}>
                                    <Shimmer dimmed={dimmed} height={15} width={80} radius={8} />
                                    {Utility.itemGenerate(5).map((_, a) => <Shimmer key={a} dimmed={dimmed} height={60} width="100%" radius={12} />)}
                                </React.Fragment>
                            )
                        })}
                    </Column>
                </Column>
            </Container>
        </React.Fragment>
    )
})