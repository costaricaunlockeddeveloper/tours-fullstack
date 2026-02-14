import React, { useState } from 'react';
import AnimatedButton from "@/components/ui/AnimatedButton";

interface ListManagerProps {
    items: string[];
    onItemsChange: (items: string[]) => void;
    placeholder?: string;
    label?: string;
}

export default function ListManager({ items, onItemsChange, placeholder = "Agregar nuevo item...", label, layout = "list" }: ListManagerProps & { layout?: "list" | "grid" }) {
    const [newItem, setNewItem] = useState("");
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");

    const handleAdd = () => {
        if (!newItem.trim()) return;
        onItemsChange([...items, newItem.trim()]);
        setNewItem("");
    };

    const handleDelete = (index: number) => {
        onItemsChange(items.filter((_, i) => i !== index));
    };

    const startEdit = (index: number) => {
        setEditIndex(index);
        setEditValue(items[index]);
    };

    const saveEdit = (index: number) => {
        if (!editValue.trim()) return;
        const newItems = [...items];
        newItems[index] = editValue.trim();
        onItemsChange(newItems);
        setEditIndex(null);
        setEditValue("");
    };

    const cancelEdit = () => {
        setEditIndex(null);
        setEditValue("");
    };

    return (
        <div className="space-y-3">
            {label && <label className="block font-medium text-dark dark:text-white">{label}</label>}

            {/* Input Area */}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
                    placeholder={placeholder}
                    className="flex-1 rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                />
                <button
                    onClick={handleAdd}
                    disabled={!newItem.trim()}
                    className={`flex-none flex items-center justify-center w-10 h-10 !rounded-full bg-primary text-white shadow-md transition-all hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed`}
                    title="Añadir"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
            </div>

            {/* List Area */}
            <ul className={`${layout === "grid" ? "flex flex-wrap gap-2" : "space-y-2"} max-h-60 overflow-y-auto custom-scrollbar`}>
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`group flex items-center justify-between gap-2 p-2 rounded-lg border transition-all ${layout === "grid"
                            ? "bg-gray-50 dark:bg-white/5 border-stroke dark:border-dark-3"
                            : "bg-gray-50 dark:bg-white/5 border-transparent hover:border-stroke dark:hover:border-dark-3"
                            }`}
                    >
                        {editIndex === index ? (
                            <div className="flex flex-1 gap-2 items-center">
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    // onKeyDown={(e) => e.key === 'Enter' && saveEdit(index)}
                                    className="min-w-[100px] flex-1 rounded border border-primary bg-white dark:bg-dark-2 px-2 py-1 text-sm outline-none"
                                    autoFocus
                                />
                                <button
                                    onClick={() => saveEdit(index)}
                                    className="text-green-600 hover:text-green-700"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="text-red-500 hover:text-red-600"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ) : (
                            <>
                                <span className="text-sm text-dark dark:text-white break-words">{item}</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => startEdit(index)}
                                        className="p-1 text-primary hover:bg-primary/10 rounded"
                                        title="Editar"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00 2 2h11a2 2 0 00 2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                        title="Eliminar"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
                {items.length === 0 && (
                    <li className="text-center py-4 text-sm text-dark-6 italic bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-stroke dark:border-dark-3 w-full">
                        No hay elementos en la lista.
                    </li>
                )}
            </ul>
        </div>
    );
}
