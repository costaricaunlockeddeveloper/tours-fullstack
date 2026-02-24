"use client";

import React, { useState } from 'react';
import { PackageActivity } from '@/services/api-service';

interface ActivityManagerProps {
    activities: PackageActivity[];
    onActivitiesChange: (activities: PackageActivity[]) => void;
}

export default function ActivityManager({ activities, onActivitiesChange }: ActivityManagerProps) {
    const [newItem, setNewItem] = useState<PackageActivity>({
        title: "",
        description: "",
    });

    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editItem, setEditItem] = useState<PackageActivity | null>(null);

    const handleAdd = () => {
        if (!newItem.title.trim()) return;
        onActivitiesChange([...activities, newItem]);
        setNewItem({ title: "", description: "" });
    };

    const handleDelete = (index: number) => {
        onActivitiesChange(activities.filter((_, i) => i !== index));
    };

    const startEdit = (index: number) => {
        setEditIndex(index);
        setEditItem({ ...activities[index] });
    };

    const saveEdit = () => {
        if (!editItem || editIndex === null) return;
        const newList = [...activities];
        newList[editIndex] = editItem;
        onActivitiesChange(newList);
        setEditIndex(null);
        setEditItem(null);
    };

    return (
        <div className="space-y-8">
            {/* Add Form */}
            <div className="bg-white dark:bg-dark-2 p-6 rounded-2xl shadow-card border border-stroke dark:border-dark-3">
                <div className="flex items-center gap-3 mb-5 border-b pb-4 dark:border-dark-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-dark dark:text-white">Nueva Actividad</h4>
                        <p className="text-sm text-dark-6">Agrega una experiencia al paquete</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Nombre de la Actividad (Ej. Rafting Rio Pacuare)"
                            value={newItem.title}
                            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                            className="w-full rounded-xl border border-stroke bg-gray-50 dark:bg-white/5 px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary focus:bg-white dark:focus:bg-dark-2 disabled:opacity-50"
                            maxLength={100}
                            disabled={activities.length >= 20}
                        />
                        <p className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                            {newItem.title.length}/100
                        </p>
                    </div>
                    <div className="relative">
                        <textarea
                            placeholder="Descripción breve..."
                            value={newItem.description}
                            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                            rows={3}
                            className="w-full rounded-xl border border-stroke bg-gray-50 dark:bg-white/5 px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary focus:bg-white dark:focus:bg-dark-2 disabled:opacity-50"
                            maxLength={500}
                            disabled={activities.length >= 20}
                        />
                        <p className="absolute right-4 bottom-3 text-[10px] text-gray-400">
                            {newItem.description.length}/500
                        </p>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className={`text-xs font-medium ${activities.length >= 20 ? "text-amber-600" : "text-dark-6"}`}>
                            {activities.length}/20 actividades registradas
                            {activities.length >= 20 && <span className="ml-2 font-bold uppercase tracking-wider italic text-[10px]">(Máximo alcanzado)</span>}
                        </p>
                        <button
                            type="button"
                            onClick={handleAdd}
                            disabled={!newItem.title.trim() || activities.length >= 20}
                            className="px-8 py-3 rounded-xl bg-primary text-white hover:bg-opacity-90 disabled:opacity-50 transition-all font-medium shadow-lg shadow-primary/20 hover:-translate-y-0.5"
                        >
                            Agregar Actividad
                        </button>
                    </div>
                </div>
            </div>

            {/* List - Timeline Style */}
            <div className="relative">
                {activities.length > 0 && <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-3 -z-10"></div>}

                <div className="space-y-6">
                    {activities.map((act, index) => (
                        <div key={index} className="relative pl-20 group">
                            {/* Number Bubble */}
                            <div className="absolute left-0 top-0 w-16 h-16 flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-dark-2 border-2 border-primary/20 shadow-md group-hover:border-primary group-hover:scale-105 transition-all z-10">
                                <span className="text-xs font-semibold text-primary uppercase">Actividad</span>
                                <span className="text-2xl font-bold text-dark dark:text-white leading-none">{index + 1}</span>
                            </div>

                            {/* Content Card */}
                            <div className="bg-white dark:bg-dark-2 rounded-2xl p-5 border border-stroke dark:border-dark-3 shadow-sm hover:shadow-card transition-all">
                                {editIndex === index && editItem ? (
                                    <div className="grid gap-4">
                                        <div className="relative">
                                            <input
                                                value={editItem.title}
                                                onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                                                className="w-full font-bold text-lg border-b border-primary/30 pb-2 outline-none bg-transparent pr-12"
                                                autoFocus
                                                maxLength={100}
                                            />
                                            <p className="absolute right-0 top-1 text-[10px] text-gray-400">{editItem.title.length}/100</p>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                value={editItem.description}
                                                onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                                                rows={2}
                                                className="w-full text-dark-6 bg-transparent outline-none resize-none pr-12"
                                                maxLength={500}
                                            />
                                            <p className="absolute right-0 bottom-1 text-[10px] text-gray-400">{editItem.description.length}/500</p>
                                        </div>
                                        <div className="flex justify-end gap-3 pt-2">
                                            <button onClick={() => setEditIndex(null)} className="px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg">Cancelar</button>
                                            <button onClick={saveEdit} className="px-6 py-2 text-sm font-bold text-white bg-primary rounded-lg shadow-md hover:bg-opacity-90">Guardar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h5 className="text-lg font-bold text-dark dark:text-white mb-2 group-hover:text-primary transition-colors">{act.title}</h5>
                                            <p className="text-base text-dark-6 leading-relaxed">{act.description}</p>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEdit(index)} className="p-2 text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00 2 2h11a2 2 0 00 2-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                            </button>
                                            <button onClick={() => handleDelete(index)} className="p-2 text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {activities.length === 0 && (
                        <div className="ml-20 py-10 text-center border-2 border-dashed border-gray-200 dark:border-dark-3 rounded-2xl bg-gray-50/50 dark:bg-white/5">
                            <p className="text-dark-6">Aún no hay actividades registradas.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
