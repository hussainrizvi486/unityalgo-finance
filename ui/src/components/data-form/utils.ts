import type { TypeDFLayout, TypeDFSection, TypeField, FieldValue } from "./types";

export const isEmpty = (value: FieldValue): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (typeof value === 'number') return false;
    if (typeof value === 'boolean') return false;
    if (Array.isArray(value)) return value.length === 0;
    return false;
}


const buildLayout = (fields: TypeField[]) => {
    const layout: TypeDFLayout = [];
    const sections: TypeDFSection[] = fields.filter(field => field.type === "section");

    if (!sections.length) {
        const section: TypeDFSection = { label: '' };
        const columns: TypeField[][] = [[]];
        let colIndex = 0;

        fields.forEach(field => {
            if (field.type === "column") {
                colIndex += 1;
                columns.push([]);
            }
            else {
                columns[colIndex].push(field);
            }
        })

        section.columns = columns;
        layout.push(section);
        return layout;
    }
    sections.forEach(section => {
        const startIndex = fields.findIndex(v => v.name === section.name);
        const columns: TypeField[][] = [[]];
        let colIndex = 0;

        for (let i = startIndex + 1; i < fields.length; i++) {
            const field = fields[i];
            if (field.type === "section") break;

            if (field.type === "column") {
                colIndex += 1;
                columns.push([]);
            } else {
                columns[colIndex].push(field);
            }
        }

        layout.push({
            columns: columns,
            label: section.label || "",
            name: section.name || "",
        });
    });

    return layout;
}


export { buildLayout };