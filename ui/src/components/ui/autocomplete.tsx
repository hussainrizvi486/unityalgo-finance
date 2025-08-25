import { CheckIcon, ChevronDown, ChevronsUpDown } from 'lucide-react';
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
    placeholder?: string;
    value?: OptionType | null;
    getOptions?: () => Promise<{ label: string; value: string }[]>;
    onChange?: (option: OptionType | null) => void;
    renderOption?: (option: OptionType) => React.ReactNode;
}

interface AutoCompleteOptionProps extends OptionType {
    onClick: (option: OptionType) => void;
    selected: OptionType | null | undefined;
}

const AutoCompleteOption: React.FC<AutoCompleteOptionProps> = (props) => {
    if (props.render) {
        return <div onClick={() => props.onClick(props)}>{props.render()}</div>
    }

    return (
        <div className='flex justify-between px-2 py-1.5 overflow-hidden items-center hover:bg-accent cursor-pointer rounded-md transition-colors'
            onClick={() => props.onClick(props)}
        >

            <div className='text-sm'>{props.label}</div>
            <CheckIcon
                className={cn(
                    'mr-2 h-4 w-4',
                    props.selected?.value === props.value ? 'opacity-100'
                        : 'opacity-0'
                )}
            />
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
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild >
                <button
                    className={cn('w-full h-9 border cursor-pointer border-input py-1.5 px-2 rounded-md text-sm text-left outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', props.className)}
                    aria-expanded={open}
                >
                    <div className='flex items-center justify-between gap-2'>
                        <div className='text-sm overflow-hidden text-ellipsis whitespace-nowrap '>
                            {selected ? selected.label : props.placeholder || props.label || "Select an option"}
                        </div>

                        <ChevronsUpDown className='size-4 shrink-0' />
                    </div>
                </button>
            </PopoverTrigger>



            <PopoverContent
                style={{ width: "var(--radix-popover-trigger-width)" }}
                className='shadow-sm'
            >
                <div className="mb-2 px-1 border-b border-input  ">
                    <input type="text" className='px-2 py-1 w-full outline-none text-sm rounded-md' placeholder='Search here'
                        value={query} onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                <div className='max-h-60 overflow-y-auto'>
                    {
                        !isLoading && results?.length ?
                            results.filter(option => option.label.toLowerCase().includes(query.toLowerCase())).map((option, index) => (
                                <AutoCompleteOption key={index} {...option} onClick={handleSelect} selected={selected} />
                            )) :
                            isLoading ? (
                                <div>
                                    <Spinner className='mx-auto' />
                                </div>
                            ) : (
                                <div className='text-center font-medium text-sm py-2'>
                                    No results found
                                </div>
                            )
                    }
                </div>
            </PopoverContent>
        </Popover>
    )
}

export { AutoComplete };