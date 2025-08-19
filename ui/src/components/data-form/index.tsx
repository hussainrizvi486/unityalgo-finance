import React, { useEffect, useState, useCallback, useMemo } from "react";
import { cn } from "../../utils";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AutoComplete } from "../ui/autocomplete";
import { Column, Section } from "./components/layout";
import type { FieldValue, FormValues, FormState, TypeField } from "./types";
import { TableInput } from "../table-input/index";
import { Button } from "../ui/button";
import { buildLayout } from "./utils.ts";
// import { FileJsonIcon } from "lucide-react";
import { Calendar } from "../ui/calender.tsx";
import { Field } from "./components/field.tsx";

type DFContextValue = {
    values: FormValues | null | undefined;
    fields: TypeField[];
    state: FormState;
    isValid?: boolean;
    onSave?: (values: FormValues) => void;
    submitForm?: () => void;
    title: string;
    triggerSave?: () => void;
    getValues: () => FormValues;
    setValue?: (name: string, value: FieldValue) => void;
    setError?: (name: string, hasError?: boolean, message?: string) => void;
}

const DFContext = React.createContext<DFContextValue>({
    title: "",
    getValues: () => ({}),
    values: {},
    fields: [],
    state: {},
});

const getFormFields = (fields: TypeField[]): TypeField[] => {
    return fields.filter(field => !field.columnBreak && !field.sectionBreak);
}

const getInitialState = (fields: TypeField[], values?: FormValues | null): FormState => {
    const state: FormState = {};
    fields.forEach((field) => {
        let value = values?.[field.name] || field.defaultValue || null;

        if (["number", "float", "currency", "decimal"].includes(field.type) && (value == null || value == undefined)) {
            value = 0; // Ensure numeric fields default to 0
        }

        if ((value == null || value == undefined) && field.type === "checkbox") {
            value = false; // Ensure checkbox defaults to false
        }

        state[field.name] = {
            value: value,
            hasError: false,
            error: "",
            field: field
        };
    })
    return state
}

interface DataFormProviderProps {
    children: React.ReactNode;
    fields: TypeField[];
    onSave?: (values: FormValues) => void;
    values?: FormValues | null;
    title: string

}

const isEmpty = (value: FieldValue): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (typeof value === 'number') return false;
    if (typeof value === 'boolean') return false;
    if (Array.isArray(value)) return value.length === 0;
    return false;
}

const DataFormProvider: React.FC<DataFormProviderProps> = ({ children, fields, values, onSave, title }) => {
    const formFields: Array<TypeField> = useMemo(() => getFormFields(fields), [fields]);
    const [state, setState] = useState<FormState>(getInitialState(formFields, values));
    const [isValid, setIsValid] = useState<boolean>(false);


    const getValues = useCallback((): FormValues => {
        const values: FormValues = {};
        Object.keys(state).forEach(key => values[key] = state[key].value);
        return values;
    }, [state]);

    const setValue = useCallback((name: string, value: FieldValue) => {
        setState((prev) => {
            if (prev[name]?.value === value) return prev;
            return {
                ...prev,
                [name]: { ...prev[name], value: value }
            };
        });
    }, []);

    const setError = useCallback((name: string, hasError: boolean = false, message: string = "") => {
        setState(prev => {
            const state = prev[name];
            if (state?.hasError === hasError && state?.error === message) {
                return prev;
            }

            return {
                ...prev,
                [name]: { ...state, hasError: hasError, error: message }
            };
        });
    }, []);

    const validateFieldType = useCallback((field: TypeField, value: FieldValue): { isValid: boolean; message: string } => {
        switch (field.type) {
            case "number":
                if (typeof value === 'string' && isNaN(Number(value))) {
                    return { isValid: false, message: `${field.label} must be a valid number` };
                }
                break;
            case "float":
            case "currency":
                if (typeof value === 'string' && (isNaN(parseFloat(value)) || !isFinite(parseFloat(value)))) {
                    return { isValid: false, message: `${field.label} must be a valid decimal number` };
                }
                break;
            case "date":
                if (value && !(value instanceof Date) && isNaN(Date.parse(value as string))) {
                    return { isValid: false, message: `${field.label} must be a valid date` };
                }
                break;
        }
        return { isValid: true, message: "" };
    }, []);

    const validateField = useCallback((name: string): boolean => {
        const field = fields.find(f => f.name === name);
        const fieldState = state[name];

        if (!field || !fieldState) return false;
        let hasError = false;
        let errorMessage = "";
        const isRequired = field.requiredOn ? field.requiredOn(getValues()) : field.required;

        if (isRequired && isEmpty(fieldState.value)) {
            hasError = true;
            errorMessage = `${field.label} is required`;
        }
        else if (!isEmpty(fieldState.value)) {
            const validationResult = validateFieldType(field, fieldState.value);
            hasError = !validationResult.isValid;
            errorMessage = validationResult.message;
        }

        if (!hasError && field.validate) {
            const customValidation = field.validate(fieldState.value);
            if (typeof customValidation === 'string') {
                hasError = true;
                errorMessage = customValidation;
            } else if (typeof customValidation === 'boolean' && !customValidation) {
                hasError = true;
                errorMessage = `${field.label} is invalid`;
            }
        }

        setError(name, hasError, errorMessage);
        return !hasError;
    }, [fields, state, isEmpty, validateFieldType, setError]);

    const handleSave = useCallback(() => {
        formFields.forEach(field => {
            validateField(field.name);
        });

        if (!isValid) {
            return;
        }

        const values = getValues();
        onSave?.(values);
    }, [formFields, validateField, isValid, getValues, onSave]);

    useEffect(() => {
        setIsValid(!Object.values(state).some(fieldState => fieldState.hasError));
    }, [state]);


    const submitForm = useCallback(() => {
        formFields.forEach(field => {
            validateField(field.name);
        });

        if (!isValid) {
            return;
        }

        const values = getValues();
        console.log("Submitting form with values:", values);
        onSave?.(values);
    }, [formFields, validateField, isValid, getValues, onSave]);

    const contextValue = useMemo(() => ({
        fields: fields,
        triggerSave: handleSave,
        getValues,
        setValue,
        submitForm,
        setError,
        values,
        state,
        title,
        isValid
    }), [fields, handleSave, getValues, setValue, setError, values, state, isValid, submitForm, title]);

    return (
        <DFContext.Provider value={contextValue}>
            {children}
        </DFContext.Provider>
    )
}

