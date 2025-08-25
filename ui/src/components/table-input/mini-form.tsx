import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { XIcon } from "lucide-react";
import type { TypeField, GridFormContextType, TypeFieldValue, GridFormRowState } from "./types";

import { Field, type FieldProps } from "./field";
import { Section, Column } from "../data-form/components/layout";
import type { TypeDFLayout, TypeDFSection } from "../data-form/types";
import type { DFInputFieldProps } from "../data-form/components/field";
import { DatePicker } from "../ui/date-picker";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AutoComplete, type OptionType } from "../ui/autocomplete";
import { Input } from "../ui/input";
import { cn } from "../../utils";


interface MiniFormProps {
    fields: TypeField[];
    form: GridFormContextType;
    state: GridFormRowState;
}


const buildLayout = (fields: TypeField[]) => {
    const layout: TypeDFLayout = [];
    const sections: TypeDFSection[] = fields.filter(field => field.sectionBreak)

    if (!sections.length) {
        const section: TypeDFSection = { label: '' };
        const columns: TypeField[][] = [[]];
        let colIndex = 0;

        fields.forEach(field => {
            if (field.columnBreak) {
                colIndex += 1;
                columns.push([]);
            }
            else {
                columns[colIndex].push(field);
            }
        })

        section.columns = columns;
        layout.push(section);
        return layout;
    }

    sections.forEach(section => {
        const startIndex = fields.findIndex(v => v.name === section.name);
        const columns: TypeField[][] = [[]];
        let colIndex = 0;

        for (let i = startIndex + 1; i < fields.length; i++) {
            const field = fields[i];
            if (field.sectionBreak) break;

            if (field.columnBreak === true) {
                colIndex += 1;
                columns.push([]);
            } else {
                columns[colIndex].push(field);
            }
        }

        layout.push({
            columns: columns,
            label: section.label || "",
            name: section.name || "",
        });
    });

    return layout;
}


export const MiniForm: React.FC<MiniFormProps> = ({ fields, form, state }) => {
    const formLayout = buildLayout(fields);

    return (
        <Dialog open={form.expandedRow ? true : false} onOpenChange={() => form.setExpandedRow(null)} >
            <DialogContent className="sm:max-w-4xl max-w-5xl w-full max-h-[90vh] overflow-auto top-[15%] translate-y-[-15%]">
                <div>
                    <header className="flex justify-between items-center mb-4 px-3">
                        <div className="text-lg font-semibold">Edit row #{state.index}</div>
                        <div>
                            <DialogClose className="cursor-pointer hover:bg-secondary transition-all rounded-full p-2 ">
                                <XIcon className="size-6" />
                            </DialogClose>
                        </div>
                    </header>
                    <main>
                        <div>
                            {formLayout.map((section, i) => (
                                <Section key={i} label={section.label || ""}>
                                    {
                                        section?.columns?.map((column, j) => (
                                            <Column key={j}>
                                                {column.map((field, k) => (
                                                    <Field key={k} field={field} state={state} form={form} />
                                                ))}
                                            </Column>
                                        ))
                                    }
                                </Section>
                            ))}
                        </div>
                    </main>

                </div>

            </DialogContent>
        </Dialog>
    )
}
interface FieldProps {
    field: TypeField;
    onChange?: (value: TypeFieldValue) => void;
    state: GridFormRowState;
    onBlur?: (value: TypeFieldValue) => void;
    form: GridFormContextType;
    // gridUpdate?: boolean,
    // state: TFRowState;
    // ctx: TIContextType
}

const Field: React.FC<FieldProps> = ({ field, state, form }) => {

    const fieldState = state.fields[field.name];

    const handleChange = (value) => {
        form.setValue({ name: field.name, value: value, id: state.id });
    }

    const handleBlur = () => {
        // form.setValue({ name: field.name, value: value, id: state.id });
    }


    return (
        <div className="mb-4">
            <div >
                <label className="block mb-2 font-medium">{field.label}</label>
                <FieldInput field={field} onChange={handleChange} onBlur={handleBlur} value={fieldState.value} />
            </div>
        </div>
    )
}


const FieldInput: React.FC<DFInputFieldProps> = React.memo((props) => {
    const { field, className, onChange, onBlur, value } = props;

    if (field.type == "date") {
        return <DatePicker onChange={onChange} name={field.name} value={value} />
    }

    if (field.type == "checkbox") {
        return (<Checkbox
            name={field.name}
            id={field.name}
            checked={Boolean(value)}
            onBlur={onBlur}
            onCheckedChange={(checked) => onChange(checked)}
        />)
    }


    if (field.type == "textarea") {
        return (
            <textarea name={field.name} className={cn("w-full text-sm p-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary", className)} rows={6}
                onChange={(event) => onChange(event.target.value)}
            >
                {value as string || ""}
            </textarea>
        )
    }

    if (field.type === "select") {
        return (
            <Select
                value={value as string || ""}
                onValueChange={(val) => onChange(val)}
            >
                <SelectTrigger className={cn(className)} onBlur={onBlur}>
                    <SelectValue placeholder={field.placeholder || "Select"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {field.options?.map((option) => (
                            <SelectItem className="text-sm" key={option.value} value={option.value} >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        );
    }

    if (field.type == "autocomplete") {
        return (
            <AutoComplete label={field.label} className={className} onChange={onChange} getOptions={field.getOptions} renderOption={field.renderOption}
                placeholder={field.placeholder}
                value={value as OptionType}
            />
        )
    }

    return (
        <Input
            name={field.name}
            className={className}
            type={field.type}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onBlur}
            value={value as string || ""}
            placeholder={field.placeholder}
        />
    )
});
