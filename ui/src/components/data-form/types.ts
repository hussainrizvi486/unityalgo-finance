import type { TypeField as TypeSubField } from "../table-input/types";

export type TypeOption = { label: string; value: string; };
export type FieldType = "text"
    | "textarea"
    | "texteditor"
    | "number"
    | "decimal"
    | "currency"
    | "date"
    | "file"
    | "select"
    | "checkbox"
    // | "table"
    | "autocomplete"
    | "section"
    | "column"


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

export interface TypeField<T = FieldType> {
    label: string;
    name: string;
    placeholder?: string;
    type: T;
    required?: boolean;
    readOnly?: boolean;
    hidden?: boolean;
    defaultValue?: FieldValue;
    options?: TypeOption[];
    fields?: Array<TypeSubField>;

    sectionBreak?: boolean;
    columnBreak?: boolean;

    onChange?: (form: TypeDFContext) => void;
    onBlur?: (form: TypeDFContext) => void;
    getOptions?: (value?: string) => Promise<TypeOption[]>;
    renderOption?: () => React.ReactNode;

    dependsOn?: (values: DFValues) => boolean;
    requiredOn?: (values: DFValues) => boolean;
    readOnlyOn?: (values: DFValues) => boolean;
}



export type DFValues = {
    [key: string]: FieldValue;
}

type TypeFieldState = {
    hasError: boolean;
    error: string;
    value: FieldValue;
    field: TypeField;
}

export type TypeDFState = Record<string, TypeFieldState>;
export type TypeDFContext = {
    title: string;
    fields: TypeField[];
    state: TypeDFState;
    values?: DFValues;

    isValid?: boolean;
    setValue?: (name: string, value: FieldValue) => void;
    setError?: (name: string, hasError?: boolean, message?: string) => void;
    getValues: () => DFValues;
    onSave?: (values: DFValues) => void;
}



export type TypeDFSection = {
    label?: string;
    name?: string;
    columns?: TypeField[][];
}
export type TypeDFLayout = Array<TypeDFSection>;

