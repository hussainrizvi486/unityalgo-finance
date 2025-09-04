import { create } from "zustand";
import type { FieldValue, FormValues, TypeField } from "./types";
import type { TypeGridFormStore, } from "../grid-form/zustand-grid-form";
import React, { useEffect, useLayoutEffect } from "react";
import { Button } from "../ui/button";
import { Field } from "./zustand-field";
import { buildLayout } from "./utils";
import { Column, Section } from "./components/layout";



// type DFValues = Record<string, FieldValue>;


export type DFFieldState = {
    hasError: boolean;
    error: string;
    value: FieldValue;
    field: TypeField;
}

type DFState = Record<string, DFFieldState>;


export interface TypeDFStore {
    values: FormValues;
    state: DFState;
    fields: TypeField[];
    isValid: boolean;

    grids: Record<string, TypeGridFormStore>;
    // actions
    setValue: ({ name, value }: { name: string, value: FieldValue }) => void;
    setError: ({ name, hasError, message }: { name: string, hasError: boolean, message: string }) => void;



    addGrid: (name: string, grid: TypeGridFormStore) => void;
    removeGrid: (name: string) => void;
    validate: () => void
    getValues: () => FormValues;
    validateField: ({ field }: { field: TypeField }) => boolean | void;
    reset: () => void;
    onSave?: (values: FormValues) => void;
    triggerSave?: () => void;

    init: ({ values, fields, handleSave }: { values?: FormValues, fields: TypeField[], handleSave?: (values: FormValues) => void }) => void;
}




const useDFStore = create<TypeDFStore>((set, get) => ({
    values: {},
    grids: {},
    fields: [],
    state: {},
    isValid: true,
    onSave: undefined,
    addGrid: (name: string, grid) => {
        set((prev) => ({
            grids: { ...prev.grids, [name]: grid }
        }))
    },

    removeGrid: (name: string) => {
        set((prev) => ({
            grids: Object.fromEntries(Object.entries(prev.grids).filter(([k]) => k !== name))
        }))
    },
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


        set({ values: initialValues, state: initialState, isValid: true });
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

    setValue: ({ name, value }) => {

        const field = get().fields.find((f) => f.name === name);
        if (!field) return;

        field.onChange?.(get());
        return set((prev) => ({
            values: { ...prev.values, [name]: value },
            state: {
                ...prev.state,
                [name]: {
                    ...prev.state[name],
                    value,
                },
            },
        }))
    },

    validateField: ({ field }: { field: TypeField }) => {
        const { state } = get();
        const fieldState = state[field.name];
        if (!fieldState) return true;

        if (field.required && !fieldState.value) {
            get().setError({
                name: field.name,
                hasError: true,
                message: `${field.label ?? field.name} is required`,
            });
            return false;
        }
        return true;
    },

    validate: () => {
        const { fields, validateField, grids } = get();
        Object.keys(grids).forEach((keys) => {
            grids[keys].addRow();
        })

        let valid = true;
        fields.forEach((field) => {
            if (!validateField({ field })) valid = false;
        });
        set({ isValid: valid });
        return valid;
    },

    init: ({ fields, values, handleSave }) => {
        const initialValues: FormValues = {};
        const state: DFState = {};

        fields.forEach((field) => {
            if (field.type === 'section' || field.type === 'column') return;

            const value = values?.[field.name] ?? field.defaultValue ?? null;
            initialValues[field.name] = value;
            state[field.name] = {
                hasError: false,
                error: "",
                value,
                field,
            };
        });

        // console.error(state);
        set({
            fields,
            values: initialValues,
            state,
            isValid: true,
            onSave: handleSave,
        });
    },

    triggerSave: () => {
        const { validate, onSave, values } = get();
        validate();

        if (onSave) onSave(values);
    },
}));


interface DataFormProps {
    fields: TypeField[];
    title: string
    values?: Record<string, string>;
    onSave?: (values: Record<string, string>) => void;
}


export const DataForm: React.FC<DataFormProps> = (props) => {
    const { fields, values } = props;
    const form = React.useMemo(() => buildLayout(props.fields), [props.fields]);
    const store = useDFStore();



    useLayoutEffect(() => {
        store.init({ fields, values, });
    }, [fields, values]);


    if (!store.fields.length) return <></>

    return <div>
        <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold">{props.title}</div>
            <div>
                <Button onClick={store.triggerSave}>Save</Button>
            </div>
        </div>

        <div className="border border-input py-4 rounded-md" >
            {form.map((section, index) => (
                <Section key={index} label={section.label || ""}>
                    {section.columns?.map(((col, k) => (
                        <Column key={k} >
                            {col.map((field) => (
                                <Field field={field} key={field.name} store={store} />
                            ))}
                        </Column>
                    )))}
                </Section>
            ))}
        </div>
    </div>
}

