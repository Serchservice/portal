import { observer } from "mobx-react-lite";
import React from "react";
import preferenceStore from "../../../backend/database/device/PreferenceStore";
import { Column, Shimmer, Utility, Wrap } from "@serchservice/web-ui-kit";

export const ComplaintsListViewLoader: React.FC = observer(() => {
    const dimmed = preferenceStore.read.isDark;

    return (
        <React.Fragment>
            <Column crossAxisSize="max" style={{gap: "10px", padding: "12px"}}>
                <Shimmer height={40} radius={12} width="100%" dimmed={dimmed} />
                <Wrap spacing={10} runSpacing={10}>
                    {Utility.itemGenerate(4).map((_, index) => <Shimmer key={index} radius={6} dimmed={dimmed} height={36} width={60} />)}
                </Wrap>
            </Column>
            <Column crossAxisSize="max" style={{overflow: "scroll"}}>
                <Column style={{gap: "6px", padding: "6px"}}>
                    {Utility.itemGenerate(12).map((_, index) => <Shimmer key={index} radius={6} dimmed={dimmed} height={56} width="100%" />)}
                </Column>
            </Column>
        </React.Fragment>
    )
})