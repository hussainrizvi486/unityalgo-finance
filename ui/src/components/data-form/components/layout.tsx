
import React from 'react';

interface SectionProps {
    children: React.ReactNode;
    label: string;
}

interface ColumnProps {
    children: React.ReactNode;
    columnsLength?: number;
}

const Section: React.FC<SectionProps> = React.memo(({ children, label }) => (
    <div className="mb-6 border-b border-gray-300 pb-6 ">
        <h2 className="text-base font-semibold mb-4">{label}</h2>
        <div className='flex gap-2'>
            {children}
        </div>
    </div>
));

const Column: React.FC<ColumnProps> = React.memo((props) => (
    <div className="basis-full">
        {props.children}
    </div>
));


export { Section, Column };