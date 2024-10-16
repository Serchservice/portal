import { observer } from "mobx-react-lite";
import React from "react";
import preferenceStore from "../../backend/database/device/PreferenceStore";
import { Column, Container, Shimmer, SizedBox, Spacer, Utility, Wrap } from "@serchservice/web-ui-kit";
import AppTheme from "../../configuration/Theme";

export const TeamHeaderLoader: React.FC = observer(() => {
    const dimmed = preferenceStore.read.isDark;

    return (
        <React.Fragment>
            <Column crossAxis="flex-start" crossAxisSize="min">
                <Shimmer height={15} width={100} radius={5} dimmed={dimmed} />
                <SizedBox height={10} />
                <Shimmer height={30} width={130} radius={5} dimmed={dimmed} />
            </Column>
            <SizedBox width={30} />
            <Column crossAxis="flex-start" crossAxisSize="min">
                <Shimmer height={15} width={140} radius={5} dimmed={dimmed} />
                <SizedBox height={10} />
                <Shimmer height={30} width={60} radius={5} dimmed={dimmed} />
            </Column>
            <Spacer />
            <Shimmer height={30} width={130} radius={12} dimmed={dimmed} />
            <SizedBox width={30} />
            <Shimmer height={30} width={100} radius={12} dimmed={dimmed} />
        </React.Fragment>
    )
})

export const TeamMetricLoader: React.FC = observer(() => {
    const dimmed = preferenceStore.read.isDark;

    return (
        <React.Fragment>
            <Shimmer height={15} width={200} radius={5} dimmed={dimmed} />
            <SizedBox height={20} />
            <Column mainAxisSize="max" crossAxis="flex-start">
                <Wrap runSpacing={10} spacing={10}>
                    {Utility.itemGenerate(3).map((_, index) => {
                        return (
                            <Column key={index} crossAxis="flex-start" crossAxisSize="min">
                                <Shimmer height={30} width={30} radius={5} dimmed={dimmed} />
                                <SizedBox height={10} />
                                <Shimmer height={30} width={60} radius={5} dimmed={dimmed} />
                                <SizedBox height={10} />
                                <Shimmer height={15} width={100} radius={5} dimmed={dimmed} />
                            </Column>
                        )
                    })}
                </Wrap>
                <SizedBox height={10} />
                <Wrap runSpacing={10} spacing={10}>
                    {Utility.itemGenerate(4).map((_, index) => {
                        return (
                            <Column key={index} crossAxis="flex-start" crossAxisSize="min">
                                <Shimmer height={30} width={30} radius={5} dimmed={dimmed} />
                                <SizedBox height={10} />
                                <Shimmer height={30} width={60} radius={5} dimmed={dimmed} />
                                <SizedBox height={10} />
                                <Shimmer height={15} width={100} radius={5} dimmed={dimmed} />
                            </Column>
                        )
                    })}
                </Wrap>
            </Column>
        </React.Fragment>
    )
})

export const TeamListLoader: React.FC = observer(() => {
    const dimmed = preferenceStore.read.isDark;

    return (
        <React.Fragment>
            <Wrap crossAxisAlignment="center" spacing={20} runSpacing={10}>
                {Utility.itemGenerate(4).map((_, index) => <Shimmer key={index} height={35} width={100} radius={10} dimmed={dimmed} />)}
            </Wrap>
            <SizedBox height={10} />
            <Container height={1} width="100%" backgroundColor={AppTheme.hint} borderRadius="3px" />
            <SizedBox height={10} />
            <Shimmer height={40} width="100%" radius={10} dimmed={dimmed} />
            <SizedBox height={30} />
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

export const TeamActivitiesLoader: React.FC = observer(() => {
    const dimmed = preferenceStore.read.isDark;

    return (
        <React.Fragment>
            <Container width="100%" backgroundColor={AppTheme.primaryLight} borderRadius="10px" padding="12px">
                <Shimmer height={20} width="70%" radius={10} dimmed={dimmed} />
                <SizedBox height={10} />
                <Container height={1} width="100%" backgroundColor={AppTheme.hint} borderRadius="3px" />
                <SizedBox height={10} />
                <Wrap runSpacing={10}>
                    {Utility.itemGenerate(7).map((_, index) =>
                        <Shimmer key={index} height={60} width="100%" radius={10} dimmed={dimmed} />
                    )}
                </Wrap>
            </Container>
        </React.Fragment>
    )
})