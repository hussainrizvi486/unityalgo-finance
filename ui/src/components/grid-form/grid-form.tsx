/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FileTextIcon, PencilIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import { decimal, integer, cn } from "@/utils";
import api from "@/api";
import type { TypeField, GridFormContextType, GridFormState, GridFormValues, GridFormRowState, FieldValue, FieldType } from "./types";
import type { DFContextValue } from "../data-form";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Field } from "./field";
import { MiniForm } from "./mini-form";

const getHeaderColumns = (fields: TypeField[]) => {
    const availableWidth = 9;
    const columns: TypeField[] = [];
    let utilizedWidth = 0;

    fields.forEach((field) => {
        const width = field.width || 1;

        if (utilizedWidth + width <= availableWidth
            && !field.columnBreak
            && !field.sectionBreak
            && !field.hidden
            && !["column", "section"].includes(field.type)) {
            utilizedWidth += width;
            columns.push(field);
        }
    });

    const columnSizes = [
        '3rem',
        '3rem',
        ...columns.map(field => `minmax(0, ${field.width || 1}fr)`),
        '2.5rem'
    ];

    return {
        styles: { gridTemplateColumns: columnSizes.join(' ') },
        columns
    };
};

const GridFormContext = createContext<GridFormContextType>({
    fields: [],
    state: [],
    allRowsSelected: false,
    expandedRow: null,
    dataform: null,
    getValues: () => [],
    setValue: () => { },
    selectRow: () => { },
    onChange: () => { },
    addRow: () => { },
    removeRow: () => { },
    // hasError: false,
    setExpandedRow: () => { },
});

const formatValue = (value: FieldValue, type: FieldType) => {
    if (["decimal", "float", "currency"].includes(type)) {
        return decimal(value);
    }
    else if (type == "checkbox") {
        return Boolean(value);
    }

    else if (type == "number") {
        return integer(value as string) || 0;
    }

    else if (["text", "textarea", "texteditor",].includes(type)) {
        const cleanValue = (value ?? '').toString().replace(/[$,%]/g, '');
        return cleanValue;
    }
    return value;
}


const getFields = (fields: TypeField[]) => {
    return fields.filter(field => !field.columnBreak && !field.sectionBreak);
}

const getInitialState = (fields: TypeField[], values?: GridFormValues[]) => {
    const state: GridFormState = [];

    values?.forEach((row, index) => {
        const stateRow: GridFormRowState = {
            id: crypto.randomUUID(),
            index: index + 1,
            checked: false,
            errors: {},
            values: row || {},
            fields: {},
        }

        fields.forEach((field) => {
            const value = row[field.name] || field.defaultValue || null;
            stateRow.fields[field.name] = {
                error: "",
                hasError: true,
                field: field,
                value: formatValue(value, field.type),
            };
        })
        state.push(stateRow);
    })

    return state
}


