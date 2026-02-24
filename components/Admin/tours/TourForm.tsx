
"use client";

import { useState, useEffect } from "react";
import { Tour, Place, TourDefaults } from "@/services/api-service";
import { generateSlug } from "@/utils/generate-slug";
import LocationPickerModal from "@/components/Admin/LocationPickerModal";
import MediaGalleryEditor from "@/components/Admin/Commons/MediaGalleryEditor";
import StarRatingInput from "@/components/Admin/Commons/StarRatingInput";
import CalendarScheduler from "@/components/Admin/tours/CalendarScheduler";

interface TourFormProps {
    initialData?: Partial<Tour>;
    availablePlaces: Place[];
    onSubmit: (data: Partial<Tour>) => Promise<void>;
    isSubmitting: boolean;
    onCancel?: () => void;
    simpleMode?: boolean;
}

const DEFAULT_DEFAULTS: TourDefaults = {
    price: 0,
    priceChild: 0,
    maxQuota: 0,
    schedules: [],
};

export default function TourForm({ initialData, availablePlaces, onSubmit, isSubmitting, onCancel, simpleMode = false }: TourFormProps) {
    const defaultFormState: Partial<Tour> = {
        name: "",
        slug: "",
        description: "",
        duration: 0,
        placeIds: [],
        meetingPoint: { name: "", description: "", link: "" },
        rating: 0,
        reviews: 0,
        images: {},
        defaults: { ...DEFAULT_DEFAULTS },
        availableDates: [],
        includes: [],
        excludes: [],
    };

    const [formData, setFormData] = useState<Partial<Tour>>(initialData || defaultFormState);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...defaultFormState,
                ...initialData,
                meetingPoint: initialData.meetingPoint || { name: "", description: "", link: "" },
                defaults: initialData.defaults || { ...DEFAULT_DEFAULTS },
                availableDates: initialData.availableDates || [],
                images: initialData.images || {},
            }));
        }
    }, [initialData]);

    // Auto-generate slug from name
    useEffect(() => {
        if (formData.name) {
            if (!initialData || initialData.status !== 'PUBLISHED') {
                setFormData(prev => ({ ...prev, slug: generateSlug(formData.name || "") }));
            }
        }
    }, [formData.name, initialData]);

    const togglePlaceSelection = (placeId: string) => {
        setFormData((prev) => {
            const currentIds = prev.placeIds || [];
            const isSelected = currentIds.includes(placeId);
            return {
                ...prev,
                placeIds: isSelected
                    ? currentIds.filter(id => id !== placeId)
                    : [...currentIds, placeId]
            };
        });
    };

    const handleLocationConfirm = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            meetingPoint: {
                ...prev.meetingPoint,
                coordinates: { lat, lng },
                link: `https://www.google.com/maps/?q=${lat},${lng}`,
            },
        }));
        setIsLocationPickerOpen(false);
    };

    const updateMeetingPoint = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            meetingPoint: { ...prev.meetingPoint, [field]: value },
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    const currentDefaults = formData.defaults || { ...DEFAULT_DEFAULTS };

    return (
        <>
            <form id="tourForm" onSubmit={handleFormSubmit} className="bg-white dark:bg-dark-2 p-6 rounded-xl shadow-1 space-y-6">

                {/* 1. Destinos Select */}
                <div>
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-4">Destinos Asociados</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {availablePlaces.map((place) => (
                            <label
                                key={place.id}
                                className={`
                                    relative flex items-start gap-3 p-4 rounded-xl cursor-pointer border transition-all duration-200
                                    ${formData.placeIds?.includes(place.id)
                                        ? "bg-primary/5 border-primary shadow-sm"
                                        : "bg-gray-50 dark:bg-white/5 border-transparent hover:border-stroke dark:hover:border-dark-3"}
                                `}
                            >
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={formData.placeIds?.includes(place.id)}
                                        onChange={() => togglePlaceSelection(place.id)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-dark dark:text-white text-sm">{place.name}</span>
                                    {place.region && <span className="text-xs text-dark-6">{place.region}</span>}
                                </div>
                            </label>
                        ))}
                        {availablePlaces.length === 0 && (
                            <p className="text-sm text-dark-6 italic col-span-full">
                                No hay destinos disponibles.
                            </p>
                        )}
                    </div>
                </div>

                {/* 2. Información General */}
                <div>
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-4">Información General</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Nombre del Tour <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                placeholder="Ej: Aventura en la Amazonía"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Slug</label>
                            <input
                                type="text"
                                value={formData.slug || ""}
                                readOnly
                                className="w-full rounded-lg border border-stroke bg-gray-100 dark:bg-white/5 px-5 py-3 text-dark/60 outline-none dark:border-dark-3 dark:text-white/60 cursor-not-allowed"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Descripción Corta <span className="text-red-500">*</span></label>
                            <textarea
                                placeholder="Breve resumen de lo que trata el tour..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                rows={4}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Duración (horas)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={formData.duration || ""}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                placeholder="Ej: 4"
                            />
                        </div>
                    </div>

                    {!simpleMode && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <StarRatingInput
                                value={formData.rating || 0}
                                onChange={(val) => setFormData({ ...formData, rating: val })}
                                label="Calificación (0-5)"
                            />
                            <div>
                                <label className="mb-2.5 block font-medium text-dark dark:text-white">Cantidad de Reseñas</label>
                                <input
                                    type="number" min="0"
                                    value={formData.reviews}
                                    onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) })}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Galería Multimedia */}
                <div>
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-4">Galería Multimedia</h3>
                    <MediaGalleryEditor
                        images={formData.images || {}}
                        onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
                        folderName="tours"
                        slug={formData.slug || initialData?.id || "new-tour"}
                    />
                </div>

                {/* 4. Advanced Sections (Hidden in Simple Mode) */}
                {!simpleMode && (
                    <div className="space-y-8">
                        <hr className="border-stroke dark:border-dark-3" />

                        <h3 className="text-lg font-bold text-dark dark:text-white">Detalles Avanzados</h3>

                        {/* Punto de Encuentro (Unified) */}
                        <div>
                            <h4 className="font-medium text-dark dark:text-white mb-3">Punto de Encuentro</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Nombre del Lugar</label>
                                    <input
                                        type="text"
                                        value={formData.meetingPoint?.name || ""}
                                        onChange={(e) => updateMeetingPoint("name", e.target.value)}
                                        className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                                        placeholder="Ej: Lobby del Hotel Principal"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Google Maps Link</label>
                                    <input
                                        type="text"
                                        value={formData.meetingPoint?.link || ""}
                                        onChange={(e) => updateMeetingPoint("link", e.target.value)}
                                        className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                                        placeholder="https://maps.google.com/..."
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Instrucciones / Descripción</label>
                                <textarea
                                    value={formData.meetingPoint?.description || ""}
                                    onChange={(e) => updateMeetingPoint("description", e.target.value)}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:text-white"
                                    rows={2}
                                    placeholder="Instrucciones breves para llegar..."
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsLocationPickerOpen(true)}
                                className="flex items-center gap-2 rounded-full border border-primary border-dashed px-4 py-2 text-primary hover:bg-primary/5 transition text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Seleccionar Ubicación en Mapa
                            </button>
                            {formData.meetingPoint?.coordinates && (
                                <p className="text-xs text-green-600 mt-1">
                                    ✓ ({formData.meetingPoint.coordinates.lat.toFixed(4)}, {formData.meetingPoint.coordinates.lng.toFixed(4)})
                                </p>
                            )}
                        </div>

                        {/* Programación y Fechas */}
                        <div>
                            <h3 className="text-lg font-bold text-dark dark:text-white mb-4">Programación y Fechas</h3>
                            <CalendarScheduler
                                defaults={currentDefaults}
                                availableDates={formData.availableDates || []}
                                onChange={(dates) => setFormData(prev => ({ ...prev, availableDates: dates }))}
                                onDefaultsChange={(newDefaults) => setFormData(prev => ({ ...prev, defaults: newDefaults }))}
                            />
                        </div>


                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 justify-end pt-6">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-lg border border-stroke px-8 py-3 font-medium text-dark hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-white/5 transition-all shadow-sm"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        className={`rounded-lg px-8 py-3 font-medium text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${isSubmitting ? "bg-primary/70 cursor-wait" : "bg-primary hover:bg-opacity-90 active:scale-95"}`}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Guardando..." : "Guardar Tour"}
                    </button>
                </div>
            </form>

            {isLocationPickerOpen && (
                <LocationPickerModal
                    isOpen={isLocationPickerOpen}
                    onClose={() => setIsLocationPickerOpen(false)}
                    onConfirm={handleLocationConfirm}
                    initialCoordinates={formData.meetingPoint?.coordinates}
                />
            )}
        </>
    );
}
