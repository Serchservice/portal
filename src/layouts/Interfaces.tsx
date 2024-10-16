export interface LeftProps {
    isMobile: boolean;
    isDesktop: boolean;
}

export interface IListView {
    header: string;
    description: string[];
    color: string;
    image?: string;
    position?: 'left' | 'right';
    link?: string;
    linkText?: string;
}

export interface IStep {
    image?: false | string;
    content: React.ReactNode;
}

export interface StarProps {
    rating: number;
    color?: string;
    size?: string;
    fullStarIcon?: string;
    halfStarIcon?: string;
    emptyStarIcon?: string;
}

export interface AccountStatuses {
    key: string;
    value: string;
    word: string;
}

export interface IconInfo {
    icon: string;
    color: string;
}