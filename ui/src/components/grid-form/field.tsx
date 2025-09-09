/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import type { GridFormContextType, GridFormRowState, TypeField } from "./types";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { AutoComplete, type OptionType } from "../ui/autocomplete";
import type { TypeFieldValue } from "./types"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { cn } from "../../utils/index";
import { DatePicker } from "../ui/date-picker";
import type { TypeGridFormStore } from "./zustand-grid-form";


export interface FieldProps {
    field: TypeField;
    onChange?: (value: TypeFieldValue) => void;
    onBlur?: (value: TypeFieldValue) => void;
    gridUpdate?: boolean;
    state: GridFormRowState;
    grid: TypeGridFormStore;
}



const Field: React.FC<FieldProps> = (props) => {
    const { field, onBlur, state, grid, } = props;

    const [className, setClassName] = useState<string>("h-full w-full shadow-none border-none rounded-none");
    const fieldState = state.fields[field.name];
    const value = fieldState.value;


    const handleChange = (newValue: TypeFieldValue) => {
        grid.setValue({ name: field.name, value: newValue, id: state.id });
        // field.onChange?.({ "grid": grid, "name": field.name, "index": state.index, dataform: grid.control });
    };


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
                id={state.id}
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
                    onBlur={() => onBlur?.(value)}
                    id={state.id}
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
            // renderOption={field.renderOption}
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
            id={state.id}
            readOnly={field.readOnly}
            className={cn("border-none shadow-none", className)}
            type={field.type}
            onChange={(event) => handleChange?.(event.target.value)}
            onBlur={(event) => onBlur?.(event.target.value)}
            defaultValue={value as string || ""}
            value={value as string}
            placeholder={field.placeholder}
        />);

};

export { Field }