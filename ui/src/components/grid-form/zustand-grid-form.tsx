import { useEffect, createContext, useContext, useMemo, } from "react";
import { create } from "zustand";
import { subscribeWithSelector } from 'zustand/middleware';

import { FileTextIcon, PencilIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import api from "@/api";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { integer, decimal, cn } from "@/utils"


import type { FieldType, FieldValue, GridFormRowState, GridFormValues, TypeField } from "./types";
import { Field } from "./field";
import { MiniForm } from "./mini-form";
import type { TypeDFStore } from "../data-form/zustand-version";

export interface TypeGridFormStore {
    // State
    control?: TypeDFStore | null;
    fields: TypeField[];
    rows: GridFormRowState[];
    expandedRow: GridFormRowState | null;

    // Computed values
    allRowsSelected: boolean;
    selectedRowsCount: number;

    // Actions
    init: (fields: TypeField[], values?: GridFormValues[], control?: TypeDFStore) => void;
    addRow: (values?: Record<string, FieldValue>) => void;
    removeRow: (id?: string | string[]) => void;
    selectRow: (params: { id?: string; selectAll?: boolean }) => void;
    setValue: (params: { name: string; value: FieldValue; id?: string }) => void;
    setError: (params: { id: string; name: string; message: string }) => void;
    setExpandedRow: (row: GridFormRowState | null) => void;
    getValues: () => GridFormValues[];
    validateField: (params: { name: string; id: string }) => { message: string; hasError: boolean };
    validateAll: () => boolean;
    clearStore: () => void;
}

const formatValue = (value: FieldValue, type: FieldType) => {
    if (["decimal", "float", "currency"].includes(type)) {
        return decimal(value);
    }
    else if (type === "checkbox") {
        return Boolean(value);
    }
    else if (type === "number") {
        return integer(value as string) || 0;
    }
    else if (["text", "textarea", "texteditor"].includes(type)) {
        const cleanValue = (value ?? '').toString().replace(/[$,%]/g, '');
        return cleanValue;
    }
    return value;
};


const getFields = (fields: TypeField[]) => {
    return fields.filter(field => !field.columnBreak && !field.sectionBreak);
};
const createInitialRowState = (
    fields: TypeField[],
    values: GridFormValues = {},
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
        const value = values[field.name] ?? field.defaultValue ?? null;
        const formattedValue = formatValue(value, field.type);

        row.fields[field.name] = {
            error: "",
            hasError: false,
            field,
            value: formattedValue,
        };

        // ✅ keep row.values in sync
        row.values[field.name] = formattedValue;
    });

    return row;
};


