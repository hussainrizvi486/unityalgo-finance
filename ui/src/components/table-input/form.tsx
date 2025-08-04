import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Trash2, X as CloseIcon } from "lucide-react";
import { Button } from "../ui/button";
import { buildLayout } from "../data-form/index";
import { useTIContext } from ".";
import type { TIContextType } from "./types";
import { Field } from "./field";
import { Section, Column } from "../data-form/components/layout";


export const Form: React.FC = () => {
    const context = useTIContext();
    const { fields, state, setEditingRow, editingRow, deleteRow, addRow } = context;
    const formLayout = buildLayout(fields)
    const rowState = state.find(row => row.id === editingRow);

    if (editingRow === null || !rowState) return <></>


    const handleDelete = () => {
        deleteRow(rowState.id);
    };

    return (
        <div>
            <header className="flex items-center justify-between">

                <div className="font-medium">Editing Row # {rowState.index}</div>
                <FormActions handleDelete={handleDelete} />

            </header>

            <div className="py-6">
                {formLayout.map((section, index) => (
                    <Section key={index} label={section.label || ""}>
                        {
                            section?.columns?.map((column, colIndex) => (
                                <Column key={colIndex}>
                                    {column.map((field, fieldIndex) => (
                                        <div key={fieldIndex} className="mb-4">
                                            <label className="mb-2 text-sm">{field.label}</label>
                                            <Field field={field} state={rowState} ctx={context} />
                                        </div>
                                    ))}
                                </Column>
                            ))
                        }
                    </Section>

                ))}
            </div>
        </div>
    )
}


const FormActions: React.FC = ({ ctx, handleDelete }: { ctx: TIContextType, handleDelete: () => void }) => {
    return (
        <div className="flex items-center gap-2">
            <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="size-4" />
            </Button>
            <Button size="sm" onClick={() => {
                ctx.setEditingRow(null);
                ctx.addRow()
            }}>Insert Below</Button>

            <CloseIcon />
        </div>
    )
}