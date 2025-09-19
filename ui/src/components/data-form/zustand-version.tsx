import { create } from "zustand";
import { Button } from "@/components/ui/button";

import type { DFValues, FieldValue, FormValues, TypeField } from "./types";
import React, { useEffect, useLayoutEffect } from "react";
import { Field } from "./zustand-field";
import { buildLayout } from "./utils";
import { Column, Section } from "./components/layout";
import type { GridFormRowState } from "../grid-form/types";
import { toast } from "react-hot-toast";
import { GridForm } from "./components/grid-form";


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
    allRowsSelected: boolean;
    selectedRowsCount: number;
    hasError: boolean;
}


export interface TypeDFStore {
    // values: DFValues;
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
    validateField: ({ field }: { field: TypeField }) => { validated: boolean, errors: Record<string, object | string> };
    reset: () => void;
    triggerSave: (callback?: (values: DFValues) => void) => void;
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
    // values: {},
    state: {},
    isValid: true,
    grids: {},
    fields: [],



    getValues: () => {
        const { state } = get();
        const values: DFValues = {};
        Object.keys(state).forEach((key) => {
            values[key] = state[key].value
        })
        return values
    },

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


        set({ state: initialState, isValid: true });
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
            // values: { ...prev.values, [name]: value },
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
        const errors: Record<string, object | string> = {}; // final structured errors
        const fieldState = state[field.name];
        const errorKey = field.label || field.name;
        if (!fieldState) return { validated: true, errors: {} };

        if (field.required && !fieldState.value) {
            get().setError({
                name: field.name,
                hasError: true,
                message: `${field.label ?? field.name} is required`,
            });
            return { validated: false, errors: { [errorKey]: `${field.label ?? field.name} is required` } };

        }

        if (field.type == "table") {
            const grid = get().grids[field.name];

            if (field.required && !grid.rows.length) {
                const msg = `${field.label ?? field.name} is required`;
                get().setError({
                    name: field.name,
                    hasError: true,
                    message: msg,
                });
                errors[errorKey] = msg;
                return { validated: false, errors };
            }

            let hasError = false;
            grid.rows.forEach((row) => {
                Object.keys(row.fields).forEach((key) => {
                    const cell = row.fields[key];
                    const gridField = field.fields?.find(f => f.name === key);
                    const errorKey = field.label || field.name;
                    if (gridField.required && (cell.value === null || cell.value === undefined || cell.value === '')) {
                        const msg = `${gridField.label || gridField.name} is required`;
                        cell.hasError = true;
                        cell.error = msg;
                        row.errors[key] = msg;

                        if (!errors[errorKey]) {
                            errors[errorKey] = {};
                        }

                        if (!errors[errorKey][row.index]) {
                            errors[errorKey][row.index] = {};
                        }

                        errors[errorKey][row.index][key] = msg;
                        hasError = true

                    } else {
                        cell.hasError = false;
                        cell.error = '';
                        delete row.errors[key];
                    }
                })
            })

            if (hasError) {
                return { validated: false, errors };
            }
        }


        return { validated: true, errors: {} };
    },

    handleErrors: (errors: Record<string, object | string>) => {
        Object.keys(errors).forEach((key) => {
            if (typeof errors[key] === 'string') {
                toast.error(errors[key] as string, { position: "top-right" });
            }
            else if (typeof errors[key] === 'object') {

                Object.keys(errors[key] as object).forEach((row) => {
                    let msg = "Validation errors in row " + row + ": ";
                    // Mandatory fields required in table Items, Row 2
                    const rowErrors = errors[key][row];
                    Object.keys(rowErrors).forEach((field) => {
                        msg += `\n - ${field}: ${rowErrors[field]}`;
                    });

                    toast.error(msg, { position: "top-right" });
                })


            }
        })
    },

    validate: (): boolean => {
        const { fields, validateField, handleErrors } = get();
        console.log("validate called");
        const formErrors = {};
        let valid = true;
        handleErrors(formErrors);

        fields.forEach((field) => {
            if (field.type !== 'section' && field.type !== 'column') {
                const { validated, errors } = validateField({ field });
                if (Object.keys(errors).length) Object.assign(formErrors, errors);
                console.error(errors)
                if (!validated) valid = false;
            }
        });



        set({ isValid: valid });
        if (Object.keys(formErrors).length) {
            handleErrors(formErrors);
        }

        return valid;
    },

    init: ({ fields, values }) => {

        const initialValues: DFValues = {};
        const state: DFState = {};
        const grids: Record<string, TypeGridFormStore> = {};

        fields.forEach((field) => {
            if (field.type === 'section' || field.type === 'column') return;
            let defaultValue = values?.[field.name] ?? field.defaultValue ?? null;
            if (defaultValue === undefined || defaultValue === null) {
                if (field.type === 'checkbox') defaultValue = false;
                if (field.type === 'table') defaultValue = [];
                if (["currency", "decimal", "number"].includes(field.type)) {
                    defaultValue = 0;
                }
            }
            const value = defaultValue;
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
        const { validate, getValues } = get();
        const isValid = validate();


        if (isValid) {
            callbackFn?.(getValues());
            return
        };

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
                <Button onClick={() => store.triggerSave(props.onSave)}>Save</Button>
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

