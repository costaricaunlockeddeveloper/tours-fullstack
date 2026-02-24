"use client";

import React, { useState } from 'react';

interface ListManagerProps {
    items: string[];
    onItemsChange: (items: string[]) => void;
    placeholder?: string;
    label?: string;
    type?: "check" | "cross" | "default"; // New prop for styling
    layout?: "list" | "grid";
}

export default function ListManager({ items, onItemsChange, placeholder = "Agregar nuevo item...", label, layout = "list", type = "default" }: ListManagerProps) {
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

    const getIcon = () => {
        if (type === "check") return <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>;
        if (type === "cross") return <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;
        return <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>;
    };

    return (
        <div className="space-y-4">
            {label && (
                <div className="flex items-center gap-2 mb-2">
                    <span className={`p-1.5 rounded-md ${type === "check" ? "bg-green-100 dark:bg-green-900/30 text-green-600" : type === "cross" ? "bg-red-100 dark:bg-red-900/30 text-red-600" : "bg-primary/10 text-primary"}`}>
                        {getIcon()}
                    </span>
                    <label className="block font-bold text-lg text-dark dark:text-white">{label}</label>
                </div>
            )}

            {/* Input Area */}
            <div className="flex gap-3 group focus-within:ring-2 ring-primary/20 rounded-xl transition-all">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && items.length < 15 && (e.preventDefault(), handleAdd())}
                    placeholder={items.length >= 15 ? "Límite de 15 items alcanzado" : placeholder}
                    className="flex-1 rounded-xl border border-stroke bg-white dark:bg-dark-2 px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary shadow-sm disabled:bg-gray-100 dark:disabled:bg-white/5"
                    maxLength={100}
                    disabled={items.length >= 15}
                />
                <button
                    onClick={handleAdd}
                    disabled={!newItem.trim() || items.length >= 15}
                    className={`flex-none flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white shadow-lg shadow-primary/30 transition-all hover:bg-opacity-90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none`}
                    title={items.length >= 15 ? "Límite alcanzado" : "Añadir"}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </button>
            </div>
            {items.length > 0 && (
                <div className="flex justify-between items-center px-1">
                    <p className={`text-[10px] font-medium ${items.length >= 15 ? "text-amber-600" : "text-gray-400"}`}>
                        {items.length}/15 items
                    </p>
                    {items.length >= 15 && <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider italic">Máximo alcanzado</p>}
                </div>
            )}

            {/* List Area */}
            <ul className={`${layout === "grid" ? "flex flex-wrap gap-3" : "space-y-3"} max-h-[300px] overflow-y-auto custom-scrollbar p-1`}>
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`group flex items-center justify-between gap-3 p-3 rounded-xl border transition-all duration-200 
                            ${layout === "grid"
                                ? "bg-white dark:bg-dark-2 border-stroke dark:border-dark-3 hover:shadow-md"
                                : "bg-white dark:bg-dark-2 border-stroke dark:border-dark-3 hover:shadow-card hover:border-primary/50"
                            }
                        `}
                    >
                        {editIndex === index ? (
                            <div className="flex flex-1 gap-2 items-center">
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="flex-1 rounded-lg border border-primary bg-white dark:bg-dark-2 px-3 py-2 text-dark dark:text-white outline-none shadow-sm"
                                    autoFocus
                                    maxLength={100}
                                />
                                <button onClick={() => saveEdit(index)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                </button>
                                <button onClick={cancelEdit} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <span className={`shrink-0 w-2 h-2 rounded-full ${type === 'check' ? 'bg-green-500' : type === 'cross' ? 'bg-red-500' : 'bg-primary'}`}></span>
                                    <span className="text-dark dark:text-white truncate font-medium">{item}</span>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => startEdit(index)}
                                        className="p-2 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
