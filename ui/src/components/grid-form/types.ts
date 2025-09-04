import type { DFContextValue } from "../data-form";
import type { FieldState, TypeOption } from "../data-form/types";
import type { TypeDFStore } from "../data-form/zustand-version";
import type { TypeGridFormStore } from "./zustand-grid-form";

export type FieldType =
    | "text"
    | "textarea"
    | "texteditor"
    | "number"
    | "decimal"
    | "float"
    | "currency"
    | "checkbox"
    | "file"
    | "date"
    | "autocomplete"
    | "select"
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
    file: File;
    date: Date;
    autocomplete: TypeOption;
    select: TypeOption;
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

    onChange?: (params: { grid: TypeGridFormStore; name: string; index: number, dataform: TypeDFStore }) => void;
    onBlur?: (params: { grid: TypeGridFormStore; name: string; index: number, dataform: TypeDFStore }) => void;

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



export interface TIFieldState extends FieldState { index: number }
export interface TFRowState {
    id: string;
    index: number;
    checked?: boolean;
    fields: { [key: string]: TIFieldState };
}

export type TableInputState = Array<TFRowState>;
export type TableInputValues = Array<Record<string, FieldValue>>;


export interface TIContextType {
    allRowsSelected?: boolean;
    fields: TypeField[];
    values: Record<string, FieldValue> | null;
    state: TableInputState;
    editingRow: string | null;
    setValue: (params: { name: string; value: FieldValue; id: string }) => void;
    addRow: () => void;
    deleteRow: (id?: string | string[]) => void;
    setEditingRow: (id?: string | null) => void;
    onChange?: () => void;
    setRowCheck: (id?: string, selectAll?: boolean) => void;
    getValues: () => TableInputValues;

}


export type TypeFieldValue = FieldValue;