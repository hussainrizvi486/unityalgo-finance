/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import type { FieldType, TypeField, TypeOption } from "@/components/data-form/types";
import type { FieldValue } from "react-hook-form";
import type { TypeDFStore, TypeGridFormStore } from "../../zustand-version";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AutoComplete, type OptionType } from "@/components/ui/autocomplete";
import { DatePicker } from "@/components/ui/date-picker";
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileTextIcon, PencilIcon, ProportionsIcon, SettingsIcon, Trash2Icon } from "lucide-react";
import { cn } from "@/utils";


interface TypeGridField<T extends FieldType = FieldType> {
    name: string;
    label: string;
    type: FieldType;
    width?: number;

    required?: boolean;
    defaultValue?: FieldValue<T>;

    options?: TypeOption[];
    placeholder?: string;

    readOnly?: boolean
    hidden?: boolean

    fields?: TypeGridField[];

    // onChange?: (params: { grid: TypeGridFormStore; name: string; index: number, dataform: TypeDFStore }) => void;
    // onBlur?: (params: { grid: TypeGridFormStore; name: string; index: number, dataform: TypeDFStore }) => void;

    getOptions?: (query?: string) => Promise<TypeOption[]>;

    // requiredOn?: (values: Record<string, FieldValue>) => boolean;
    // readOnlyOn?: (values: Record<string, FieldValue>) => boolean;
    // dependsOn?: (values: Record<string, FieldValue>) => boolean;

}

// const getFields = (fields: TypeGridField[]) => {
//     return fields.filter(field => !field.columnBreak && !field.sectionBreak);
// };

