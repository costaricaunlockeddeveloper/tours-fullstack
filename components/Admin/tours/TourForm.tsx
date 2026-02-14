
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tour, Place } from "@/services/api-service";
import LocationPickerModal from "@/components/Admin/LocationPickerModal";
import GalleryUploader from "@/components/Admin/GalleryUploader";
import ListManager from "@/components/Admin/Commons/ListManager";
import StarRatingInput from "@/components/Admin/Commons/StarRatingInput";
import CalendarScheduler from "@/components/Admin/tours/CalendarScheduler";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

interface TourFormProps {
    initialData?: Partial<Tour>;
    availablePlaces: Place[]; // For the selection list
    onSubmit: (data: Partial<Tour>) => Promise<void>;
    isSubmitting: boolean;
    onCancel?: () => void;
    simpleMode?: boolean; // New prop for simplified creation
}

export default function TourForm({ initialData, availablePlaces, onSubmit, isSubmitting, onCancel, simpleMode = false }: TourFormProps) {
    // Initial State
    const defaultFormState: Partial<Tour> = {
        name: "",
        description: "",
        price: 0,
        priceChild: 0,
        placeIds: [],
        duration: "",
        difficulty: "Moderado",
        maxQuota: 0,
        meetingPoint: "",
        meetingPointLink: "",
        meetingPointCoordinates: { lat: 0, lng: 0 },
        rating: 0,
        reviews: 0,
        location: "",
        // Lists
        features: {
            accommodation: false,
            transport: false,
            entranceFee: false,
            nextTour: false,
            guide: false,
            translator: false,
        },
        whatItOffers: [],
        schedules: [],
        availableDates: [],
        cancellationPolicy: "",
        gallery: []
    };

    const [formData, setFormData] = useState<Partial<Tour>>(initialData || defaultFormState);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...defaultFormState,
                ...initialData,
                features: initialData.features || defaultFormState.features,
                whatItOffers: initialData.whatItOffers || [],
                schedules: initialData.schedules || [],
                availableDates: initialData.availableDates || [],
                gallery: initialData.gallery || []
            }));
        }
    }, [initialData]);

    const togglePlaceSelection = (placeId: string) => {
        setFormData((prev) => {
            const currentIds = prev.placeIds || [];
            const isSelected = currentIds.includes(placeId);
            if (isSelected) {
                return { ...prev, placeIds: currentIds.filter(id => id !== placeId) };
            } else {
                return { ...prev, placeIds: [...currentIds, placeId] };
            }
        });
    };

    const handleLocationConfirm = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            meetingPointCoordinates: { lat, lng },
            meetingPointLink: `https://www.google.com/maps/?q=${lat},${lng}`
        }));
        setIsLocationPickerOpen(false);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    // Gallery is now handled by GalleryUploader


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
                        <div className="md:col-span-2">
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Nombre del Tour <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                placeholder="Ej: Aventura en la Amazonía"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary disabled:cursor-default disabled:bg-gray-2 dark:disabled:bg-dark-2"
                                required
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
                        {!simpleMode && (
                            <div className="md:col-span-2">
                                <label className="mb-2.5 block font-medium text-dark dark:text-white">Ubicación (Texto para Card)</label>
                                <input
                                    type="text"
                                    placeholder="Ej: La Fortuna, San Carlos"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Duración</label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                placeholder="Ej: 3 días"
                                required={simpleMode}
                            />
                        </div>
                        <div>
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Dificultad</label>
                            <select
                                value={formData.difficulty}
                                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            >
                                <option value="Fácil">Fácil</option>
                                <option value="Moderado">Moderado</option>
                                <option value="Difícil">Difícil</option>
                                <option value="Extremo">Extremo</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Cupo Máximo</label>
                            <input
                                type="number"
                                value={formData.maxQuota}
                                onChange={(e) => setFormData({ ...formData, maxQuota: Number(e.target.value) })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                required={simpleMode}
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

                {/* 3. Multimedia */}
                <div>
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-4">Imágenes del Tour</h3>
                    <GalleryUploader
                        images={formData.gallery || []}
                        onImagesChange={(newImages) => setFormData(prev => ({ ...prev, gallery: newImages }))}
                        folderName="tours"
                        slug={initialData?.id || formData.name?.toLowerCase() || "new-tour"}
                        title=""
                    />
                </div>

                {/* 4. Advanced Sections (Hidden in Simple Mode) */}
                {!simpleMode && (
                    <div className="space-y-8">
                        <hr className="border-stroke dark:border-dark-3" />

                        <h3 className="text-lg font-bold text-dark dark:text-white">Detalles Avanzados</h3>

                        {/* Incluye (Checkboxes) */}
                        <div>
                            <label className="mb-4 block font-medium text-dark dark:text-white">Servicios Incluidos</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" checked={formData.features?.accommodation} onChange={e => setFormData({ ...formData, features: { ...formData.features, accommodation: e.target.checked } })} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                                    <span>Alojamiento</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" checked={formData.features?.transport} onChange={e => setFormData({ ...formData, features: { ...formData.features, transport: e.target.checked } })} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                                    <span>Transporte</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" checked={formData.features?.entranceFee} onChange={e => setFormData({ ...formData, features: { ...formData.features, entranceFee: e.target.checked } })} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                                    <span>Entradas</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" checked={formData.features?.guide} onChange={e => setFormData({ ...formData, features: { ...formData.features, guide: e.target.checked } })} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                                    <span>Guía</span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <input type="checkbox" checked={formData.features?.translator} onChange={e => setFormData({ ...formData, features: { ...formData.features, translator: e.target.checked } })} className="w-5 h-5 rounded text-primary focus:ring-primary" />
                                    <span>Traductor</span>
                                </label>
                            </div>
                        </div>

                        {/* What It Offers - ListManager */}
                        <div className="mb-6">
                            <ListManager
                                label="Lo que ofrece el tour"
                                items={formData.whatItOffers || []}
                                onItemsChange={(items) => setFormData({ ...formData, whatItOffers: items })}
                                placeholder="Ej: Transporte ida y vuelta"
                            />
                        </div>

                        {/* Precios */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="mb-2 block font-medium text-dark dark:text-white">Precio Adultos ($)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block font-medium text-dark dark:text-white">Precio Niños ($)</label>
                                <input
                                    type="number"
                                    value={formData.priceChild}
                                    onChange={(e) => setFormData({ ...formData, priceChild: Number(e.target.value) })}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </div>

                        {/* Punto de Encuentro */}
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <label className="block font-medium text-dark dark:text-white">Punto de Encuentro</label>
                                <button
                                    type="button"
                                    onClick={() => setIsLocationPickerOpen(true)}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Seleccionar en Mapa
                                </button>
                            </div>
                            <input
                                type="text"
                                value={formData.meetingPoint}
                                onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                placeholder="Ej: Lobby del Hotel Principal"
                            />
                        </div>

                        {/* Horarios */}
                        <CalendarScheduler
                            schedules={formData.schedules || []}
                            availableDates={formData.availableDates || []}
                            onChange={(schedules, dates) => setFormData({ ...formData, schedules, availableDates: dates })}
                        />

                        {/* Políticas */}
                        <div>
                            <label className="mb-2 block font-medium text-dark dark:text-white">Políticas de Cancelación</label>
                            <textarea
                                value={formData.cancellationPolicy}
                                onChange={(e) => setFormData({ ...formData, cancellationPolicy: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                rows={2}
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
                            disabled={isSubmitting || isUploading}
                        >
                            Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        className={`rounded-lg px-8 py-3 font-medium text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${isSubmitting || isUploading ? "bg-primary/70 cursor-wait" : "bg-primary hover:bg-opacity-90 active:scale-95"}`}
                        disabled={isSubmitting || isUploading}
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
                    initialCoordinates={formData.meetingPointCoordinates}
                />
            )}
        </>
    );
}
