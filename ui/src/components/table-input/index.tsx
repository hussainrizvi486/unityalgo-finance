import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FileText, Trash2, Settings as SettingsIcon, Pencil as PencilIcon, Satellite, Trash2Icon } from "lucide-react";
import type { TypeField } from "../data-form/types";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import type { FieldValue } from "../data-form/types";
import { cn } from "../../utils/index";
import { Dialog, DialogContent } from "../ui/dialog";
import { Field } from "./field";
import type { TIContextType, TableInputState, TableInputValues, TIFieldState, TFRowState } from "./types";
// import { Form as EditForm } from "./mini-form";
import { ColorWheelIcon } from "@radix-ui/react-icons";


function getColumnsCSS(count: number, minWidth: string = '200px'): React.CSSProperties {
    const styles = `3rem 3rem repeat(${count}, minmax(${minWidth}, 1fr)) 2rem`;
    return { gridTemplateColumns: styles };
}


const TIContext = React.createContext<TIContextType | null>(null);

interface ProviderProps {
    children: React.ReactNode;
    values: Array<Record<string, FieldValue>> | null;
    fields: Array<TypeField>;
}


function getInitialState(fields: Array<TypeField>, values: TableInputValues): TableInputState {
    const state: TableInputState = [];

    values?.forEach((row, index) => {
        const stateRow: TFRowState = {
            id: crypto.randomUUID(),
            index: index + 1,
            fields: {},
        }

        fields.forEach((field) => {
            const value = row[field.name] || field.defaultValue || null;
            stateRow.fields[field.name] = {
                index: index + 1,
                value: value,
                error: "",
                hasError: false,
                field: field,
            };
        })
        state.push(stateRow);
    })
    return state
}

const ContextProvider: React.FC<ProviderProps> = (props) => {
    const values: TableInputValues = React.useMemo(() => props.values || [], [props.values]);
    const fields = useMemo(() => props.fields, [props.fields]);

    const [state, setState] = useState<TableInputState>([]);
    const [editingRow, setEditingRow] = useState<number | null>(null);


    const setValue = useCallback((params: { name: string; value: FieldValue; id: string }) => {
        const { id, value, name } = params;

        setState(prev => {
            const rowIndex = prev.findIndex(row => row.id === id);
            if (rowIndex === -1) return prev;
            const row = prev[rowIndex];
            if (row.fields[name]?.value === value) return prev;

            const newState = [...prev];
            newState[rowIndex] = {
                ...row,
                fields: {
                    ...row.fields,
                    [name]: {
                        ...row.fields[name],
                        value: value,
                        hasError: false,
                        error: "",
                    }
                }
            };

            return newState;
        });
    }, []);

    const setRowCheck = useCallback((id?: string, selectAll?: boolean) => {
        console.log(id, selectAll);
        setState(prev => {
            if (selectAll) {
                const allSelected = prev.length > 0 && prev.every(row => row.checked);
                return prev.map(row => ({ ...row, checked: !allSelected }));
            }

            if (!id) return prev;

            return prev.map(row =>
                row.id === id
                    ? { ...row, checked: !row.checked }
                    : row
            );
        });
    }, []);


    const addRow = (values?: Record<string, FieldValue>) => {
        const index = state.length + 1;
        const row = {
            fields: {},
            index: index,
            id: crypto.randomUUID(), checked: false
        } as TFRowState;

        fields.forEach((field) => {
            const value = values?.[field.name] || field?.defaultValue;
            row.fields[field.name] = {
                index: index,
                value: value,
                hasError: false,
                field: field,
                error: "",
            };
        })

        setState((prev) => {
            return [...prev, row];
        });
    };
    const deleteRow = (id?: string | string[]) => {
        console.log("deleteRow", id);

        setState((prev) => {
            let updated: TFRowState[];

            if (!id) {
                updated = prev.filter(row => !row.checked);
            } else if (Array.isArray(id)) {
                updated = prev.filter(row => !id.includes(row.id));
            } else {
                updated = prev.filter(row => row.id !== id);
            }
            return updated.map((row, index) => ({ ...row, index: index + 1 }));
        });

        setEditingRow(null);
    };


    const getValues = (): TableInputValues => {
        const values: TableInputValues = [];
        state.forEach((row) => {
            const rowValues: Record<string, FieldValue> = {};
            Object.keys(row.fields).forEach((key) => {
                const { fields } = row;
                const value = fields[key].value;
                rowValues[key] = value;
            })
            values.push(rowValues);
        });
        return values;
    }

    const allRowsSelected = useMemo(() =>
        state.length > 0 && state.every(row => row.checked),
        [state]
    );

    useEffect(() => {
        setState(getInitialState(fields, values));
    }, [fields, values])


    const contextValue = {
        setRowCheck, setValue, getValues, state, editingRow, setEditingRow, deleteRow, fields, values: props.values, addRow, allRowsSelected
    }


    console.warn(state)
    return (
        <TIContext.Provider value={contextValue} >
            {props.children}
        </TIContext.Provider>
    )
}


