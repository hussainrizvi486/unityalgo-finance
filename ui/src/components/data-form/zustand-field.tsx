import React, { useCallback, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { AutoComplete, type OptionType } from "@/components/ui/autocomplete";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/utils";
import type { FieldValue, TypeField } from "./types";
import { GridForm, } from "./components/grid-form/index";
import type { TypeDFStore } from "./zustand-version";

interface FieldProps {
    field: TypeField;
    store: TypeDFStore;
}


const Field: React.FC<FieldProps> = React.memo((props) => {
    const { field, store } = props;

    const state = store.state[field.name];

    const classNames = useMemo(() => {
        return state?.hasError ? "ring ring-offset-3 ring-destructive" : "";
    }, [state?.hasError]);

    const handleChange = useCallback((value: FieldValue) => {
        store.setValue?.({ name: field.name, value });
    }, [store, field.name]);

    const handleBlur = useCallback(() => {
        field.onBlur?.(state?.value);
    }, [field, state?.value]);




    const { dependsOn, requiredOn } = field;

    if (dependsOn && !dependsOn(store.getValues() || {})) {
        return <></>
    }


    const required: boolean = Boolean(requiredOn ? requiredOn(store.getValues()) : field.required)

    if (field.type === "checkbox") {
        return (
            <div className="mb-4">
                <div className="flex items-center   gap-2">
                    <FieldInput
                        field={field}
                        className={classNames}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={state?.value}
                    />
                    <label htmlFor={field.name} className="text-sm block font-medium">{field.label} </label>
                </div>
                {state?.hasError && (
                    <span className="text-red-500 text-xs mt-1">{state.error}</span>
                )}
            </div>
        )
    }
    if (field.type == "table") {
        return <div className="mb-4">
            <GridForm
                control={store}
                grid={store.grids[field.name]}
            // fields={field.fields}
            // values={state.value as Record<string, FieldValue>[] || []}
            // gridContentClass={classNames}
            // onChange={(values) => {
            //     handleChange(values);
            // }}
            // control={store}
            />
        </div>
    }
    return (
        <div className="mb-4 ">
            <label htmlFor={field.name} className="text-sm block mb-2 font-medium">
                {field.label} {required ? <span className="text-destructive">*</span> : <></>}
            </label>

            <FieldInput
                field={field}
                className={classNames}
                onBlur={handleBlur}
                onChange={handleChange}
                value={state?.value}
            />


            {state?.hasError && (
                <span className="text-red-500 text-xs mt-1">{state.error}</span>
            )}
        </div>
    )
});





export interface DFInputFieldProps {
    field: TypeField,
    className: string,
    onChange: (value: FieldValue) => void;
    onBlur: () => void;
    value: FieldValue;
}


const FieldInput: React.FC<DFInputFieldProps> = React.memo((props) => {
    const { field, className, onChange, onBlur, value } = props;

    if (field.type == "date") {
        return <DatePicker onChange={onChange} name={field.name} value={value as Date} />
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
            readOnly={field.readOnly}
            placeholder={field.placeholder}
        />
    )
});

export { Field };