const useDFContext = () => {
    const context = React.useContext(DFContext);
    if (!context) {
        throw new Error("useDFContext must be used within a DataFormProvider");
    }
    return context;
}



const DataForm: React.FC = () => {
    const form = useDFContext();
    const formLayout = useMemo(() => buildLayout(form.fields), [form.fields]);

    return (<div>
        <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold">{form.title}</div>
            <div>
                <Button onClick={form.submitForm}>Save</Button>
            </div>
        </div>

        form values
        <div >

            {JSON.stringify(form.getValues(), null, 2)}
        </div>

        <div>

            {/* <Calendar /> */}
        </div>

        <div className="border border-input py-4 rounded-md" >
            {formLayout.map((section, index) => (
                <Section key={index} label={section.label || ""}>
                    {section.columns?.map(((col, k) => (
                        <Column key={k} >
                            {col.map((field) => (
                                <Field form={form} field={field} key={field.name} />
                            ))}
                        </Column>
                    )))}
                </Section>
            ))}

        </div>
    </div>)
}

const DFInput: React.FC<{ field: TypeField }> = React.memo((props) => {
    const form = useDFContext();
    const { field } = props;
    const fieldState = form.state[field.name];

    const classNames = useMemo(() => {
        return fieldState?.hasError ? "ring ring-offset-3 ring-destructive" : "";
    }, [fieldState?.hasError]);

    const handleChange = useCallback((value: FieldValue) => {
        form?.setValue?.(field.name, value);
    }, [form, field.name]);

    const handleBlur = useCallback(() => {
        field.onBlur?.(fieldState?.value);
    }, [field, fieldState?.value]);


    const { dependsOn, requiredOn } = field;

    if (dependsOn && !dependsOn(form.getValues())) {
        return <></>
    }


    const required: boolean = Boolean(requiredOn ? requiredOn(form.getValues()) : field.required)

    if (field.type === "checkbox") {
        return (
            <div className="mb-4">
                <div className="flex items-center gap-2">
                    <DFInputField
                        field={field}
                        className={classNames}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={fieldState?.value}
                    />
                    <label htmlFor={field.name} className="text-sm block font-medium">{field.label} </label>
                </div>
                {fieldState?.hasError && (
                    <span className="text-red-500 text-xs mt-1">{fieldState.error}</span>
                )}
            </div>
        )
    }

    return (
        <div className="mb-4 ">
            <label htmlFor={field.name} className="text-sm block mb-2 font-medium">
                {field.label} {required ? <span className="text-destructive">*</span> : <></>}
            </label>

            <DFInputField
                field={field}
                className={classNames}
                onBlur={handleBlur}
                onChange={handleChange}
                value={fieldState?.value}
            />

            {fieldState?.hasError && (
                <span className="text-red-500 text-xs mt-1">{fieldState.error}</span>
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

const DFInputField: React.FC<DFInputFieldProps> = React.memo((props) => {
    const { field, className, onChange, onBlur, value } = props;

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
            />
        )
    }

    if (field.type == "custom" && field.component) {
        return field.component({ form: useDFContext });
    }
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
            defaultValue={value as string || ""}
            placeholder={field.placeholder}
        />
    )
});

export { DataFormProvider, DataForm, DFInputField };