import { Column, Container, DrawerDialog, ModalProps, SizedBox, Structure, Text, TreeStructure } from "@serchservice/web-ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";
import authStore from "../../../backend/database/auth/AuthStore";
import { CompanyStructureResponse } from "../../../backend/models/team/CompanyStructureResponse";
import { RouteConfig } from "../../../configuration/Route";
import AppTheme from "../../../configuration/Theme";
import { Role } from "../../../utils/Enums";
import AdminRoute from "../[slug]/page";

interface CompanyStructureModalProps extends ModalProps {
    structure: CompanyStructureResponse;
    title?: string;
    id?: string;
    show?: boolean;
}

const CompanyStructureModal: React.FC<CompanyStructureModalProps> = observer(({
    isOpen,
    handleClose,
    structure,
    title,
    id,
    show = true
}) => {
    const response = new TreeStructure({
        id: structure.id,
        link: getLink(structure.role, structure.id),
        name: structure.name,
        position: structure.position,
        role: structure.role,
        image: structure.image,
        children: structure.children?.map((child) => buildTreeStructure(child))
    });

    function buildTreeStructure(child: CompanyStructureResponse): TreeStructure {
        return new TreeStructure({
            id: child.id,
            link: getLink(child.role, child.id),
            name: child.name,
            position: child.position,
            role: child.role,
            image: child.image,
            children: child.children?.map(buildTreeStructure)
        });
    }

    function getLink(role: Role, id: string): string | undefined {
        if((role === Role.SUPER || role === Role.ADMIN) && authStore.read.isSuper) {
            return RouteConfig.getRoute(AdminRoute(), {slug: id})
        } else if(role === Role.MANAGER && (authStore.read.isSuper || authStore.read.isAdmin)) {
            return RouteConfig.getRoute(AdminRoute(), {slug: id})
        } else if(role === Role.TEAM && (authStore.read.isSuper || authStore.read.isAdmin || authStore.read.isManager)) {
            return RouteConfig.getRoute(AdminRoute(), {slug: id})
        }
    }

    return (
        <DrawerDialog isOpen={isOpen} handleClose={handleClose} position="bottom" bgColor={AppTheme.appbar} width={450}>
            <Column>
                <Container padding="18px" backgroundColor={AppTheme.background}>
                    <Text text={title ?? "Company Structure (Within the Serchservice Portal)"} color={AppTheme.primary} size={16} />
                </Container>
                <SizedBox height={30} />
                <Structure
                    structure={response}
                    backgroundColor={AppTheme.secondary}
                    color={AppTheme.primary}
                    selectedId={id ?? authStore.read.id}
                    selectedBg={AppTheme.primary}
                    selectedColor={AppTheme.secondary}
                    childButtonHoverColor={AppTheme.hover}
                    childButtonColor="#095167"
                    showSelected={show}
                    childButtonIcon="duo-icons:id-card"
                />
                <SizedBox height={30} />
            </Column>
        </DrawerDialog>
    )
})

export default CompanyStructureModal