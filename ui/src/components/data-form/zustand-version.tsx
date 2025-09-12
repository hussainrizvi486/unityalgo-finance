import { create } from "zustand";
import { Button } from "@/components/ui/button";

import type { DFValues, FieldValue, FormValues, TypeField } from "./types";
import React, { useEffect, useLayoutEffect } from "react";
import { Field } from "./zustand-field";
import { buildLayout } from "./utils";
import { Column, Section } from "./components/layout";
import type { GridFormRowState } from "../grid-form/types";


export type DFFieldState = {
    hasError: boolean;
    error: string;
    value: FieldValue;
    field: TypeField;
}

export type DFState = Record<string, DFFieldState>;


export interface TypeGridFormStore {
    gridName: string;
    fields: TypeField[];
    rows: GridFormRowState[];
    expandedRow: GridFormRowState | null;

    // Computed values
    allRowsSelected: boolean;
    selectedRowsCount: number;
    hasError: boolean;
}


export interface TypeDFStore {
    values: DFValues;
    state: DFState;
    fields: TypeField[];
    isValid: boolean;

    // actions
    setValue: ({ name, value }: { name: string, value: FieldValue }) => void;
    setError: ({ name, hasError, message }: { name: string, hasError: boolean, message: string }) => void;
    selectRow: ({ fieldname, selectAll, id }: { fieldname: string; selectAll?: boolean; id?: string }) => void;
    setRowValue: ({ fieldname, rowId, name, value }: { fieldname: string, rowId: string, name: string, value: FieldValue }) => void;
    grids: Record<string, TypeGridFormStore>;

    validate: () => boolean
    getValues: () => DFValues;
    validateField: ({ field }: { field: TypeField }) => boolean | void;
    reset: () => void;
    triggerSave: (callback: (values: DFValues) => void) => void;
    // onSave: (values: DFValues, callback: (values: ) => void) => void;

    init: ({ values, fields, handleSave }: { values?: DFValues, fields: TypeField[], handleSave?: (values: DFValues) => void }) => void;
    addRow: (fieldname: string, values?: Record<string, FieldValue>) => void;

}

const createInitialGridRow = (
    fields: TypeField[],
    values = {},
    index: number
): GridFormRowState => {
    const row: GridFormRowState = {
        id: crypto.randomUUID(),
        index,
        checked: false,
        errors: {},
        values: {},
        fields: {},
    };

    fields.forEach((field) => {
        if (['section', 'column', "table"].includes(field.type)) return;
        const value = values[field.name] ?? field.defaultValue ?? null;

        row.fields[field.name] = {
            error: "",
            hasError: false,
            field,
            value
        };

        row.values[field.name] = value;
    });

    return row;
};



const createGrid = (field: TypeField, values?: DFValues): TypeGridFormStore => {
    const { fields } = field;

    const initialRows = values?.map((row, index) =>
        createInitialGridRow(fields, row, index + 1)
    ) || [];

    return {
        hasError: false,
        gridName: field.name,
        fields: fields,
        rows: initialRows,
        expandedRow: null,
        allRowsSelected: false,
        selectedRowsCount: 0,
    }
}


