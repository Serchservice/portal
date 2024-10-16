import { Icon } from "@iconify/react/dist/iconify.js";
import { Column, SizedBox, Container, Row, Spacer, StyledMenu, Text } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import AppTheme from "../../../../../configuration/Theme";
import { PermissionType } from "../../../../../utils/Enums";

interface PermissionTypeSelectorProps {
    selected: PermissionType | undefined;
    onSelected: (type: PermissionType) => void;
}

const PermissionTypeSelector: React.FC<PermissionTypeSelectorProps> = observer(({selected, onSelected}) => {
    const [anchor, setAnchor] = React.useState<HTMLButtonElement | null>(null);

    const close = () => {
        setAnchor(null);
    };

    const icon = (type: PermissionType) => type === PermissionType.CLUSTER ? "duo-icons:chip" : "duo-icons:book-2"

    const options = Object.values(PermissionType).map((type) => {
        return {
            type: type,
            icon: icon(type)
        }
    })

    const [calculatedWidth, setCalculatedWidth] = React.useState(50);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (contentRef.current) {
            const { width } = contentRef.current.getBoundingClientRect();
            setCalculatedWidth(width);
        }
    }, []);

    return (
        <Column mainAxisSize="min" crossAxisSize="min" style={{margin: "0 12px 12px"}}>
            <Text text="Select permission type" color={AppTheme.hint} />
            <SizedBox height={10} />
            <div ref={contentRef}>
                <Container
                    border={`1px solid ${AppTheme.hint}`}
                    borderRadius="8px"
                    padding="12px 10px"
                    width="100%"
                    renderAsButton
                    onClick={event => setAnchor(event.currentTarget as HTMLButtonElement)}
                >
                    <Row mainAxisSize="max" crossAxisSize="min" mainAxis="flex-start">
                        {selected && (
                            <Row mainAxisSize="max" crossAxisSize="max" mainAxis="flex-start">
                                <Icon
                                    icon={icon(selected)}
                                    color={AppTheme.hint}
                                    width="1.3em"
                                    style={{margin: "0 6px 0 0"}}
                                />
                                <SizedBox width={10} />
                                <Text text={selected.toString()} color={AppTheme.hint} />
                            </Row>
                        )}
                        {!selected && (<Spacer />)}
                        <SizedBox width={10} />
                        <Icon
                            icon="ep:arrow-right"
                            color={AppTheme.hint}
                            width="1.3em"
                            style={{
                                margin: "0",
                                transform: anchor ? 'rotate(-90deg)' : 'rotate(90deg)',
                                transition: "all 0.5s"
                            }}
                        />
                    </Row>
                </Container>
            </div>
            <StyledMenu anchorEl={anchor} isOpen={Boolean(anchor)} onClose={close} backgroundColor={AppTheme.appbar}>
                {options.map((option, index) => {
                    const isCurrent = selected === option.type;

                    return (
                        <Container
                            key={index}
                            padding="10px"
                            width={calculatedWidth}
                            style={{ borderBottom: options.length - 1 !== index ? `1px solid ${AppTheme.hint}` : "" }}
                            backgroundColor={isCurrent ? AppTheme.primary : "transparent"}
                            onClick={() => {
                                close();
                                onSelected(option.type)
                            }}
                            hoverBackgroundColor={isCurrent ? AppTheme.primary : AppTheme.hover}
                        >
                            <Row mainAxisSize="max" crossAxisSize="max" mainAxis="flex-start">
                                <Icon
                                    icon={option.icon}
                                    color={AppTheme.hint}
                                    width="1.3em"
                                    style={{margin: "0 6px 0 0"}}
                                />
                                <SizedBox width={10} />
                                <Text text={option.type.toString()} color={AppTheme.hint} />
                            </Row>
                        </Container>
                    )
                })}
            </StyledMenu>
        </Column>
    )
})

export default PermissionTypeSelector