interface GridFormProviderProps {
    children: React.ReactNode;
    fields: TypeField[];
    values?: GridFormValues[];
    dataform: DFContextValue;
    onChange?: (values: GridFormValues[]) => void;
}
const GridFormProvider: React.FC<GridFormProviderProps> = (props) => {
    const controlFields = useMemo(() => getFields(props.fields), [props.fields]);
    const [state, setState] = useState<GridFormState>([]);
    const [expandedRow, setExpandedRow] = useState<GridFormRowState | null>(null);

    // const validateField = ({ name, id }: { name: string; id: string }) => {
    //     let message = "";
    //     let hasError = false;

    //     const field = controlFields.find(f => f.name === name);
    //     const row = state.find(r => r.id === id)

    //     if (!field || !row) {
    //         return { message, hasError };
    //     }
    //     const required = field.requiredOn ? field.requiredOn(row.values || {}) : field.required;
    //     if (required && isEmpty(row.values?.[name], field.type)) {
    //         message = "This field is required";
    //         hasError = true;
    //     }

    //     return { message, hasError };
    // }


    // const validate = () => {
    //     let hasError = false;

    //     const update = state.map(row => {
    //         const updatedFields = { ...row.fields };
    //         const updatedErrors = { ...row.errors };

    //         Object.keys(row.fields).forEach((key) => {
    //             const field = row.fields[key].field;
    //             const { message, hasError: error } = validateField({ name: field.name, id: row.id });

    //             if (error) {
    //                 hasError = true;
    //                 updatedFields[key] = {
    //                     ...row.fields[key],
    //                     hasError: true,
    //                     error: message
    //                 };
    //                 updatedErrors[key] = message;
    //             } else {
    //                 updatedFields[key] = {
    //                     ...row.fields[key],
    //                     hasError: false,
    //                     error: ""
    //                 };
    //                 delete updatedErrors[key];
    //             }
    //         });

    //         return {
    //             ...row,
    //             fields: updatedFields,
    //             errors: updatedErrors
    //         };
    //     })
    //     setState([...update]);
    // }

    const addRow = (values?: Record<string, any>) => {
        const row: GridFormRowState = {
            id: crypto.randomUUID(),
            checked: false,
            errors: {},
            index: state.length + 1,
            fields: {},
            values: values || {}
        };

        controlFields.forEach(field => {
            const value = values?.[field.name] || field?.defaultValue || null;
            row.fields[field.name] = {
                value: formatValue(value, field.type),
                error: "",
                hasError: false,
                field: field
            };
        })
        setState((prev) => [...prev, row]);
    }

    const validate = () => {

     }

    const removeRow = useCallback((id?: string | Array<string>) => {
        setState((prev) => {
            let updated: GridFormRowState[];

            if (!id) {
                updated = prev.filter(row => !row.checked);
            } else if (Array.isArray(id)) {
                updated = prev.filter(row => !id.includes(row.id));
            } else {
                updated = prev.filter(row => row.id !== id);
            }

            return updated.map((row, index) => ({ ...row, index: index + 1 }));
        });
    }, [])

    const selectRow = useCallback(({ selectAll, id }) => {
        setState(prev => {
            if (selectAll) {
                const allSelected = prev.length > 0 && prev.every(row => row.checked);
                return prev.map(row => ({ ...row, checked: !allSelected }));
            }

            if (!id) return prev;
            return prev.map(row => row.id === id ? { ...row, checked: !row.checked } : row);
        });
    }, [])

    const getValues = () => {
        const values: Array<GridFormValues> = [];
        state.forEach(row => {
            const rowValues: GridFormValues = {};
            Object.keys(row.fields).forEach(key => {
                rowValues[key] = row.fields[key].value;
            });
            values.push(rowValues);
        });
        return values
    }

    const setValue = ({ name, value, id }: { name: string; value: FieldValue<any>; id?: string }) => {
        setState(prev => {
            return prev.map(row => {
                if (id && row.id !== id) return row;
                const field = row.fields[name];
                if (field) {
                    field.value = value;
                    field.hasError = false;
                    field.error = "";
                }
                row.values[name] = value;
                return { ...row };
            });
        });

    }

    const setError = ({ id, name, message }: { id: string; name: string; message: string }) => {
        setState(prev => {
            return prev.map(row => {
                if (row.id === id) {
                    const field = row.fields[name];
                    if (field) {
                        field.hasError = true;
                        field.error = message;
                    }
                }
                return { ...row };
            });
        });
    }

    const allRowsSelected = useMemo(() => state.length > 0 && state.every(row => row.checked), [state]);
    // console.warn(state);
    const contextValues = {
        setError,
        addRow,
        setValue,
        fields: props.fields,
        getValues,
        dataform: props.dataform,
        removeRow,
        expandedRow,
        setExpandedRow,
        allRowsSelected,
        state,
        selectRow
    } as GridFormContextType;



    const defaultValues: GridFormValues[] = useMemo(() => props.values, [props.values]);

    useEffect(() => {
        if (!state || !state.length) {
            setState(getInitialState(controlFields, defaultValues));
        }
    }, [controlFields, defaultValues])


    useEffect(() => {
        if (state.length) {
            props.onChange?.(getValues());
        }
    }, [state])

    return <GridFormContext.Provider value={contextValues}>
        {props.children}
    </GridFormContext.Provider>
};
const GridFormHeader = () => {
    const { fields, selectRow, allRowsSelected } = useGridForm();
    const { styles, columns } = getHeaderColumns(fields);

    return (
        <header className="border-b bg-gray-200">
            <div
                className="grid items-center h-10"
                style={styles}
            >
                <div className="px-3 py-3 flex items-center justify-center border-r border-gray-300 h-full">
                    <Checkbox
                        onCheckedChange={() => selectRow({ selectAll: true })}
                        checked={allRowsSelected}
                    />
                </div>

                <div className="px-3 flex items-center justify-center border-r border-gray-300 h-full">
                    <span className="text-sm font-medium">No.</span>
                </div>

                {columns.map((field) => (
                    <div
                        key={field.name}
                        className={cn(
                            "px-3 py-2 h-full flex items-center overflow-hidden border-r border-gray-300",
                        )}
                    >
                        <div className="flex items-center min-w-0">
                            <span className="text-sm font-medium truncate" > {field.label}</span>
                            {field.required && <span className="text-red-500 ml-1 shrink-0">*</span>}
                        </div>

                    </div>
                ))}

                <div className="px-3 flex items-center justify-center h-full">
                    <SettingsIcon className="size-4 text-gray-600" />
                </div>
            </div>
        </header>
    );
};
type GridFormProps = {
    fields: TypeField[];
    gridContentClass?: string;
    values?: GridFormValues[];
    dataform?: DFContextValue;
    onChange?: (values: GridFormValues[]) => void;
    className?: string;
}

const useGridForm = () => {
    const ctx = useContext(GridFormContext);
    return ctx;
}


