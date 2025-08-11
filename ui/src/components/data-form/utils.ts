import type { TypeDFLayout, TypeDFSection, TypeField } from "./types";

const buildLayout = (fields: TypeField[]) => {
    const layout: TypeDFLayout = [];
    const sections: TypeDFSection[] = fields.filter(field => field.sectionBreak)

    if (!sections.length) {
        const section: TypeDFSection = { label: '' };
        const columns: TypeField[][] = [[]];
        let colIndex = 0;

        fields.forEach(field => {
            if (field.columnBreak) {
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
            if (field.sectionBreak) break;

            if (field.columnBreak === true) {
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