import { ChevronsUpDown, Search as SearchIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../../utils/index";
import { Spinner } from '../loaders/spinner';


export interface OptionType {
    label: string;
    value: string;
    disabled?: boolean;
    icon?: React.ReactNode;
    render?: () => React.ReactNode;
}

interface AutoCompleteProps {
    label: string;
    className?: string;
    options?: OptionType[];
    value?: OptionType | null;
    getOptions?: () => Promise<{ label: string; value: string }[]>;
    onChange?: (option: OptionType | null) => void;
    renderOption?: (option: OptionType) => React.ReactNode;
}

interface AutoCompleteOptionProps extends OptionType {
    onClick: (option: OptionType) => void;
}

const AutoCompleteOption: React.FC<AutoCompleteOptionProps> = (props) => {
    if (props.render) {
        return <div onClick={() => props.onClick(props)}>{props.render()}</div>
    }

    return (
        <div className='flex gap-2 px-2 py-1.5 overflow-hidden items-center hover:bg-accent cursor-pointer rounded-md transition-colors' onClick={() => props.onClick(props)}>
            <div className='text-sm'>{props.label}</div>
        </div>
    )
}

const AutoComplete: React.FC<AutoCompleteProps> = (props) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<OptionType | null>(props.value || null);
    const [results, setResults] = useState<OptionType[]>(props.options || []);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (!props.getOptions) return;

        setIsLoading(true);
        props.getOptions().then((data) => {
            setResults(data.map(option => ({ label: option.label, value: option.value })));
            if (props.value) {
                const selectedOption = data.find(option => option.value === props.value?.value);
                setSelected(selectedOption || null);
            }
            setIsLoading(false);
        }).catch(() => {
            setIsLoading(false);
        });

    }, [props])

    const handleSelect = React.useCallback((option: OptionType) => {
        if (option.value === selected?.value) { setSelected(null); }
        else { setSelected(option); }
        props.onChange?.(option);
        setOpen(false);
    }, [])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild >
                <button
                    className={cn('w-full border border-input py-1.5 px-2 rounded text-sm text-left text-gray-600 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', props.className)}
                    aria-expanded={open}
                >
                    <div className='flex items-center justify-between gap-2'>
                        <div className='text-sm truncate'>
                            {selected ? selected.label : props.label || "Select an option"}
                        </div>
                        <ChevronsUpDown className='size-4' />
                    </div>
                </button>
            </PopoverTrigger>

            <PopoverContent
                style={{ width: "var(--radix-popover-trigger-width)" }}
                className="p-1"
            >
                <div className="mb-2 flex items-center px-2 border-b border-b-gray-200">
                    <div><SearchIcon className='size-4' /></div>
                    <input type="text" className='px-2 py-1 w-full outline-none text-sm rounded-md flex-auto' placeholder='Search here'
                        value={query} onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {
                    !isLoading && results?.length ?
                        results?.map((option, index) => (<AutoCompleteOption key={index} {...option} onClick={handleSelect} />)) :
                        isLoading ? (
                            <div>
                                <Spinner className='mx-auto' />
                            </div>
                        ) : (
                            <div className='text-center text-sm text-gray-500'>
                                No results found
                            </div>
                        )
                }
            </PopoverContent>
        </Popover>
    )
}

export { AutoComplete };