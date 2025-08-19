import React, { useCallback, useMemo } from "react";
import type { TypeField, FieldValue, DFContextValue as DFContext } from "../types";
import { cn } from "../../../utils";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { AutoComplete } from "../../ui/autocomplete";
// import { Column, Section } from "./components/layout";
import type { FieldValue, FormValues, FormState, TypeField } from "../types";
import { TableInput } from "../../table-input/index";
import { Button } from "../ui/button";
import { DatePicker } from "../../ui/date-picker";

interface FieldProps {
    field: TypeField;
    form: DFContext;
}


const Field: React.FC<FieldProps> = React.memo((props) => {
    const { field, form } = props;
    const state = form.state[field.name];
    const value = state[field.name]?.value;

    console.log(field.name, value, state);

    const classNames = useMemo(() => {
        return state?.hasError ? "ring ring-offset-3 ring-destructive" : "";
    }, [state?.hasError]);

    const handleChange = useCallback((value: FieldValue) => {
        form?.setValue?.(field.name, value);
    }, [form, field.name]);

    const handleBlur = useCallback(() => {
        field.onBlur?.(state?.value);
    }, [field, state?.value]);


    const { dependsOn, requiredOn } = field;

    if (dependsOn && !dependsOn(form.getValues())) {
        return <></>
    }


    const required: boolean = Boolean(requiredOn ? requiredOn(form.getValues()) : field.required)

    if (field.type === "checkbox") {
        return (
            <div className="mb-4">
                <div className="flex items-center gap-2">
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





interface DFInputFieldProps {
    field: TypeField,
    className: string,
    onChange: (value: FieldValue) => void;
    onBlur: () => void;
    value: FieldValue;
}


const FieldInput: React.FC<DFInputFieldProps> = React.memo((props) => {
    const { field, className, onChange, onBlur, value } = props;

    if (field.type == "date") {
        return <DatePicker />
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
                value={value}
            />
        )
    }

    // if (field.type == "custom" && field.component) {
    //     return field.component({ form: useDFContext });
    // }

    if (field.type == "table" && field?.fields?.length) {
        return <TableInput fields={field.fields} />;
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

export { Field };
