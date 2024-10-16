import { Role } from "../../../utils/Enums";

export interface ICompanyStructureResponse {
    id: string;
    name: string;
    position: string;
    image: string;
    role: Role;
    children: CompanyStructureResponse[];

    addChild: (child: CompanyStructureResponse) => void;
}

export class CompanyStructureResponse implements ICompanyStructureResponse {
    id: string;
    name: string;
    position: string;
    image: string;
    role: Role;
    children: CompanyStructureResponse[];

    constructor({ id = '', name = '', position = '', image = '', role = Role.TEAM, children = [] }: Partial<ICompanyStructureResponse> = {}) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.image = image;
        this.role = role;
        this.children = children;
    }

    addChild(child: CompanyStructureResponse): void {
        this.children.push(child);
    }

    copyWith({ id, name, position, image, role, children }: Partial<ICompanyStructureResponse> = {}): CompanyStructureResponse {
        return new CompanyStructureResponse({
            id: id || this.id,
            name: name || this.name,
            position: position || this.position,
            image: image || this.image,
            role: role || this.role,
            children: children || this.children,
        });
    }

    static fromJson(json: any): CompanyStructureResponse {
        return new CompanyStructureResponse({
            id: json.id || '',
            name: json.name || '',
            position: json.position || '',
            image: json.image || '',
            role: json.role || Role.TEAM,
            children: json.children ? json.children.map((child: any) => CompanyStructureResponse.fromJson(child)) : [],
        });
    }

    toJson(): any {
        return {
            id: this.id,
            name: this.name,
            position: this.position,
            image: this.image,
            role: this.role,
            children: this.children.map(child => child.toJson()),
        };
    }

    /**
     * Finds the parent of a child by the child's ID.
     * @param childId The ID of the child whose parent is to be found.
     * @returns The parent `CompanyStructureResponse` or `null` if not found.
     */
    findParentByChildId(childId: string): CompanyStructureResponse | undefined {
        for (const child of this.children) {
            // If the child is found, return the current node as the parent
            if (child.id === childId) {
                return this;
            }

            // Recursively search in the child's children
            const parent = child.findParentByChildId(childId);
            if (parent) {
                return parent;
            }
        }

        // Return undefined if no parent is found
        return undefined;
    }

    /**
     * Finds the node by its ID and returns its direct children.
     * @param parentId The ID of the parent node.
     * @returns The direct children of the parent node or `undefined` if no parent is found.
     */
    findChildrenByParentId(parentId: string): CompanyStructureResponse[] | undefined {
        // If the current node matches the parentId, return its direct children
        if (this.id === parentId) {
            return this.children;
        }

        // Recursively search in the children for the parentId
        for (const child of this.children) {
            const foundChildren = child.findChildrenByParentId(parentId);
            if (foundChildren) {
                return foundChildren;
            }
        }

        // Return undefined if no matching parent is found
        return undefined;
    }
}