const GridForm: React.FC<GridFormProps> = (props) => {
    const hasError = false;
    return (
        <GridFormProvider fields={props.fields} values={props.values} dataform={props.dataform} onChange={props.onChange}>
            <div className="">
                <div className={cn("border rounded-md mb-4", props.gridContentClass, hasError ? "ring-destructive ring-2" : "")}>
                    <GridFormHeader />
                    <GridFormBody />
                </div>
                <GridFormFooter />
            </div>
        </GridFormProvider>
    )
}
const GridFormBody = () => {
    const form = useGridForm();
    const { fields, state, selectRow, expandedRow, setExpandedRow } = form;
    const { columns, styles } = getHeaderColumns(fields);

    if (!state?.length) {
        return (
            <div className="py-8 flex justify-center">
                <div className="flex flex-col items-center">
                    <FileTextIcon className="w-12 h-12 mb-2" />
                    <div className="text-sm">No data available</div>
                    <div className="text-xs">Click "Add Row" to get started</div>
                </div>
            </div>
        );
    }

    return (
        <main className="divide-y divide-gray-200">
            {state.map((row) => {
                const rowState = state.find(i => i.id === row.id);
                if (!rowState) return null;

                return (
                    <div
                        key={row.id}
                        style={styles}
                        className="grid items-center min-h-[2.5rem] border-b border-gray-200 last:border-b-0"
                    >

                        <div className="px-3 py-2 flex items-center justify-center border-r border-gray-200 h-full">
                            <Checkbox
                                onCheckedChange={() => selectRow({ id: row.id })}
                                checked={rowState.checked}
                            />
                        </div>

                        <div className="px-3 py-2 flex items-center justify-center border-r border-gray-200 h-full">
                            <span className="text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center">
                                {row.index}
                            </span>
                        </div>

                        {columns.map((field, colIndex) => (
                            <div
                                key={colIndex}
                                className={cn(
                                    "h-full flex items-center border-r border-gray-200",
                                    field.type === "checkbox" && "justify-center"
                                )}
                            >
                                <Field
                                    field={field}
                                    state={rowState}
                                    ctx={form}
                                    gridUpdate={true}
                                />
                            </div>
                        ))}

                        {/* Actions column */}
                        <div className="px-3 flex items-center justify-center h-full">
                            <button
                                type="button"
                                onClick={() => setExpandedRow(rowState)}
                                className="p-1.5 rounded-full transition-all duration-150 cursor-pointer opacity-70 hover:opacity-100"
                                title="Edit row"
                            >
                                <PencilIcon className="size-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
            {expandedRow && <MiniForm form={form} fields={fields} state={expandedRow} />}
        </main>
    );
};

const GridFormFooter = () => {
    const { allRowsSelected, addRow, removeRow, state } = useGridForm();
    return (

        <div className="flex items-center">
            <div className="flex gap-2 items-center">
                {allRowsSelected && <Button variant="destructive"
                    onClick={() => removeRow(state.filter(row => row.checked).map(row => row.id))}>
                    <Trash2Icon />
                    Delete
                </Button>}

                <Button onClick={() => addRow()} >Add Row</Button>
            </div>
        </div>
    )
}
export { GridForm };


export const Demo = () => {
    const fields: Array<TypeField> = [
        {
            name: "item",
            label: "Item",
            getOptions: async () => {
                const response = await api.get("api/search-link/", {
                    params: {
                        "model": "Product",
                        "app": "stock",
                        "fields": "product_name"
                    }
                });
                return response.data.map((row) => ({
                    label: row.product_name,
                    value: row.id
                }));
            },
            type: "autocomplete",
            width: 4,
            required: true,
        },
        {

            name: "Tax Template",
            label: "Tax Template",
            type: "text"
        },
        { name: "quantity", label: "Quantity", type: "number", defaultValue: 1 },
        {
            name: "uom", label: "UOM", type: "select", options: [
                { label: "PCs", value: "pcs" },
                { label: "Nos", value: "nos" },
            ],
        },
        // {
        //     name: "income_account",
        //     type: "text",
        //     label: "Income Account",
        // },
        // {
        //     name: "expense_account",
        //     type: "text",
        //     label: "Expense Account",
        //     required: true,
        // },
        { name: "rate", label: "Rate", type: "decimal" },
        { name: "amount", label: "Amount", type: "decimal", readOnly: true }
    ]

    // const values: GridFormValues[] = {[
    //     {
    //         "item": {
    //             "label": "Viper V3 Pro Wireless Esports Gaming Mouse: Symmetrical - 54g Lightweight - 8K Polling - 35K DPI Optical Sensor - Gen3 Optical Switches - 8 Programmable Buttons - 95 Hr Battery - Black",
    //             "value": "c3274622-227b-4dae-84be-2ce9387a2316",
    //         }, "quantity": 2, "rate": 100, "amount": 200
    //     },
    //     { "item": "c3274622-227b-4dae-84be-2ce9387a2316", "quantity": 1, "rate": 150, "amount": 150 },
    //     { "item": "c3274622-227b-4dae-84be-2ce9387a2316", "quantity": 3, "rate": 50, "amount": 150 }
    // ]
    // }

    return (
        <div className="max-w-6xl mx-auto px-2 py-16">
            <div className="mb-8">

            </div>

            <GridForm fields={fields} />
        </div>
    )
}