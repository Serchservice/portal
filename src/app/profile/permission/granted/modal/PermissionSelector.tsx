import { Column, SizedBox, Container, Text } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import AppTheme from "../../../../../configuration/Theme";
import { Permission } from "../../../../../utils/Enums";

interface PermissionSelectorProps {
    selected: Permission[] | undefined;
    onPermissionAdded: (permissions: Permission) => void;
}

const PermissionSelector: React.FC<PermissionSelectorProps> = observer(({selected, onPermissionAdded}) => {
    const options = [
        {
            description: "View the record/s attached to the permission scope you're demanding for.",
            permission: Permission.READ
        },
        {
            description: "Update and modify the record/s attached to the permission scope you're demanding for.",
            permission: Permission.UPDATE
        },
        {
            description: "Create record/s and attach them to the permission scope you're demanding for.",
            permission: Permission.WRITE
        },
        {
            description: "Delete and destroy the record/s attached to the permission scope you're demanding for.",
            permission: Permission.DELETE
        },
    ]

    return (
        <Column mainAxisSize="min" crossAxisSize="min" style={{margin: "0 12px 12px"}}>
            <Text text="Select the permissions you need" color={AppTheme.hint} />
            <SizedBox height={10} />
            {options.map((option, index) => {
                const isSelected = selected?.find((i) => i === option.permission);

                return (
                    <Container
                        key={index}
                        padding="10px"
                        borderRadius="6px"
                        margin={index !== options.length - 1 ? "0 0 10px 0" : ""}
                        onClick={() => onPermissionAdded(option.permission)}
                        backgroundColor={isSelected ? AppTheme.primary : AppTheme.primaryLight}
                    >
                        <Text text={option.permission} size={14} color={isSelected ? AppTheme.secondary : AppTheme.primary} />
                        <SizedBox height={10} />
                        <Text text={option.description} size={12} color={AppTheme.hint} />
                    </Container>
                )
            })}
        </Column>
    )
})

export default PermissionSelector