const useTIContext = () => {
    const ctx = React.useContext(TIContext)
        ;
    if (!ctx) {
        throw new Error("useContext must be used within a ContextProvider");
    }
    return ctx;
}

interface TableInputProps {
    values?: Array<Record<string, FieldValue>> | null;
    fields: Array<TypeField>;
}

const TableInput: React.FC<TableInputProps> = (props) => {
    return (
        <ContextProvider values={props.values} fields={props.fields}>
            <TableInputMain />
        </ContextProvider>
    )
}



const Header: React.FC = () => {
    const ctx = useTIContext()
    const { fields, allRowsSelected } = ctx;
    return (
        <header className="border-b bg-gray-200">
            <div
                className="grid items-center h-10"
                style={getColumnsCSS(fields.length)}
            >
                <div
                    className="px-3 py-3 flex items-center justify-center border-r border-gray-200 h-full">
                    <Checkbox onCheckedChange={() => ctx.setRowCheck(undefined, true)} checked={allRowsSelected} />
                </div>

                <div className="px-3 flex items-center justify-center border-r border-gray-200">
                    <span className="text-sm font-medium">No.</span>
                </div>

                {fields.map((field) => (
                    <div key={field.name} className="px-3 py-2 border-r border-gray-200 last:border-r-0">
                        <div className="text-sm ">
                            <span className="font-medium">{field.label}</span>
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </div>
                    </div>
                ))}

                <div className="px-3 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600"><SettingsIcon className="size-4" /></span>
                </div>
            </div>
        </header>
    );
}

const TableInputMain = () => {
    const context = useTIContext();
    const { addRow, editingRow, state, deleteRow } = context;
    function handleAddRow() { addRow(); }

    const [openRow, setOpenRow] = useState<boolean>(false);


    useEffect(() => {
        if (editingRow !== null) {
            setOpenRow(true);
            return
        }
        setOpenRow(false);
    }, [editingRow])


    return (
        <>
            <div className="border border-gray-200 rounded-lg overflow-hidden  mb-4">
                <Header />

                <div className="w-full">
                    <TableInputData />
                </div>
            </div>

            <div className="flex items-center">
                <div className="flex gap-2 items-center">
                    {state.filter(row => row.checked).length > 0 ?
                        <Button variant="destructive"
                            onClick={() => deleteRow(state.filter(row => row.checked).map(row => row.id))}>
                            <Trash2Icon />
                            Delete
                        </Button>

                        : <></>}

                    <Button onClick={handleAddRow} >Add Row</Button>
                </div>
            </div>

            {/* <Dialog open={openRow} onOpenChange={(value) => {
                if (!value) {
                    context.setEditingRow(null);
                }
                setOpenRow(value)
            }}>
                <DialogContent className="sm:max-w-4xl w-full"  >
                    <EditForm />
                </DialogContent>
            </Dialog > */}
        </>
    )
}

const TableInputData: React.FC = () => {
    const context = useTIContext();

    const { fields } = context;
    const { setEditingRow, state, setRowCheck } = context;

    function handleEditRow(id: string) {
        setEditingRow(id);
    }


    if (!state?.length) {
        return <>   <div className="py-8 flex justify-center">
            <div className="flex flex-col items-center text-gray-500">
                <FileText className="w-12 h-12 mb-2" />
                <div className="text-sm">No data available</div>
                <div className="text-xs">Click "Add Row" to get started</div>
            </div>
        </div></>
    }


    return (
        <div className="divide-y divide-gray-200">
            <div>
                {state.map((row) => {
                    const rowState = state.find(i => i.id === row.id);
                    if (!rowState) return <></>;

                    return (
                        <div key={row.id}
                            style={getColumnsCSS(fields.length)}
                            className={cn(
                                "grid items-center transition-colors duration-150 ease-in-out border-b",
                            )}
                        >

                            <div
                                className="px-3 py-2 flex items-center justify-center border-r border-gray-200 h-full">
                                <Checkbox onCheckedChange={() => setRowCheck(row.id)} checked={rowState.checked} />
                            </div>

                            <div
                                className="px-3 py-2 flex items-center justify-center border-r border-gray-200 h-full">
                                <span className="text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center">
                                    {row.index}
                                </span>
                            </div>

                            {fields.map((field, colIndex) => {
                                return (
                                    <div
                                        key={colIndex}
                                        className={cn(
                                            "border-r border-input last:border-r-0 h-full flex items-center",
                                            field.type === "checkbox" && "justify-center"
                                        )}>
                                        <Field field={field} state={rowState} ctx={context} gridUpdate={true} />
                                    </div>
                                )
                            })}

                            <div className="px-3 flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => handleEditRow(row.id)}
                                    className=" p-1.5 rounded-full transition-all duration-150 cursor-pointer opacity-70"
                                    title="Edit row"
                                >
                                    <PencilIcon className="size-4" />
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}


export { TableInput, useTIContext }