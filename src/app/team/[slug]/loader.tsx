import { Column, Container, Row, Shimmer, SizedBox, Spacer, Utility, Wrap } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import preferenceStore from "../../../backend/database/device/PreferenceStore";
import AppTheme from "../../../configuration/Theme";

interface LoadingHeaderViewProps {
    scrollPosition: number;
}

export const AdminLoadingHeaderView: React.FC<LoadingHeaderViewProps> = observer(({ scrollPosition }) => {
    const dimmed = preferenceStore.read.isDark
    const scroll = Math.min(scrollPosition / 100, 10);
    const scrollRange = 3;

    const shouldResize = scrollRange === scroll || scroll >= 2;
    const calc = (max: number, min: number) => Math.max(min, max - (scroll * (max - min)) / scrollRange);

    return (
        <React.Fragment>
            <Container
                backgroundColor={AppTheme.appbar}
                style={{ transition: "all 1s" }}
                padding={`${calc(16, 8)}px`}
                width="100%"
                borderRadius={`${calc(12, 4)}px`}
            >
                <Row mainAxisSize="max" crossAxis="center" gap="10px">
                    <Shimmer height={calc(90, 55)} width={calc(90, 55)} radius={4} type="circular" dimmed={dimmed} />
                    <Column mainAxisSize="max" crossAxis="flex-start">
                        <Row crossAxis="center" mainAxisSize="max" mainAxis="space-between">
                            <Shimmer height={calc(16, 14)} width={calc(200, 150)} radius={4} dimmed={dimmed} />
                            <Spacer />
                            <Shimmer height={calc(10, 10)} radius={4} width={calc(100, 80)} dimmed={dimmed} />
                        </Row>
                        <SizedBox height={4} />
                        <Row crossAxis="center" mainAxisSize="max" mainAxis="space-between">
                            {!shouldResize && (<Shimmer height={calc(14, 11)} radius={4} width={calc(120, 100)} dimmed={dimmed} />)}
                            {shouldResize && (<Shimmer height={calc(12, 10)} radius={4} width={calc(100, 160)} dimmed={dimmed} />)}
                            <Spacer />
                            {shouldResize && (<Shimmer height={20} radius={4} type="circular" width={20} dimmed={dimmed} />)}
                            {!shouldResize && (<Shimmer height={calc(12, 10)} radius={4} width={calc(100, 160)} dimmed={dimmed} />)}
                        </Row>
                        <SizedBox height={2} />
                        {!shouldResize && (<Shimmer height={calc(11, 10)} radius={4} width={calc(100, 100)} dimmed={dimmed} />)}
                    </Column>
                </Row>
                {(!shouldResize) && (<SizedBox height={10} />)}
                {(!shouldResize) && (
                    <Wrap spacing={10} runSpacing={10}>
                        {Utility.itemGenerate(4).map((_, index) => <Shimmer key={index} height={40} radius={12} width={100} dimmed={dimmed} />)}
                    </Wrap>
                )}
            </Container>
            <Row crossAxisSize="max" crossAxis="center">
                <Row style={{ overflow: "scroll", width: "660px", backgroundColor: AppTheme.appbar, borderRadius: "16px", padding: "4px"}} mainAxisSize="min">
                    <Row crossAxisSize="max" crossAxis="center" style={{gap: "6px"}}>
                        {Utility.itemGenerate(6).map((_, index) => <Shimmer key={index} height={40} radius={12} width={100} dimmed={dimmed} />)}
                    </Row>
                </Row>
                <Spacer />
                <Shimmer height={40} radius={12} width={100} dimmed={dimmed} />
            </Row>
        </React.Fragment>
    )
})

export const AdminLoadingBodyView: React.FC = observer(() => {
    const dimmed = preferenceStore.read.isDark

    return (
        <React.Fragment>
            <Container backgroundColor={AppTheme.appbar} padding="16px" width="100%" borderRadius="8px" height="auto">
                <Row crossAxis="flex-start" mainAxisSize="max">
                    <Column crossAxis="flex-start" mainAxisSize="min">
                        <Shimmer height={14} width={200} radius={6} dimmed={dimmed} />
                        <SizedBox height={3} />
                        <Shimmer height={12} width={100} radius={6} dimmed={dimmed} />
                    </Column>
                    <Spacer />
                    <Shimmer height={30} width={100} radius={6} dimmed={dimmed} />
                </Row>
                <SizedBox height={20} />
                <Wrap spacing={10} runSpacing={10}>
                    {Utility.itemGenerate(6).map((_, index) => <Shimmer key={index} radius={6} dimmed={dimmed} height={26} width={100} />)}
                </Wrap>
                <SizedBox height={20} />
                <Row crossAxis="center" mainAxis="center">
                    <Wrap crossAxisAlignment="center" spacing={40}>
                        {Utility.itemGenerate(6).map((_, index) => <Shimmer key={index} radius={6} dimmed={dimmed} height={100} width={100} />)}
                    </Wrap>
                </Row>
            </Container>
            <SizedBox height={20} />
            <Container backgroundColor={AppTheme.appbar} padding="16px" width="100%" borderRadius="8px" height="auto">
                <Row crossAxis="flex-start" mainAxisSize="max">
                    <Column crossAxis="flex-start" mainAxisSize="min">
                        <Shimmer height={14} width={200} radius={6} dimmed={dimmed} />
                        <SizedBox height={3} />
                        <Shimmer height={12} width={100} radius={6} dimmed={dimmed} />
                    </Column>
                    <Spacer />
                    <Shimmer height={30} width={100} radius={6} dimmed={dimmed} />
                </Row>
                <SizedBox height={20} />
                <Wrap spacing={10} runSpacing={10}>
                    {Utility.itemGenerate(6).map((_, index) => <Shimmer key={index} radius={6} dimmed={dimmed} height={26} width={100} />)}
                </Wrap>
                <SizedBox height={20} />
                <Shimmer height={500} width="100%" radius={6} dimmed={dimmed} />
            </Container>
        </React.Fragment>
    )
})