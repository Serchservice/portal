import React from "react"
import preferenceStore from "../../backend/database/device/PreferenceStore"
import { observer } from "mobx-react-lite"
import { Wrap, Utility, Shimmer, SizedBox, Row, Spacer, Column } from "@serchservice/web-ui-kit";

export const SupportMetricLoader = observer(() => {
    const dimmed = preferenceStore.read.isDark;

    return (
        <React.Fragment>
            <Shimmer height={20} width={300} radius={6} dimmed={dimmed} />
            <SizedBox height={10} />
            <Wrap runSpacing={10} spacing={10}>
                {Utility.itemGenerate(6).map((_, index) => {
                    return (<Shimmer key={index} height={90} width={120} radius={12} dimmed={dimmed} />)
                })}
            </Wrap>
        </React.Fragment>
    )
})

export const SupportChartLoader = observer(() => {
    const dimmed = preferenceStore.read.isDark;

    return (
        <React.Fragment>
            <Row crossAxis="center">
                <Column crossAxis="flex-start" mainAxisSize="min">
                    <Shimmer height={20} width={180} radius={6} dimmed={dimmed} />
                    <SizedBox height={3} />
                    <Shimmer height={20} width={250} radius={6} dimmed={dimmed} />
                </Column>
                <Spacer />
                <Shimmer height={20} width={70} radius={6} dimmed={dimmed} />
            </Row>
            <SizedBox height={10} />
            <Wrap runSpacing={10} spacing={10}>
                {Utility.itemGenerate(6).map((_, index) => {
                    return (
                        <Row mainAxisSize="min" crossAxis="center" key={index}>
                            <Shimmer height={15} width={15} radius={4} dimmed={dimmed} />
                            <SizedBox width={5} />
                            <Shimmer height={15} width={100} radius={4} dimmed={dimmed} />
                        </Row>
                    )
                })}
            </Wrap>
            <SizedBox height={50} />
            <Row mainAxis="center" crossAxis="center"><Shimmer height={300} width={300} type="circular" dimmed={dimmed} /></Row>
        </React.Fragment>
    )
})