/* eslint-disable @typescript-eslint/no-explicit-any */
export type TypeOption = {
    label: string;
    value: string;
}

export type FieldState = {
    hasError: boolean;
    error: string;
    value: FieldValue;
    field: TypeField;
}

export type FormState = Record<string, FieldState>;
export type FieldType = "text" | "number" | "float" | "currency" | "date" | "file" | "textarea" | "texteditor" | "select" | "checkbox" | "table" | "autocomplete" | "custom" | "section" | "column" | "decimal";
export type FieldValue = string | number | boolean | File | Date | TypeOption | TypeOption[] | Record<string, any> | null | undefined;
export type FormValues = Record<string, FieldValue>;
export type ValidationFunction = (value: FieldValue) => boolean | string;


export type DFContextValue = {
    values: FormValues | null | undefined;
    fields: TypeField[];
    state: FormState;
    isValid?: boolean;
    onSave?: (values: FormValues) => void;
    triggerSave?: () => void;
    getValues: () => FormValues;
    setValue?: (name: string, value: FieldValue) => void;
    setError?: (name: string, hasError?: boolean, message?: string) => void;
}


export interface CustomFieldProps {
    form?: DFContextValue,
}
export interface TypeField {
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    defaultValue?: FieldValue;
    options?: TypeOption[];
    placeholder?: string;
    sectionBreak?: boolean;
    columnBreak?: boolean;
    validate?: ValidationFunction;
    onChange?: (value: FieldValue) => void;
    onBlur?: (value: FieldValue) => void;
    getOptions?: (value?: string) => Promise<TypeOption[]>;
    renderOption?: () => React.ReactNode;
    dependsOn?: (values: FormValues) => boolean;
    requiredOn?: (values: FormValues) => boolean;
    readOnlyOn?: (values: FormValues) => boolean;
    component?: (props?: CustomFieldProps) => React.ReactNode;
    fields?: Array<TypeField>;
}



export type TypeDFSection = {
    label?: string;
    name?: string;
    columns?: TypeField[][];
}
export type TypeDFLayout = Array<TypeDFSection>;