const gridFormStore = create<TypeGridFormStore>()(
    subscribeWithSelector((set, get) => ({
        // Initial state
        fields: [],
        rows: [],
        expandedRow: null,
        allRowsSelected: false,
        selectedRowsCount: 0,
        control: null,

        // Actions
        init: (fields, values = [], control = null) => {
            const controlFields = getFields(fields);
            const initialRows = values.map((row, index) =>
                createInitialRowState(controlFields, row, index + 1)
            );
            console.log("init called")

            set({
                control,
                fields,
                rows: initialRows,
                allRowsSelected: false,
                selectedRowsCount: 0,
                expandedRow: null,
            });
        },

        addRow: (values = {}) => {
            const { fields, rows } = get();
            const controlFields = getFields(fields);
            const newRow = createInitialRowState(controlFields, values, rows.length + 1);

            set(state => ({
                rows: [...state.rows, newRow]
            }));
        },

        removeRow: (id) => {
            const { rows } = get();
            let updatedRows: GridFormRowState[];

            if (!id) {
                // Remove all selected rows
                updatedRows = rows.filter(row => !row.checked);
            } else if (Array.isArray(id)) {
                updatedRows = rows.filter(row => !id.includes(row.id));
            } else {
                updatedRows = rows.filter(row => row.id !== id);
            }

            // Reindex rows
            const reindexedRows = updatedRows.map((row, index) => ({
                ...row,
                index: index + 1
            }));

            set({
                rows: reindexedRows,
                allRowsSelected: false,
                selectedRowsCount: 0,
                expandedRow: null,
            });
        },

        selectRow: ({ selectAll, id }) => {
            const { rows } = get();

            if (selectAll) {
                const allSelected = rows.length > 0 && rows.every(row => row.checked);
                const updatedRows = rows.map(row => ({ ...row, checked: !allSelected }));
                const selectedCount = !allSelected ? rows.length : 0;

                set({
                    rows: updatedRows,
                    allRowsSelected: !allSelected,
                    selectedRowsCount: selectedCount,
                });
            } else if (id) {
                const updatedRows = rows.map(row =>
                    row.id === id ? { ...row, checked: !row.checked } : row
                );
                const selectedCount = updatedRows.filter(row => row.checked).length;
                const allSelected = selectedCount === rows.length && rows.length > 0;

                set({
                    rows: updatedRows,
                    allRowsSelected: allSelected,
                    selectedRowsCount: selectedCount,
                });
            }
        },

        setValue: ({ name, value, id }) => {
            const { rows } = get();

            const updatedRows = rows.map(row => {
                if (id && row.id !== id) return row;

                const field = row.fields[name];

                if (!field) {
                    return row


                }

                return {
                    ...row,
                    fields: {
                        ...row.fields,
                        [name]: {
                            ...field,
                            value,
                            hasError: false,
                            error: "",
                        }
                    },
                    values: {
                        ...row.values,
                        [name]: value
                    }
                };
            });


            set({ rows: [...updatedRows] });
        },

        setError: ({ id, name, message }) => {
            const { rows } = get();

            const updatedRows = rows.map(row => {
                if (row.id === id) {
                    const field = row.fields[name];
                    if (field) {
                        return {
                            ...row,
                            fields: {
                                ...row.fields,
                                [name]: {
                                    ...field,
                                    hasError: true,
                                    error: message,
                                }
                            },
                            errors: {
                                ...row.errors,
                                [name]: message
                            }
                        };
                    }
                }
                return row;
            });

            set({ rows: updatedRows });
        },

        setExpandedRow: (row) => {
            set({ expandedRow: row });
        },

        getValues: () => {
            const { rows } = get();
            return rows.map(row => {
                const rowValues: GridFormValues = {};
                Object.keys(row.fields).forEach(key => {
                    rowValues[key] = row.fields[key].value;
                });
                return rowValues;
            });
        },

        validateField: ({ name, id }) => {
            const { fields, rows, getValues } = get();
            let message = "";
            let hasError = false;

            const field = getFields(fields).find(f => f.name === name);
            const row = rows.find(r => r.id === id);

            if (!field || !row) {
                return { message, hasError };
            }
            const values = getValues()[row.index - 1] || {};;
            const required = field.requiredOn ? field.requiredOn(values) : field.required;
            const isEmpty = (value: FieldValue) => {
                if (value === null || value === undefined) return true;
                if (typeof value === 'string') return value.trim() === '';
                if (Array.isArray(value)) return value.length === 0;
                return false;
            };

            if (required && isEmpty(values?.[name])) {
                message = "This field is required";
                hasError = true;
            }

            return { message, hasError };
        },

        validateAll: () => {
            const { rows, setError } = get();
            let hasError = false;

            rows.forEach(row => {
                Object.keys(row.fields).forEach(fieldName => {
                    const field = row.fields[fieldName].field;
                    const { message, hasError: fieldError } = get().validateField({
                        name: field.name,
                        id: row.id
                    });

                    if (fieldError) {
                        hasError = true;
                        setError({ id: row.id, name: field.name, message });
                    }
                });
            });

            return !hasError;
        },

        clearStore: () => {
            set({
                fields: [],
                rows: [],
                expandedRow: null,
                // dataform: null,
                allRowsSelected: false,
                selectedRowsCount: 0,
            });
        },
    }))
);



// Custom hook to access store
const useGridForm = () => {
    const context = useContext(GridFormContext);
    if (!context) {
        throw new Error('useGridForm must be used within GridFormProvider');
    }
    return context.store;
};
// Header columns calculation
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


interface GridFormProviderProps {
    children: React.ReactNode;
    control?: TypeDFStore | null;
    fields: TypeField[];
    values?: GridFormValues[];
    onChange?: (values: GridFormValues[]) => void;
    addGrid?: (store: TypeGridFormStore) => void;
}

