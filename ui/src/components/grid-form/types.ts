import type { TypeOption, DFContextValue } from "../data-form/types";

export type FieldType =
    | "text"
    | "textarea"
    | "texteditor"
    | "number"
    | "decimal"
    | "float"
    | "currency"
    | "checkbox"
    | "boolean"
    | "file"
    | "date"
    | "autocomplete"
    | "select"
    | "multiselect"
    | "section"
    | "column";

export type FieldTypeMap = {
    text: string;
    number: number;
    decimal: number;
    checkbox: boolean;
    float: number;
    currency: number;
    textarea: string;
    texteditor: string;
    boolean: boolean;
    file: File;
    date: Date;
    autocomplete: TypeOption;
    select: TypeOption;
    multiselect: TypeOption[][];

    section: never;
    column: never;
};

export type FieldValue<T extends FieldType = FieldType> = FieldTypeMap[T] | null | undefined;
export interface TypeField<T extends FieldType = FieldType> {
    name: string;
    label: string;
    type: FieldType;
    width?: number;

    required?: boolean;
    defaultValue?: FieldValue<T>;

    options?: TypeOption[];
    placeholder?: string;

    sectionBreak?: boolean;
    columnBreak?: boolean;

    readOnly?: boolean
    hidden?: boolean

    onChange?: (params: { grid: GridFormContextType; name: string; index: number, dataform: DFContextValue }) => void;
    onBlur?: (params: { grid: GridFormContextType; name: string; index: number }) => void;

    getOptions?: (query?: string) => Promise<TypeOption[]>;

    requiredOn?: (values: Record<string, FieldValue>) => boolean;
    readOnlyOn?: (values: Record<string, FieldValue>) => boolean;
    dependsOn?: (values: Record<string, FieldValue>) => boolean;

}


export type GridFormValues = {
    [key: string]: FieldValue;
}

export interface GridFormRowState {
    id: string;
    index: number;
    checked: boolean;
    values: GridFormValues;
    errors: Record<string, string>;
    fields: {
        [key: string]: {
            hasError: boolean;
            error: string;
            value: FieldValue;
            field: TypeField;
        }
    };
}
export type GridFormState = Array<GridFormRowState>;

export interface GridFormContextType {
    fields: TypeField[];
    state: GridFormState;
    allRowsSelected: boolean;
    getValues: () => Array<GridFormValues>;
    setValue: (params: { name: string; value: FieldValue; id?: string }) => void;
    addRow: (values?: Record<string, FieldValue>) => void;
    removeRow: (id?: string | string[]) => void;
    selectRow: (params: { id?: string | string[], selectAll?: boolean }) => void;
    dataform: DFContextValue;
    onChange?: () => void;
    expandedRow?: GridFormRowState | null;
    setExpandedRow: (id?: GridFormRowState | null) => void;
    // setError: (params: { id: string, name: string, message: string }) => void;
}


export type TypeFieldValue = FieldValue;