const useDFStore = create<TypeDFStore>((set, get) => ({
    values: {},
    state: {},
    isValid: true,
    grids: {},
    fields: [],



    getValues: () => get().values,

    reset: () => {
        const { fields } = get();
        const initialValues: DFValues = {};
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

        // field.onChange?.(get());
        return set((prev) => ({
            values: { ...prev.values, [name]: value },
            state: {
                ...prev.state,
                [name]: {
                    ...prev.state[name],
                    value,
                    hasError: false,
                    error: "",
                },
            },
        }))
    },

    validateField: ({ field }: { field: TypeField }) => {
        const { state } = get();
        const fieldState = state[field.name];
        if (!fieldState) return true;
        if (field.type == "table") {
            // const grid = get().grids[field.name];
        }

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


    validate: (): boolean => {
        const { fields, validateField } = get();


        // Object.keys(grids).forEach((key) => {
        //     grids[key].validate();
        // });

        let valid = true;
        fields.forEach((field) => {
            if (field.type !== 'section' && field.type !== 'column') {

                if (!validateField({ field })) valid = false;
            }
        });

        console.log(valid, get().values)
        set({ isValid: valid });
        return valid;
    },

    init: ({ fields, values }) => {

        const initialValues: DFValues = {};
        const state: DFState = {};
        const grids: Record<string, TypeGridFormStore> = {};

        fields.forEach((field) => {
            if (field.type === 'section' || field.type === 'column') return;
            const value = values?.[field.name] ?? field.defaultValue ?? null;
            initialValues[field.name] = value;

            state[field.name] = {
                hasError: false,
                error: "",
                value,
                field,
            }

            if (field.type == "table" && field.fields?.length) {
                grids[field.name] = createGrid(field, value);
            }
        });

        set({
            fields,
            values: initialValues,
            state,
            isValid: true,
            grids,
            // onSave: handleSave,
        });
    },



    addRow: (fieldname, values) => {
        const store = get();
        const field = store.state[fieldname];

        if (!field) {
            return
        }
        const updated = { ...store.grids[fieldname] };

        const index = updated.rows.length + 1;
        const newRow = createInitialGridRow(field.field.fields || [], values, index);
        updated.rows.push(newRow);

        set({ grids: { ...store.grids, [fieldname]: updated } })
    },

    selectRow: ({ fieldname, selectAll, id }) => {
        const store = get();

        const field = store.state[fieldname];
        if (!field) {
            return
        }

        if (selectAll) {
            const updatedRows = store.grids[fieldname]?.rows.map((r) => ({
                ...r,
                checked: !!selectAll,
            })) || [];
            const updated = { ...store.grids[fieldname], rows: updatedRows, allRowsSelected: !!selectAll, selectedRowsCount: updatedRows.length };
            set({ grids: { ...store.grids, [fieldname]: updated } })
            return;
        }

        const updatedRow = store.grids[fieldname]?.rows.map((r) => r.id === id ? { ...r, checked: !r.checked } : r) || [];
        const selectedRowsCount = updatedRow.filter((r) => r.checked).length;
        const allRowsSelected = selectedRowsCount === updatedRow.length;
        const updated = { ...store.grids[fieldname], rows: updatedRow, allRowsSelected, selectedRowsCount };


        set({ grids: { ...store.grids, [fieldname]: updated } })
    },

    removeRow: (fieldname, ids) => {
        const store = get();

        const field = store.state[fieldname];
        if (!field) {
            return
        }

        const updatedRow = store[fieldname]?.rows.filter((r) => !ids.includes(r.id)) || [];
        const updated = { ...store.grids[fieldname], rows: updatedRow };

        set({ grids: { ...store.grids, [fieldname]: updated } })
    },

    setRowValue: ({ fieldname, rowId, name, value }: { fieldname: string, rowId: string, name: string, value: FieldValue }) => {
        const store = get();
        const field = store.state[fieldname];
        const grid = store.grids[fieldname];

        if (!field || !grid) {
            return
        }


        const updatedRows = grid.rows.map((row) => {
            if (row.id === rowId) {
                const values = { ...row.values, [name]: value };
                const updatedField = {
                    ...row.fields[name],
                    value: value,
                    hasError: false,
                    error: '',
                }
                row.fields[name] = updatedField;
                return { ...row, values };
            }

            return row;
        })

        const values: Array<Record<string, FieldValue>> = [];
        updatedRows.forEach((r) => values.push(r.values));
        const updated = { ...grid, rows: updatedRows };

        set({
            grids: {
                ...store.grids, [fieldname]: updated
            },
            state: {
                ...store.state,
                [fieldname]: {
                    ...store.state[fieldname],
                    error: "",
                    hasError: false,
                    value: values
                }
            }
        })
    },

    triggerSave: (callbackFn) => {
        const { validate, values } = get();
        const isValid = validate();

        if (!isValid) return;

        console.log(values)
        callbackFn(values);
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


    console.log(store.state);

    if (!store.fields.length) return <></>

    return <div>
        <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold">{props.title}</div>
            <div>
                <Button onClick={() => store.validate()}>Save</Button>
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

