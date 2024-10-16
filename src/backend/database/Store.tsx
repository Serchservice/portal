interface Store<T> {
    set: (data: T) => void;
    clear: () => void;
    changeTheme?: () => void;
    logout?: () => void;
    toggleDrawer?: (value?: boolean) => void;
    toggleSidebar?: () => void;
}

export default Store;