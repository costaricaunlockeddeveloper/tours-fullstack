"use client";

import { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { TourDefaults, TourDateEntry } from "@/services/api-service";

dayjs.locale("es");

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = ["00", "15", "30", "45"];
const PERIODS = ["AM", "PM"];

interface CalendarSchedulerProps {
    defaults: TourDefaults;
    availableDates: TourDateEntry[];
    onChange: (dates: TourDateEntry[]) => void;
    onDefaultsChange: (defaults: TourDefaults) => void;
}

export default function CalendarScheduler({ defaults, availableDates = [], onChange, onDefaultsChange }: CalendarSchedulerProps) {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [expandedDate, setExpandedDate] = useState<string | null>(null);

    // Schedule picker state
    const [hour, setHour] = useState(8);
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("AM");

    // Add schedule to defaults template only — does NOT touch existing dates
    const handleAddSchedule = () => {
        const formatted = `${hour}:${minute} ${period}`;
        if (!defaults.schedules.includes(formatted)) {
            onDefaultsChange({
                ...defaults,
                schedules: [...defaults.schedules, formatted].sort(),
            });
        }
    };

    // Remove schedule from defaults template only — does NOT touch existing dates
    const handleRemoveSchedule = (val: string) => {
        onDefaultsChange({
            ...defaults,
            schedules: defaults.schedules.filter(s => s !== val),
        });
    };

    const toggleDate = (dateStr: string) => {
        const exists = availableDates.find(d => d.date === dateStr);
        if (exists) {
            onChange(availableDates.filter(d => d.date !== dateStr));
            if (expandedDate === dateStr) setExpandedDate(null);
        } else {
            onChange([...availableDates, {
                date: dateStr,
                price: defaults.price,
                priceChild: defaults.priceChild,
                maxQuota: defaults.maxQuota,
                schedules: [...defaults.schedules],
                enrolled: 0,
            }]);
        }
    };

    const updateDateField = (dateStr: string, field: keyof TourDateEntry, value: any) => {
        onChange(availableDates.map(d => {
            if (d.date === dateStr) {
                return { ...d, [field]: value };
            }
            return d;
        }));
    };

    // Add/remove a single schedule for single date
    const toggleScheduleForDate = (dateStr: string, schedule: string) => {
        onChange(availableDates.map(d => {
            if (d.date === dateStr) {
                const has = d.schedules.includes(schedule);
                return {
                    ...d,
                    schedules: has
                        ? d.schedules.filter(s => s !== schedule)
                        : [...d.schedules, schedule].sort(),
                };
            }
            return d;
        }));
    };

    // Add new ad-hoc schedule to a specific date
    const addScheduleToDate = (dateStr: string) => {
        const formatted = `${hour}:${minute} ${period}`;
        onChange(availableDates.map(d => {
            if (d.date === dateStr && !d.schedules.includes(formatted)) {
                return { ...d, schedules: [...d.schedules, formatted].sort() };
            }
            return d;
        }));
    };

    // Apply current defaults to ALL existing dates (overwrite their prices/quota/schedules)
    const handleApplyDefaultsToAll = () => {
        onChange(availableDates.map(d => ({
            ...d,
            price: defaults.price,
            priceChild: defaults.priceChild,
            maxQuota: defaults.maxQuota,
            schedules: [...defaults.schedules],
        })));
    };

    return (
        <div className="space-y-6">
            {/* Defaults / Template Section */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-lg">
                <h4 className="font-bold text-dark dark:text-white mb-1 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    Valores Base (Plantilla)
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Estos valores se copiarán al crear cada fecha nueva. Modificarlos no afecta las fechas ya creadas.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-medium text-dark dark:text-white mb-1">Precio adulto ($)</label>
                        <input
                            type="number"
                            min="0"
                            value={defaults.price || ""}
                            onChange={e => onDefaultsChange({ ...defaults, price: Number(e.target.value) })}
                            className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-dark dark:text-white mb-1">Precio niño ($)</label>
                        <input
                            type="number"
                            min="0"
                            value={defaults.priceChild || ""}
                            onChange={e => onDefaultsChange({ ...defaults, priceChild: Number(e.target.value) })}
                            className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-dark dark:text-white mb-1">Cupo máximo por día</label>
                        <input
                            type="number"
                            min="0"
                            value={defaults.maxQuota || ""}
                            onChange={e => onDefaultsChange({ ...defaults, maxQuota: Number(e.target.value) })}
                            className="w-full rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Schedule Picker */}
                <label className="block text-xs font-medium text-dark dark:text-white mb-1">Horarios base</label>
                <div className="flex items-center gap-2 mb-2">
                    <select value={hour} onChange={e => setHour(Number(e.target.value))} className="rounded-lg border border-stroke bg-transparent px-2 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white">
                        {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span className="text-dark dark:text-white font-bold">:</span>
                    <select value={minute} onChange={e => setMinute(e.target.value)} className="rounded-lg border border-stroke bg-transparent px-2 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white">
                        {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={period} onChange={e => setPeriod(e.target.value)} className="rounded-lg border border-stroke bg-transparent px-2 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white">
                        {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <button type="button" onClick={handleAddSchedule} className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 text-sm">
                        Agregar
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {defaults.schedules.map((schedule) => (
                        <span key={schedule} className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-dark-2 px-3 py-1 text-sm text-dark dark:text-white border border-stroke dark:border-dark-3">
                            {schedule}
                            <button type="button" onClick={() => handleRemoveSchedule(schedule)} className="text-red-500 hover:text-red-700 ml-1">&times;</button>
                        </span>
                    ))}
                </div>

                {/* Apply to all button */}
                {availableDates.length > 0 && (
                    <button
                        type="button"
                        onClick={handleApplyDefaultsToAll}
                        className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg border border-blue-300 dark:border-blue-700 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Aplicar plantilla a todas las fechas
                    </button>
                )}
            </div>

            {/* Calendar + Active Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Calendar */}
                <div className="bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 rounded-lg p-3 max-w-sm w-full mx-auto md:mx-0">
                    <div className="flex justify-between items-center mb-2">
                        <button type="button" onClick={() => setCurrentMonth(currentMonth.subtract(1, 'month'))} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded">&lt;</button>
                        <span className="font-bold text-base capitalize text-dark dark:text-white">{currentMonth.format("MMMM YYYY")}</span>
                        <button type="button" onClick={() => setCurrentMonth(currentMonth.add(1, 'month'))} className="p-1 hover:bg-gray-100 dark:hover:bg-white/5 rounded">&gt;</button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-1 text-center text-xs font-medium text-gray-500">
                        {["D", "L", "M", "M", "J", "V", "S"].map((d, i) => <div key={i}>{d}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: currentMonth.startOf('month').day() }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square"></div>
                        ))}
                        {Array.from({ length: currentMonth.daysInMonth() }).map((_, i) => {
                            const date = currentMonth.date(i + 1);
                            const dateStr = date.format("YYYY-MM-DD");
                            const dateEntry = availableDates.find(d => d.date === dateStr);
                            const isSelected = !!dateEntry;

                            return (
                                <button
                                    key={dateStr}
                                    type="button"
                                    onClick={() => toggleDate(dateStr)}
                                    className={`aspect-square rounded-full flex flex-col items-center justify-center text-xs transition-all relative ${isSelected
                                        ? "bg-primary text-white shadow-sm transform scale-105"
                                        : "hover:bg-gray-100 dark:hover:bg-white/5 text-dark dark:text-white"
                                        }`}
                                >
                                    {i + 1}
                                    {dateEntry && dateEntry.enrolled > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 bg-green-500 text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                                            {dateEntry.enrolled}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Active Dates List */}
                {availableDates.length > 0 && (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        <h4 className="font-bold text-dark dark:text-white text-sm">Fechas Activas ({availableDates.length})</h4>
                        {availableDates
                            .sort((a, b) => a.date.localeCompare(b.date))
                            .map((dateObj) => (
                                <div key={dateObj.date} className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-stroke dark:border-dark-3">
                                    <div className="flex justify-between items-center">
                                        <button
                                            type="button"
                                            className="font-semibold text-primary text-sm hover:underline text-left flex items-center gap-2"
                                            onClick={() => setExpandedDate(expandedDate === dateObj.date ? null : dateObj.date)}
                                        >
                                            {dayjs(dateObj.date).format("dddd, D MMMM")}
                                            <span className="text-xs text-gray-400">{expandedDate === dateObj.date ? "▲" : "▼"}</span>
                                        </button>
                                        <div className="flex items-center gap-2">
                                            {dateObj.enrolled > 0 && (
                                                <span className="text-xs bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                                                    {dateObj.enrolled} inscritos
                                                </span>
                                            )}
                                            <button type="button" onClick={() => toggleDate(dateObj.date)} className="text-red-500 text-xs hover:underline">Quitar</button>
                                        </div>
                                    </div>

                                    {/* Summary when collapsed */}
                                    {expandedDate !== dateObj.date && (
                                        <div className="mt-1 text-xs text-gray-500 flex gap-3">
                                            <span>${dateObj.price}</span>
                                            <span>Cupo: {dateObj.maxQuota}</span>
                                            <span>{dateObj.schedules.length} horarios</span>
                                        </div>
                                    )}

                                    {/* Expanded: edit per-date values */}
                                    {expandedDate === dateObj.date && (
                                        <div className="mt-3 space-y-3">
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-0.5">Adulto ($)</label>
                                                    <input type="number" min="0" value={dateObj.price || ""} onChange={e => updateDateField(dateObj.date, "price", Number(e.target.value))} className="w-full rounded border border-stroke bg-transparent px-2 py-1 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-0.5">Niño ($)</label>
                                                    <input type="number" min="0" value={dateObj.priceChild || ""} onChange={e => updateDateField(dateObj.date, "priceChild", Number(e.target.value))} className="w-full rounded border border-stroke bg-transparent px-2 py-1 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-0.5">Cupo</label>
                                                    <input type="number" min="0" value={dateObj.maxQuota || ""} onChange={e => updateDateField(dateObj.date, "maxQuota", Number(e.target.value))} className="w-full rounded border border-stroke bg-transparent px-2 py-1 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Horarios de esta fecha</label>
                                                <div className="flex flex-wrap gap-2 mb-2">
                                                    {dateObj.schedules.map((schedule) => (
                                                        <span key={schedule} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                                                            {schedule}
                                                            <button type="button" onClick={() => toggleScheduleForDate(dateObj.date, schedule)} className="text-red-400 hover:text-red-600">&times;</button>
                                                        </span>
                                                    ))}
                                                    {dateObj.schedules.length === 0 && (
                                                        <span className="text-xs text-gray-400 italic">Sin horarios</span>
                                                    )}
                                                </div>
                                                {/* Add ad-hoc schedule to this date */}
                                                <div className="flex items-center gap-1">
                                                    <select value={hour} onChange={e => setHour(Number(e.target.value))} className="rounded border border-stroke bg-transparent px-1 py-1 text-xs text-dark outline-none dark:border-dark-3 dark:text-white">
                                                        {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                                    </select>
                                                    <span className="text-dark dark:text-white text-xs font-bold">:</span>
                                                    <select value={minute} onChange={e => setMinute(e.target.value)} className="rounded border border-stroke bg-transparent px-1 py-1 text-xs text-dark outline-none dark:border-dark-3 dark:text-white">
                                                        {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                                                    </select>
                                                    <select value={period} onChange={e => setPeriod(e.target.value)} className="rounded border border-stroke bg-transparent px-1 py-1 text-xs text-dark outline-none dark:border-dark-3 dark:text-white">
                                                        {PERIODS.map(p => <option key={p} value={p}>{p}</option>)}
                                                    </select>
                                                    <button type="button" onClick={() => addScheduleToDate(dateObj.date)} className="px-2 py-1 bg-primary text-white rounded text-xs hover:bg-opacity-90">+</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