type TypeGridFormContext = { store?: TypeGridFormStore | null, }
const GridFormContext = createContext<TypeGridFormContext>(null);



const GridFormProvider: React.FC<GridFormProviderProps> = (props) => {
    const store = gridFormStore();

    useEffect(() => {

        const unsubscribe = gridFormStore.subscribe(
            (updated, prev) => {
                const { rows, fields } = updated;
                if (rows?.length && fields?.length) {

                    // Field level onChange - use the current store instance
                    rows.forEach((row) => {
                        Object.keys(row.fields).forEach((fieldName) => {
                            const prevValue = prev.rows.find(r => r.id === row.id)?.fields[fieldName]?.value;
                            const newValue = row.fields[fieldName]?.value;

                            if (prevValue !== newValue) {
                                const field = fields.find(f => f.name === fieldName);
                                // console.log("onChange called ",
                                //     {
                                //         name: field.name,
                                //         index: row.index,
                                //         value: row.fields[fieldName]?.value,
                                //     }
                                // )
                                // console.log(row.values)
                                // Pass the current store instance
                                field?.onChange?.({
                                    "grid": updated,
                                    "name": field.name,
                                    "index": row.index,
                                    "dataform": updated.control
                                });
                            }
                        });
                    });
                }
            }
        );
        return unsubscribe;

    }, [props.onChange]);

    useEffect(() => {
        store.init(props.fields, props.values, props.control);
    }, [props.fields, props.values])

    // useEffect(() => {
    //     props.addGrid?.(store);
    // }, [])

    // if (!store.fields) return null;
    return (
        <GridFormContext.Provider value={{ store }}>
            {props.children}
        </GridFormContext.Provider>
    );
};


const GridFormHeader = () => {
    const { fields, allRowsSelected, selectRow } = useGridForm();
    const { styles, columns } = getHeaderColumns(fields);

    return (
        <header className="border-b bg-gray-200" >
            <div className="grid items-center h-10" style={styles} >
                <div className="px-3 py-3 flex items-center justify-center border-r border-gray-300 h-full" >
                    <Checkbox
                        onCheckedChange={() => selectRow({ selectAll: true })}
                        checked={allRowsSelected}
                    />
                </div>

                < div className="px-3 flex items-center justify-center border-r border-gray-300 h-full" >
                    <span className="text-sm font-medium" > No.</span>
                </div>

                {
                    columns.map((field) => (
                        <div
                            key={field.name}
                            className={
                                cn(
                                    "px-3 py-2 h-full flex items-center overflow-hidden border-r border-gray-300",
                                )
                            }
                        >
                            <div className="flex items-center min-w-0" >
                                <span className="text-sm font-medium truncate" > {field.label} </span>
                                {field.required && <span className="text-red-500 ml-1 shrink-0">* </span>}
                            </div>
                        </div>
                    ))
                }

                <div className="px-3 flex items-center justify-center h-full" >
                    <SettingsIcon className="size-4 text-gray-600" />
                </div>
            </div>
        </header>
    );
};


const GridFormBody = () => {
    const store = useGridForm();
    const { fields, rows, selectRow, expandedRow, setExpandedRow } = store;
    const { columns, styles } = getHeaderColumns(fields);

    if (!rows?.length) {
        return (
            <div className="py-8 flex justify-center" >
                <div className="flex flex-col items-center" >
                    <FileTextIcon className="w-12 h-12 mb-2" />
                    <div className="text-sm" > No data available </div>
                    < div className="text-xs" > Click "Add Row" to get started </div>
                </div>
            </div>
        );
    }

    return (
        <main className="divide-y divide-gray-200" >
            {
                rows.map((row) => (
                    <div
                        key={row.id}
                        style={styles}
                        className="grid items-center min-h-[2.5rem] border-b border-gray-200 last:border-b-0"
                    >
                        <div className="px-3 py-2 flex items-center justify-center border-r border-gray-200 h-full" >
                            <Checkbox
                                onCheckedChange={() => selectRow({ id: row.id })}
                                checked={row.checked}
                            />
                        </div>

                        < div className="px-3 py-2 flex items-center justify-center border-r border-gray-200 h-full" >
                            <span className="text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center" >
                                {row.index}
                            </span>
                        </div>

                        {
                            columns.map((field, colIndex) => (
                                <div
                                    key={colIndex}
                                    className={
                                        cn(
                                            "h-full flex items-center border-r border-gray-200",
                                            field.type === "checkbox" && "justify-center"
                                        )
                                    }
                                >
                                    <Field
                                        field={field}
                                        state={row}
                                        grid={store}
                                        gridUpdate={true}
                                    />
                                </div>
                            ))}

                        <div className="px-3 flex items-center justify-center h-full" >
                            <button
                                type="button"
                                onClick={() => setExpandedRow(row)}
                                className="p-1.5 rounded-full transition-all duration-150 cursor-pointer opacity-70 hover:opacity-100"
                                title="Edit row"
                            >
                                <PencilIcon className="size-4" />
                            </button>
                        </div>
                    </div>
                ))}
            {expandedRow && <MiniForm form={store} fields={fields} state={expandedRow} />}
        </main>
    );
};

