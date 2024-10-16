import { Column, Row, Shimmer, SizedBox, useDesign, Utility, Wrap } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import preferenceStore from "../../backend/database/device/PreferenceStore";
import AppTheme from "../../configuration/Theme";

const ProfilePageLoader: React.FC = observer(() => {
    return (
        <React.Fragment>
            <LeftView />
            <RightView />
        </React.Fragment>
    )
})

const LeftView: React.FC = observer(() => {
    const dimmed = preferenceStore.read.isDark

    return (
        <Column mainAxisSize="max" crossAxisSize="max" style={{padding: "24px", maxWidth: "450px", overflow: "scroll"}}>
            <Column>
                <Shimmer width="120px" height="120px" radius={50} type="circular" dimmed={dimmed} />
                <SizedBox height={15} />
                <Shimmer width="300px" height="20px" radius={6} dimmed={dimmed} />
                <SizedBox height={4} />
                <Shimmer width="200px" height="14px" radius={6} dimmed={dimmed} />
                <SizedBox height={4} />
                <Row crossAxis="center">
                    <Shimmer width="250px" height="25px" radius={6} dimmed={dimmed} />
                    <SizedBox width={30} />
                    <Shimmer width="50px" height="25px" radius={50} dimmed={dimmed} />
                </Row>
                <SizedBox height={50} />
                <Shimmer width="350px" height="250px" radius={12} dimmed={dimmed} />
                <SizedBox height={50} />
                <Shimmer width="180px" height="38px" radius={50} dimmed={dimmed} />
                <SizedBox height={10} />
                <Shimmer width="180px" height="38px" radius={50} dimmed={dimmed} />
            </Column>
        </Column>
    )
})

const RightView: React.FC = observer(() => {
    const { width } = useDesign()

    const dimmed = preferenceStore.read.isDark

    return (
        <Column mainAxisSize="max" crossAxisSize="max" style={{padding: "24px", overflow: "scroll"}}>
            <Column mainAxisSize="min" crossAxisSize="max" style={{border: `2px solid ${AppTheme.appbar}`, padding: "10px", borderRadius: "12px"}}>
                <Shimmer width="180px" height="20px" radius={6} dimmed={dimmed} />
                <SizedBox height={30} />
                <Wrap runSpacing={20} spacing={20}>
                    {Utility.itemGenerate(6).map((_, index) => {
                        return (<Shimmer key={index} width={width <= 1080 ? "100%" : "48.4%"} height="40px" dimmed={dimmed} />)
                    })}
                </Wrap>
                <SizedBox height={50} />
                <Shimmer width="100%" height="38px" radius={50} dimmed={dimmed} />
            </Column>
            <Column mainAxisSize="min" crossAxisSize="max" style={{marginTop: "60px", border: `2px solid ${AppTheme.appbar}`, padding: "10px", borderRadius: "12px"}}>
                <Shimmer width="180px" height="20px" radius={6} dimmed={dimmed} />
                <SizedBox height={30} />
                <Wrap runSpacing={20} spacing={20}>
                    {Utility.itemGenerate(6).map((_, index) => {
                        return (<Shimmer key={index} width={width <= 1080 ? "100%" : "48.4%"} height="40px" dimmed={dimmed} />)
                    })}
                </Wrap>
            </Column>
        </Column>
    )
})

export default ProfilePageLoader