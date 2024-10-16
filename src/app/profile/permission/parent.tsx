import { useDesign, Column, SizedBox, Image, Text } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import Assets from "../../../assets/Assets";
import AppTheme from "../../../configuration/Theme";

export const PermissionView: React.FC = observer(() => {
    const { isMobile } = useDesign();

    return (
        <Column crossAxisSize="max" mainAxisSize="max">
            <Column crossAxis="center" mainAxis="center" crossAxisSize="max" mainAxisSize="max">
                <Image image={Assets.auth.permission} height={isMobile ? 150 : 180} width={isMobile ? 150 : 180} />
                <SizedBox height={20} />
                <Text
                    text="Welcome to permissions!"
                    color={AppTheme.primary}
                    size={isMobile ? 16 : 18}
                    align="center"
                />
                <SizedBox height={10} />
                <Text
                    text="Use any of the left navigation buttons to see the things you are permitted to do in the Serchservice portal."
                    color={AppTheme.hint}
                    align="center"
                />
            </Column>
        </Column>
    )
})