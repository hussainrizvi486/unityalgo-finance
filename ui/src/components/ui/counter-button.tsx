import React, { useState } from "react"
import { Plus as PlusIcon, Minus as MinusIcon } from "lucide-react";
import { integer } from "../../utils/index";

interface CounterProps {
    count?: any,
    onChange?: (value: number) => void
}

export const CounterButton: React.FC<CounterProps> = ({ count, onChange }) => {
    const [value, setValue] = useState(integer(count) || 0);

    const handleChange = (increment: boolean) => {
        setValue(prev => {
            const newValue = increment ? prev + 1 : prev - 1;
            onChange?.(newValue);
            return newValue;
        });
    }



    return (
        <div className="max-w-max p-1 flex items-center border border-slate-300 rounded-3xl ">
            <button
                className="rounded-full cursor-pointer p-1.5 hover:bg-gray-200 transition-colors"
                onClick={() => handleChange(false)}
            >
                <MinusIcon className="size-5" />
            </button>

            <input
                className="text-sm text-center h-full outline-none px-2 w-10"
                type="number"
                value={value}
                onChange={(e) => {
                    const val = integer(e.target.value);
                    setValue(val);
                    onChange?.(val);
                }}
            />

            <button
                className="rounded-full cursor-pointer p-1.5 hover:bg-gray-200 transition-colors"
                onClick={() => handleChange(true)}
            >
                <PlusIcon className="size-5" />
            </button>
        </div>
    )
}