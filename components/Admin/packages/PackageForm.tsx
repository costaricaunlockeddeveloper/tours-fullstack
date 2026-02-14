"use client";

import React, { useEffect, useState } from "react";
import { Package, ApiService, DailyItinerary, Tour } from "@/services/api-service";
import GalleryUploader from "@/components/Admin/GalleryUploader";
import ListManager from "@/components/Admin/Commons/ListManager";
import ItineraryManager from "@/components/Admin/Commons/ItineraryManager";
import StarRatingInput from "@/components/Admin/Commons/StarRatingInput";

interface PackageFormProps {
    initialData?: Partial<Package>;
    availableTours?: Tour[];
    onSubmit: (data: Omit<Package, "id">) => Promise<void>;
    isSubmitting?: boolean;
    onCancel?: () => void;
    simpleMode?: boolean;
}

export default function PackageForm({ initialData, availableTours = [], onSubmit, isSubmitting = false, onCancel, simpleMode = false }: PackageFormProps) {
    // Form state
    const [title, setTitle] = useState(initialData?.title || "");
    const [price, setPrice] = useState(initialData?.price || 0);
    const [description, setDescription] = useState(initialData?.description || "");
    const [durationDays, setDurationDays] = useState(initialData?.duration_days || 1);
    const [durationNights, setDurationNights] = useState(initialData?.duration_nights || 0);
    const [rating, setRating] = useState(initialData?.rating || 0);
    const [reviews, setReviews] = useState(initialData?.reviews || 0);
    const [location, setLocation] = useState(initialData?.location || "");

    // Arrays
    const [tags, setTags] = useState<string>(initialData?.tags?.join(", ") || "");
    const [included, setIncluded] = useState<string[]>(initialData?.included || []);
    const [excludes, setExcludes] = useState<string[]>(initialData?.excludes || []); // New field
    const [selectedTourIds, setSelectedTourIds] = useState<string[]>(initialData?.tourIds || []);

    // Media
    const [images, setImages] = useState<string[]>(initialData?.images || []);

    // Itinerary
    const [itinerary, setItinerary] = useState<DailyItinerary[]>(initialData?.itinerary || []);

    // Handlers
    const toggleTourSelection = (tourId: string) => {
        setSelectedTourIds(prev =>
            prev.includes(tourId) ? prev.filter(id => id !== tourId) : [...prev, tourId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const finalTags = tags.split(",").map(t => t.trim()).filter(t => t !== "");

        const data: Omit<Package, "id"> = {
            title,
            description,
            price,
            duration_days: durationDays,
            duration_nights: durationNights,
            rating,
            reviews,
            location,
            tags: finalTags,
            included,
            excludes,
            images,
            itinerary,
            tourIds: selectedTourIds,
            tours: [], // Backend handles hydration
            priceType: "per_person",
            includesTransport: included.some(i => i.toLowerCase().includes("transfer") || i.toLowerCase().includes("transporte")),
            name: title
        };

        await onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-2 p-6 rounded-xl shadow-1 space-y-6">

            {/* 0. Tours Selection */}
            {(!simpleMode || availableTours.length > 0) && (
                <div>
                    <h3 className="text-lg font-bold text-dark dark:text-white mb-4">
                        Tours Incluidos (Relación)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {availableTours.map((tour) => (
                            <label
                                key={tour.id}
                                className={`
                                    relative flex items-start gap-3 p-4 rounded-xl cursor-pointer border transition-all duration-200
                                    ${selectedTourIds.includes(tour.id)
                                        ? "bg-primary/5 border-primary shadow-sm"
                                        : "bg-gray-50 dark:bg-dark-2 border-transparent hover:border-stroke dark:hover:border-dark-3"}
                                `}
                            >
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={selectedTourIds.includes(tour.id)}
                                        onChange={() => toggleTourSelection(tour.id)}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-medium text-dark dark:text-white text-sm">{tour.name}</span>
                                    {tour.duration && <span className="text-xs text-dark-6">{tour.duration}</span>}
                                </div>
                            </label>
                        ))}
                        {availableTours.length === 0 && (
                            <p className="text-sm text-dark-6 italic col-span-full">
                                No hay tours disponibles para seleccionar.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* 1. Información General */}
            <div>
                <h3 className="text-lg font-bold text-dark dark:text-white mb-4">
                    Información General
                </h3>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="col-span-2">
                        <label className="mb-2.5 block font-medium text-dark dark:text-white">Título del Paquete <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            placeholder="Ej. Costa Rica Adventure Package"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="mb-2.5 block font-medium text-dark dark:text-white">Descripción</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            placeholder="Descripción atractiva del paquete..."
                        />
                    </div>

                    <div>
                        <label className="mb-2.5 block font-medium text-dark dark:text-white">Precio (Adulto - USD) <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <span className="absolute left-4 top-3 text-dark-6">$</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                required
                                min="0"
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 pl-8 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Días</label>
                            <input
                                type="number"
                                value={durationDays}
                                onChange={(e) => setDurationDays(Number(e.target.value))}
                                min="1"
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="mb-2.5 block font-medium text-dark dark:text-white">Noches</label>
                            <input
                                type="number"
                                value={durationNights}
                                onChange={(e) => setDurationNights(Number(e.target.value))}
                                min="0"
                                className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <label className="mb-2.5 block font-medium text-dark dark:text-white">Etiquetas</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Best Seller, Honeymoon, Family (separadas por coma)"
                            className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        />
                    </div>

                    {!simpleMode && (
                        <>
                            <div className="col-span-2">
                                <label className="mb-2.5 block font-medium text-dark dark:text-white">Ubicación (Texto para Card)</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Ej: Costa Rica (Multiple Locations)"
                                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                />
                            </div>
                            <StarRatingInput
                                value={rating}
                                onChange={setRating}
                                label="Calificación (0-5)"
                            />
                            <div>
                                <label className="mb-2.5 block font-medium text-dark dark:text-white">Cantidad de Reseñas</label>
                                <input
                                    type="number" min="0"
                                    value={reviews}
                                    onChange={(e) => setReviews(parseInt(e.target.value))}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-5 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Multimedia */}
            <div>
                <h3 className="text-lg font-bold text-dark dark:text-white mb-4">
                    Galería Multimedia
                </h3>

                <GalleryUploader
                    images={images}
                    onImagesChange={setImages}
                    folderName="packages"
                    slug={initialData?.id || "new-package"}
                    title=""
                />
            </div>

            {/* Advanced Sections */}
            {!simpleMode && (
                <div className="space-y-8">
                    <hr className="border-stroke dark:border-dark-3" />

                    <h3 className="text-lg font-bold text-dark dark:text-white">Detalles Avanzados</h3>

                    {/* 3. Inclusiones y Exclusiones */}
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <ListManager
                                label="Lo que incluye (Includes)"
                                items={included}
                                onItemsChange={setIncluded}
                                placeholder="Ej: Desayuno diario"
                            />
                            <ListManager
                                label="Lo que NO incluye (Excludes)"
                                items={excludes}
                                onItemsChange={setExcludes}
                                placeholder="Ej: Propinas, Vuelos internacionales"
                            />
                        </div>
                    </div>

                    {/* 4. Itinerario */}
                    <div>
                        <h3 className="text-lg font-bold text-dark dark:text-white mb-4">Itinerario</h3>
                        <ItineraryManager
                            itinerary={itinerary}
                            onItineraryChange={setItinerary}
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
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Guardando...
                        </>
                    ) : (
                        "Guardar Paquete"
                    )}
                </button>
            </div>
        </form>
    );
}
