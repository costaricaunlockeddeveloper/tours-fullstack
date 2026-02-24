import React, { useState } from 'react';
import { DailyItinerary } from '@/services/api-service';

interface ItineraryManagerProps {
    itinerary: DailyItinerary[];
    onItineraryChange: (itinerary: DailyItinerary[]) => void;
}

export default function ItineraryManager({ itinerary, onItineraryChange }: ItineraryManagerProps) {
    const [newItem, setNewItem] = useState<DailyItinerary>({
        day: -1, // Will be calculated
        title: "",
        description: "",
        accommodation: ""
    });

    // Edit state
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editItem, setEditItem] = useState<DailyItinerary | null>(null);

    const handleAdd = () => {
        if (!newItem.title.trim()) return;

        const nextDay = itinerary.length > 0 ? itinerary[itinerary.length - 1].day + 1 : 1;
        const itemToAdd = { ...newItem, day: nextDay };

        onItineraryChange([...itinerary, itemToAdd]);
        setNewItem({ day: -1, title: "", description: "", accommodation: "" });
    };

    const handleDelete = (index: number) => {
        const newItinerary = itinerary.filter((_, i) => i !== index);
        // Re-index days
        const reIndexed = newItinerary.map((day, i) => ({ ...day, day: i + 1 }));
        onItineraryChange(reIndexed);
    };

    const startEdit = (index: number) => {
        setEditIndex(index);
        setEditItem({ ...itinerary[index] });
    };

    const saveEdit = () => {
        if (!editItem || editIndex === null) return;
        const newItinerary = [...itinerary];
        newItinerary[editIndex] = editItem;
        onItineraryChange(newItinerary);
        setEditIndex(null);
        setEditItem(null);
    };

    const cancelEdit = () => {
        setEditIndex(null);
        setEditItem(null);
    };

    return (
        <div className="space-y-6">
            {/* Add New Day Form */}
            <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-xl border border-dashed border-stroke dark:border-dark-3">
                <h4 className="text-sm font-bold text-dark dark:text-white mb-3 uppercase tracking-wider">
                    {itinerary.length === 0 ? "Agregar Día 1" : `Agregar Día ${itinerary.length + 1}`}
                </h4>
                <div className="grid gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Título de la actividad (Ej. Llegada y Traslado)"
                            value={newItem.title}
                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            className="w-full rounded-lg border border-stroke bg-white dark:bg-dark-2 px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:opacity-50"
                            maxLength={100}
                            disabled={itinerary.length >= 20}
                        />
                        <p className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                            {newItem.title.length}/100
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <textarea
                                placeholder="Descripción detallada..."
                                value={newItem.description}
                                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                rows={2}
                                className="w-full rounded-lg border border-stroke bg-white dark:bg-dark-2 px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:opacity-50"
                                maxLength={1000}
                                disabled={itinerary.length >= 20}
                            />
                            <p className="absolute right-4 bottom-3 text-[10px] text-gray-400">
                                {newItem.description.length}/1000
                            </p>
                        </div>
                        <div className="relative">
                            <textarea
                                placeholder="Alojamiento (Opcional)"
                                value={newItem.accommodation || ""}
                                onChange={(e) => setNewItem({ ...newItem, accommodation: e.target.value })}
                                rows={2}
                                className="w-full rounded-lg border border-stroke bg-white dark:bg-dark-2 px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:opacity-50"
                                maxLength={100}
                                disabled={itinerary.length >= 20}
                            />
                            <p className="absolute right-4 bottom-3 text-[10px] text-gray-400">
                                {(newItem.accommodation || "").length}/100
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className={`text-xs font-medium ${itinerary.length >= 20 ? "text-amber-600" : "text-dark-6"}`}>
                            {itinerary.length}/20 días registrados
                            {itinerary.length >= 20 && <span className="ml-2 font-bold uppercase tracking-wider italic text-[10px]">(Máximo alcanzado)</span>}
                        </p>
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!newItem.title.trim() || itinerary.length >= 20}
                            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-opacity-90 disabled:bg-opacity-50 transition-all shadow-md hover:shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            Agregar Día
                        </button>
                    </div>
                </div>
            </div>

            {/* List of Days */}
            <div className="space-y-4">
                {itinerary.map((day, index) => (
                    <div
                        key={index}
                        className={`relative rounded-xl border p-5 transition-all duration-200 
                            ${editIndex === index
                                ? "border-primary bg-primary/5 shadow-md"
                                : "border-stroke bg-white dark:bg-dark-2 dark:border-dark-3 hover:shadow-card-2"
                            }`}
                    >
                        {editIndex === index && editItem ? (
                            // Edit Mode
                            <div className="grid gap-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-primary uppercase bg-white dark:bg-dark px-2 py-1 rounded border border-primary/20">
                                        Editando Día {day.day}
                                    </span>
                                </div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={editItem.title}
                                        onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                                        className="w-full rounded border border-primary bg-white dark:bg-dark-2 px-4 py-2 text-dark dark:text-white outline-none pr-12"
                                        placeholder="Título"
                                        maxLength={100}
                                    />
                                    <p className="absolute right-2 top-2 text-[10px] text-gray-400">{editItem.title.length}/100</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <textarea
                                            value={editItem.description}
                                            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                                            rows={3}
                                            className="w-full rounded border border-primary bg-white dark:bg-dark-2 px-4 py-2 text-dark dark:text-white outline-none pr-12"
                                            placeholder="Descripción"
                                            maxLength={1000}
                                        />
                                        <p className="absolute right-2 bottom-2 text-[10px] text-gray-400">{editItem.description.length}/1000</p>
                                    </div>
                                    <div className="relative">
                                        <textarea
                                            value={editItem.accommodation || ""}
                                            onChange={(e) => setEditItem({ ...editItem, accommodation: e.target.value })}
                                            rows={3}
                                            className="w-full rounded border border-primary bg-white dark:bg-dark-2 px-4 py-2 text-dark dark:text-white outline-none pr-12"
                                            placeholder="Alojamiento"
                                            maxLength={100}
                                        />
                                        <p className="absolute right-2 bottom-2 text-[10px] text-gray-400">{(editItem.accommodation || "").length}/100</p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-2">
                                    <button
                                        onClick={cancelEdit}
                                        className="px-4 py-2 text-sm font-medium text-dark-5 hover:text-dark border border-transparent hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={saveEdit}
                                        className="px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-opacity-90 rounded-lg shadow-sm transition-all"
                                    >
                                        Guardar Cambios
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Day Number Badge */}
                                <div className="shrink-0">
                                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-primary text-white rounded-lg shadow-sm">
                                        <span className="text-xs font-medium opacity-80">DÍA</span>
                                        <span className="text-2xl font-bold">{day.day}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-lg font-bold text-dark dark:text-white mb-1 truncate">
                                        {day.title}
                                    </h4>
                                    <div className="text-sm text-dark-6 mb-3 line-clamp-2">
                                        {day.description}
                                    </div>
                                    {day.accommodation && (
                                        <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-full w-fit">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                                            <span className="font-medium truncate max-w-[200px]">{day.accommodation}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex sm:flex-col gap-2 justify-end sm:justify-start">
                                    <button
                                        onClick={() => startEdit(index)}
                                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00 2 2h11a2 2 0 00 2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(index)}
                                        className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {itinerary.length === 0 && (
                    <div className="text-center py-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <h3 className="text-lg font-medium text-dark dark:text-white">Sin actividades</h3>
                        <p className="text-dark-6 mt-1">Comienza agregando el Día 1 de tu itinerario.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
