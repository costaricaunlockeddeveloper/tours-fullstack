import React, { useState } from 'react';
import AnimatedButton from "@/components/ui/AnimatedButton";

export interface ItineraryItem {
    title: string;
    description: string;
    duration: string;
}

interface TourItineraryManagerProps {
    items: ItineraryItem[];
    onItemsChange: (items: ItineraryItem[]) => void;
}

export default function TourItineraryManager({ items, onItemsChange }: TourItineraryManagerProps) {
    const [newItem, setNewItem] = useState<ItineraryItem>({ title: "", description: "", duration: "" });
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<ItineraryItem>({ title: "", description: "", duration: "" });

    const handleAdd = () => {
        if (!newItem.title.trim()) return;
        onItemsChange([...items, newItem]);
        setNewItem({ title: "", description: "", duration: "" });
    };

    const handleDelete = (index: number) => {
        onItemsChange(items.filter((_, i) => i !== index));
    };

    const startEdit = (index: number) => {
        setEditIndex(index);
        setEditValue(items[index]);
    };

    const saveEdit = (index: number) => {
        if (!editValue.title.trim()) return;
        const newItems = [...items];
        newItems[index] = editValue;
        onItemsChange(newItems);
        setEditIndex(null);
        setEditValue({ title: "", description: "", duration: "" });
    };

    const cancelEdit = () => {
        setEditIndex(null);
        setEditValue({ title: "", description: "", duration: "" });
    };

    return (
        <div className="space-y-6">
            {/* Input Area */}
            <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-stroke dark:border-dark-3 space-y-4">
                <h4 className="font-medium text-dark dark:text-white">Agregar Nuevo Punto</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-500 mb-1">Título</label>
                        <input
                            type="text"
                            value={newItem.title}
                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            placeholder="Ej: Salida del Hotel"
                            className="w-full rounded-lg border border-stroke bg-white dark:bg-dark-2 px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                            maxLength={100}
                        />
                        <p className="mt-1 text-[10px] text-right text-gray-400">
                            {newItem.title.length}/100
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1">Duración</label>
                        <input
                            type="text"
                            value={newItem.duration}
                            onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })}
                            placeholder="Ej: 30 mins"
                            className="w-full rounded-lg border border-stroke bg-white dark:bg-dark-2 px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                            maxLength={50}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-500 mb-1">Descripción</label>
                        <textarea
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            placeholder="Detalles de la actividad..."
                            rows={2}
                            className="w-full rounded-lg border border-stroke bg-white dark:bg-dark-2 px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white resize-none"
                            maxLength={500}
                        />
                        <p className="mt-1 text-[10px] text-right text-gray-400">
                            {newItem.description.length}/500
                        </p>
                    </div>
                </div>
                <div className="flex justify-between items-center px-1">
                    <p className={`text-xs font-medium ${items.length >= 20 ? "text-amber-600" : "text-gray-500"}`}>
                        {items.length}/20 puntos de interés
                        {items.length >= 20 && <span className="ml-2 font-bold uppercase tracking-wider italic text-[10px]">(Máximo alcanzado)</span>}
                    </p>
                    <AnimatedButton
                        onClick={handleAdd}
                        className={`rounded-full! ${(items.length >= 20 || !newItem.title.trim()) ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={items.length >= 20 || !newItem.title.trim()}
                    >
                        Agregar al Itinerario
                    </AnimatedButton>
                </div>
            </div>

            {/* List Area */}
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-dark-2 p-4 rounded-xl border border-stroke dark:border-dark-3 shadow-sm hover:shadow-md transition-all"
                    >
                        {editIndex === index ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs text-gray-500">Título</label>
                                        <input
                                            type="text"
                                            value={editValue.title}
                                            onChange={(e) => setEditValue({ ...editValue, title: e.target.value })}
                                            className="w-full rounded border border-primary px-3 py-1 text-sm bg-white dark:bg-dark-2 dark:text-white"
                                            maxLength={100}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">Duración</label>
                                        <input
                                            type="text"
                                            value={editValue.duration}
                                            onChange={(e) => setEditValue({ ...editValue, duration: e.target.value })}
                                            className="w-full rounded border border-primary px-3 py-1 text-sm bg-white dark:bg-dark-2 dark:text-white"
                                            maxLength={50}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs text-gray-500">Descripción</label>
                                        <textarea
                                            value={editValue.description}
                                            onChange={(e) => setEditValue({ ...editValue, description: e.target.value })}
                                            rows={2}
                                            className="w-full rounded border border-primary px-3 py-1 text-sm bg-white dark:bg-dark-2 dark:text-white"
                                            maxLength={500}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => saveEdit(index)}
                                        className="text-sm text-green-600 hover:text-green-700 font-medium px-3 py-1"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between gap-4">
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center justify-between">
                                        <h5 className="font-bold text-dark dark:text-white">{item.title}</h5>
                                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-dark-6">
                                            {item.duration}
                                        </span>
                                    </div>
                                    <p className="text-sm text-body-color dark:text-dark-6">{item.description}</p>
                                </div>
                                <div className="flex flex-col gap-2 justify-center border-l border-stroke dark:border-dark-3 pl-4">
                                    <button
                                        onClick={() => startEdit(index)}
                                        className="p-1.5 text-primary hover:bg-primary/10 rounded transition-colors"
                                        title="Editar"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00 2 2h11a2 2 0 00 2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                                        title="Eliminar"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-center py-8 text-sm text-dark-6 italic bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-stroke dark:border-dark-3">
                        No hay puntos en el itinerario.
                    </div>
                )}
            </div>
        </div>
    );
}
