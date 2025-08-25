
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
    <div className="mb-6 pb-6">
        <h2 className="text-base font-bold mb-4 px-3">{label}</h2>
        <div className='flex'>
            {children}
        </div>
    </div>
));

const Column: React.FC<ColumnProps> = React.memo((props) => (
    <div className="basis-full px-3 min-w-0">
        {props.children}
    </div>
));


export { Section, Column };