const getHeaderColumns = (fields: TypeGridField[]) => {
    const availableWidth = 9;
    const columns: TypeGridField[] = [];
    let utilizedWidth = 0;

    fields.forEach((field) => {
        const width = field.width || 1;

        if (utilizedWidth + width <= availableWidth && !field.hidden
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


interface GridCompProps {
    control: TypeDFStore;
    grid: TypeGridFormStore;
}

const GridFormHeader: React.FC<GridCompProps> = ({ control, grid }) => {
    const { selectRow } = control;
    const { fields, allRowsSelected } = grid;
    const { styles, columns } = getHeaderColumns(fields);

    return (
        <header className="border-b bg-gray-200" >
            <div className="grid items-center h-10" style={styles} >
                <div className="px-3 py-3 flex items-center justify-center border-r border-gray-300 h-full" >
                    <Checkbox
                        onCheckedChange={() => selectRow({ fieldname: grid.gridName, selectAll: true })}
                        checked={allRowsSelected}
                    />
                </div>

                <div className="px-3 flex items-center justify-center border-r border-gray-300 h-full" >
                    <span className="text-sm font-medium">No.</span>
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


const GridFormBody: React.FC<GridCompProps> = ({ control, grid }) => {
    const { fields, rows } = grid;
    const { selectRow } = control;
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
                rows.map((row, index) => (
                    <div
                        key={index}
                        style={styles}
                        className="grid items-center min-h-[2.5rem] border-b border-gray-200 last:border-b-0"
                    >
                        <div className="px-3 py-2 flex items-center justify-center border-r border-gray-200 h-full" >
                            <Checkbox
                                onCheckedChange={() => selectRow({ id: row.id, fieldname: grid.gridName })}
                                checked={row.checked}
                            />
                        </div>

                        < div className="px-3 py-2 flex items-center justify-center border-r border-gray-200 h-full" >
                            <span className="text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center" >
                                {row.index}
                            </span>
                        </div>

                        {columns.map((field, colIndex) => (
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
                                    handleChange={(value) => {
                                        control.setRowValue({
                                            fieldname: grid.gridName,
                                            rowId: row.id,
                                            name: field.name,
                                            value: value
                                        })
                                    }}
                                    value={row.fields?.[field.name].value as string}
                                />
                            </div>
                        ))}

                        <div className="px-3 flex items-center justify-center h-full" >
                            <button
                                type="button"
                                // onClick={() => setExpandedRow(row)}
                                className="p-1.5 rounded-full transition-all duration-150 cursor-pointer opacity-70 hover:opacity-100"
                                title="Edit row"
                            >
                                <PencilIcon className="size-4" />
                            </button>
                        </div>
                    </div>
                ))}

            {/* {expandedRow && <MiniForm form={store} fields={fields} state={expandedRow} />} */}
        </main>
    );
};

const GridFormFooter = ({ control, grid }) => {
    const { rows, selectedRowsCount } = grid;
    const { addRow, removeRow, } = control;
    const selectedRows = rows?.filter(row => row.checked);


    return (
        <div className="flex items-center" >
            <div className="flex gap-2 items-center" >
                {selectedRowsCount > 0 && (
                    <Button
                        variant="destructive"
                        onClick={() => removeRow(grid.gridName, selectedRows.map(row => row.id))}
                    >
                        <Trash2Icon />
                        Delete
                    </Button>
                )}

                <Button onClick={() => addRow(grid.gridName)}> Add Row </Button>
            </div>
        </div>
    );
};


interface GridFormProps {
    control: TypeDFStore;
    grid: TypeGridFormStore;
    gridContentClass?: string;
}

const GridForm: React.FC<GridFormProps> = (props) => {
    if (!props.grid && !props.control) return <></>;


    return (
        <>
            <div className={
                cn("border rounded-md mb-4", props.gridContentClass)
            }>
                <GridFormHeader control={props.control} grid={props.grid} />
                <GridFormBody control={props.control} grid={props.grid} />
            </div>
            <GridFormFooter control={props.control} grid={props.grid} />
        </>
    )
}

interface FieldProps {
    field: TypeField;
    handleChange: (value: string) => void;
    value: string;
}



const Field: React.FC<FieldProps> = (props) => {
    if (["column", "section"].includes(props.field.type)) return <></>;

    const { field } = props;


    const className = "h-full w-full shadow-none border-none rounded-none";
    const value = props.value;

    const handleChange = (value) => {
        props.handleChange(value);
    };

    // const [className, setClassName] = useState<string>("h-full w-full shadow-none border-none rounded-none");
    // const { field, onBlur, state, grid, } = props;
    // const fieldState = state.fields[field.name];
    // useEffect(() => {
    //     if (!fieldState?.hasError) {
    //         setClassName("h-full w-full shadow-none border-none rounded-none");
    //         return;
    //     }
    //     setClassName("shadow-none border-none rounded-none border-destructive ring-destructive/50 ring-[3px]");
    // }, [fieldState?.hasError]);

    if (field.type === "checkbox") {
        return (
            <Checkbox
                name={field.name}
                checked={Boolean(value)}
                onCheckedChange={(checked) => handleChange?.(checked)}
            />
        );
    }

    if (field.type === "select") {
        return (
            <Select
                value={value as string || ""}
                onValueChange={(val) => handleChange?.(val)}
            >
                <SelectTrigger className={cn("shadow-none border-none", className)}
                // onBlur={() => onBlur?.(value)}
                >
                    <SelectValue placeholder={field.placeholder || "Select"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {field.options?.map((option) => (
                            <SelectItem className="text-sm" key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        );
    }

    if (field.type === "autocomplete") {
        return (
            <AutoComplete
                label={field.label}
                className={cn("border-none shadow-none", className)}
                onChange={handleChange}
                options={field.options}
                value={value as OptionType}
                getOptions={field.getOptions}
            />
        );
    }

    if (field.type === "date") {
        return (
            <DatePicker onChange={handleChange} name={field.name} value={value as Date | null}
                className={cn("border-none shadow-none h-full", className)} />
        )
    }

    return (
        <Input
            name={field.name}
            // id={state.id}
            readOnly={field.readOnly}
            className={cn("border-none shadow-none", className)}
            type={field.type}
            onChange={(event) => handleChange?.(event.target.value)}
            defaultValue={value as string || ""}
            value={value as string}
            placeholder={field.placeholder}
        />);

};

export { GridForm };