const GridFormFooter = () => {
    const { addRow, removeRow, rows, selectedRowsCount } = useGridForm();
    const selectedRows = rows.filter(row => row.checked);

    return (
        <div className="flex items-center" >
            <div className="flex gap-2 items-center" >
                {selectedRowsCount > 0 && (
                    <Button
                        variant="destructive"
                        onClick={() => removeRow(selectedRows.map(row => row.id))}
                    >
                        <Trash2Icon />
                        Delete
                    </Button>
                )}

                <Button onClick={() => addRow()}> Add Row </Button>
            </div>
        </div>
    );
};



type GridFormProps = {
    fields: TypeField[];
    gridContentClass?: string;
    values?: GridFormValues[];
    onChange?: (values: GridFormValues[]) => void;
    control?: TypeDFStore;
    className?: string;
    addGrid?: (store: TypeGridFormStore) => void;
};

const GridForm: React.FC<GridFormProps> = (props) => {
    // const hasError = false;
    return (
        <GridFormProvider
            fields={props.fields}
            onChange={props.onChange}
            addGrid={props.addGrid}
            values={props.values}
            control={props.control}
        >
            <div className="" >
                <div className={
                    cn(
                        "border rounded-md mb-4",
                        props.gridContentClass,
                        // hasError ? "ring-destructive ring-2" : ""
                    )
                }>
                    <GridFormHeader />
                    < GridFormBody />
                </div>
                < GridFormFooter />
            </div>
        </GridFormProvider>
    );
};



export { GridForm };


export const Demo = () => {
    function calculateTotal(args: {
        grid: TypeGridFormStore;
        name: string;
        index: number;
        dataform?: TypeDFStore;
    }) {


        args.grid.rows.forEach((row) => {
            const amount = decimal(row.values.quantity) * decimal(row.values.rate);
            args.grid.setValue({ id: row.id, name: "amount", value: amount });
        });


    }

    const fields: Array<TypeField> = [
        {
            name: "item",
            label: "Item",
            getOptions: async () => {
                return
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
            name: "quantity",
            label: "Quantity",
            type: "number",
            onChange: (args) => {
                calculateTotal(args);
            },
            defaultValue: 1
        },
        {
            name: "uom",
            label: "UOM",
            type: "select",
            defaultValue: "pcs",
            options: [
                { label: "PCs", value: "pcs" },
                { label: "Nos", value: "nos" },
            ],
        },

        {
            name: "rate",
            label: "Rate",
            type: "decimal",
            onChange: (args) => {
                calculateTotal(args);
            },
        },
        { name: "amount", label: "Amount", type: "decimal", readOnly: true }
    ]

    const values: GridFormValues[] = [
        {
            "item": {
                "label": "Viper V3 Pro Wireless Esports Gaming Mouse: Symmetrical - 54g Lightweight - 8K Polling - 35K DPI Optical Sensor - Gen3 Optical Switches - 8 Programmable Buttons - 95 Hr Battery - Black",
                "value": "c3274622-227b-4dae-84be-2ce9387a2316",
            }, "quantity": 1, "rate": 100,
        },
    ]


    return (
        <div className="max-w-6xl mx-auto px-2 py-16">
            <GridForm fields={fields} values={values} />
        </div>
    )
}