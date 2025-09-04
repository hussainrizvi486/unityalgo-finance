import { create } from "zustand";
import type { FieldValue, FormValues, TypeField } from "./types";
import React from "react";
import { Button } from "../ui/button";
import { Field } from "./zustand-field";
import { buildLayout } from "./utils";
import { Column, Section } from "./components/layout";


type DFValues = Record<string, FieldValue>;


export type DFFieldState = {
    hasError: boolean;
    error: string;
    value: FieldValue;
    field: TypeField;
}

type DFState = Record<string, DFFieldState>;


interface TypeDFStore {
    values: FormValues;
    state: DFState;
    fields: TypeField[];
    isValid: boolean;

    // actions
    setValue: ({ name, value }: { name: string, value: FieldValue }) => void;
    setError: ({ name, hasError, message }: { name: string, hasError: boolean, message: string }) => void;

    validate: () => void
    getValues: () => FormValues;
    reset: () => void;
    onSave?: (values: FormValues) => void;
    triggerSave?: () => void;

    init: ({ values, fields }: { values?: FormValues, fields: TypeField[] }) => void;
}
type FormStore = {
    values: FormValues;
    state: DFState;
    fields: TypeField[];
    isValid: boolean;

    // actions
    setValue: (name: string, value: FieldValue) => void;
    setError: (name: string, hasError?: boolean, message?: string) => void;
    getValues: () => FormValues;
    reset: () => void;
    onSave?: (values: FormValues) => void;
    triggerSave?: () => void;
};



const useFormStore = create<TypeDFStore>((set, get) => ({
    values: {},
    fields: [],
    state: {},
    isValid: true,

    getValues: () => get().values,
    reset: () => {
        const { fields } = get();
        const initialValues: FormValues = {};
        const initialState: DFState = {};

        fields.forEach((f) => {
            const value = f.defaultValue ?? null;
            initialValues[f.name] = value;
            initialState[f.name] = {
                hasError: false,
                error: "",
                value,
                field: f,
            };
        });

        set(() => ({
            values: initialValues,
            state: initialState,
            isValid: true,
        }));

    },
    onSave: undefined,

    triggerSave: () => {
        const { validate } = get();
        validate()
    },

    setError: ({ name, hasError, message }) => {
        set((prev) => ({
            state: {
                ...prev.state,
                [name]: {
                    ...prev.state[name],
                    hasError,
                    error: message,
                },
            },
        }));
    },

    setValue: ({ name, value }) => set((prev) => {
        return {
            values: { ...prev.values, [name]: value },
            state: {
                ...prev.state,
                [name]: {
                    ...prev.state[name],
                    value,
                },
            },
        };
    }),


    validateField: ({ field }: { field: TypeField }) => {
        const { state, values } = get();
        const fieldState = state[field.name];
        if (!fieldState) return;



    },

    validate: () => {
        const { state } = get()
    },

    init({ values, fields }) {
        const initialValues = {};
        const state: DFState = {};

        fields.forEach(field => {
            const value = values?.[field.name] ?? field.defaultValue ?? null;
            initialValues[field.name] = value;
            state[field.name] = {
                hasError: false,
                error: "",
                value,
                field,
            };
        });
        return set(() => ({
            fields: fields,
            values: initialValues,
            state,
            isValid: true,
        }))
    }
}));


const createDFStore = (fields: TypeField[], onSave?: (values: FormValues) => void) =>
    create<FormStore>((set, get) => {
        const initialValues: FormValues = {};
        const initialState: DFState = {};

        fields.forEach((f) => {
            const value = f.defaultValue ?? null;

            initialValues[f.name] = value;
            initialState[f.name] = {
                hasError: false,
                error: "",
                value,
                field: f,
            };
        });

        return {
            values: initialValues,
            state: initialState,
            fields,
            isValid: true,

            setValue: (name, value) =>

                set((prev) => {
                    // const field = prev.state[name]?.field;
                    // const hasError =
                    //     field?.required && (value === null || value === "" || value === undefined);
                    return {
                        values: { ...prev.values, [name]: value },
                        state: {
                            ...prev.state,
                            [name]: {
                                ...prev.state[name],
                                value,
                                // hasError,
                                // error: hasError ? `${field?.label ?? name} is required` : "",
                            },
                        },
                    };
                }),

            setError: (name, hasError = false, message = "") =>
                set((prev) => ({
                    state: {
                        ...prev.state,
                        [name]: {
                            ...prev.state[name],
                            hasError,
                            error: message,
                        },
                    },
                })),

            getValues: () => get().values,

            reset: () =>
                set(() => ({
                    values: initialValues,
                    state: initialState,
                    isValid: true,
                })),

            onSave,
            triggerSave: () => {
                console.log("Trigger Save");
                const { values } = get();
                onSave?.(values);
            },
        };
    });





interface DataFormProps {
    fields: TypeField[];
    title: string
    values?: Record<string, string>;
    onSave?: (values: Record<string, string>) => void;
}


export const DataForm: React.FC<DataFormProps> = (props) => {
    const store = createDFStore(props.fields)
    const { triggerSave } = store;

    const formLayout = React.useMemo(() => buildLayout(props.fields), [props.fields]);

    console.log(store)
    return <div>
        <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold">{props.title}</div>
            <div>
                <Button onClick={triggerSave}>Save</Button>
            </div>
        </div>

        <div className="border border-input py-4 rounded-md" >
            {formLayout.map((section, index) => (
                <Section key={index} label={section.label || ""}>
                    {section.columns?.map(((col, k) => (
                        <Column key={k} >
                            {col.map((field) => (
                                <Field field={field} key={field.name} />
                            ))}
                        </Column>
                    )))}
                </Section>
            ))}

        </div>
    </div>;
}

