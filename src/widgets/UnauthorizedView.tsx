import { useDesign, Container, Column, SizedBox, Text, Image } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import Assets from "../assets/Assets";
import AppTheme from "../configuration/Theme";

interface ErrorViewProps {
    message?: string;
    title?: string;
    type?: "unauthorized" | "not-found"
}

const UnauthorizedView: React.FC<ErrorViewProps> = observer(({
    title = "Unauthorized access detected",
    type= "unauthorized",
    message = "You are not authorized to view this resource. Your permission might not include this resource. Contact support if this is an error"
}) => {
    const { isMobile } = useDesign();
    const image = type === "not-found" ? Assets.misc.warning : Assets.misc.auth;

    return (
        <Container height="100vh" width="100%" backgroundColor={AppTheme.secondary} padding="30px">
            <Column crossAxis="center" mainAxis="center" crossAxisSize="max" mainAxisSize="max">
                <Image image={image} height={isMobile ? 250 : 300} width={isMobile ? 250 : 300} />
                <SizedBox height={20} />
                <Text text={title} color={AppTheme.primary} size={isMobile ? 16 : 18} align="center" />
                <Text text={message} color={AppTheme.hint} align="center" />
            </Column>
        </Container>
    )
})

export default UnauthorizedView;