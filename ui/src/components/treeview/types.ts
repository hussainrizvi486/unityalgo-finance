/* eslint-disable @typescript-eslint/no-explicit-any */

export interface TypeTreeNode {
    label: string;
    data?: Record<string, any>;
    description?: string;
    is_group?: boolean;
    children?: TypeTreeNode[];
}