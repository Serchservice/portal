import { Icon } from "@iconify/react/dist/iconify.js";
import { observer } from "mobx-react-lite";
import React from "react";
import AppTheme from "../configuration/Theme";

interface MetricProps {
    value: string;
    title?: string;
    icon?: string;
    iconColor?: string;
    color?: string;
    backgroundColor?: string;
    isFlag?: boolean;
    image?: string;
    valueStyle?: React.CSSProperties;
    titleStyle?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    custom?: React.ReactNode;
}

export const Metric: React.FC<MetricProps> = observer(({
    value = "0",
    title,
    icon = '',
    iconColor = "",
    color = "",
    backgroundColor = "",
    isFlag = false,
    image,
    valueStyle,
    titleStyle,
    containerStyle,
    custom
}) => {
    const bodyStyle: React.CSSProperties = {
        gap: '8px',
        flex: '0 0 auto',
        width: '170px',
        height: 'auto',
        display: 'flex',
        padding: '12px',
        alignItems: 'flex-start',
        borderRadius: '6px',
        flexDirection: 'column',
    };

    const fontStyle: React.CSSProperties = {
        fontSize: '28px',
        fontStyle: 'normal',
        fontWeight: 600,
    };

    const renderFeature = (): JSX.Element | undefined => {
        if(image) {
            return <img src={image} width={25} height={25} alt='feature' />
        } else if(isFlag && icon) {
            return <span>{icon}</span>
        } else if(icon) {
            return (
                <Icon
                    icon={icon}
                    width="1.2em"
                    height="1.2em"
                    style={{ color: iconColor ? iconColor : color ? color : AppTheme.primary }}
                />
            )
        }
    }

    return (
        <div style={{ ...bodyStyle, backgroundColor: backgroundColor ? backgroundColor : AppTheme.appbar, ...containerStyle }}>
            <span style={{ ...fontStyle, color: color ? color : AppTheme.primary, ...valueStyle }}>{value}</span>
            {renderFeature()}
            {title && <span style={{ color: color ? color : AppTheme.primary, ...titleStyle }}>{title}</span>}
            {custom}
        </div>
    );
});