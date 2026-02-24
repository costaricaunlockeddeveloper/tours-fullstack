"use client";

import React, { useState, useEffect } from "react";
import { Package, ApiService, Place, PlaceImages } from "@/services/api-service";
import { PackageActivity } from "@/services/api-service";
import MediaGalleryEditor from "@/components/Admin/Commons/MediaGalleryEditor";
import Image from "next/image";
import { generateSlug } from "@/utils/generate-slug";

interface PackageFormProps {
    initialData?: Package;
    onSubmit: (data: Omit<Package, "id">) => void;
    isSubmitting?: boolean;
    onCancel?: () => void;
    simpleMode?: boolean;
}

export default function PackageForm({
    initialData,
    onSubmit,
    isSubmitting = false,
    onCancel,
    simpleMode = false,
}: PackageFormProps) {
    const [formData, setFormData] = useState<Partial<Package>>({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        description: initialData?.description || "",
        region: initialData?.region || "",
        price: initialData?.price || 0,
        priceChild: initialData?.priceChild || 0,
        rating: initialData?.rating || 0,
        reviews: initialData?.reviews || 0,
        images: initialData?.images || {},
        included: initialData?.included || [],
        excludes: initialData?.excludes || [],
        placeIds: initialData?.placeIds || [],
        activities: initialData?.activities || [],
        status: initialData?.status || 'DRAFT',
    });

    const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);
    const [placeSearch, setPlaceSearch] = useState("");

    useEffect(() => {
        ApiService.getPlaces({ status: 'PUBLISHED' })
            .then(setAvailablePlaces)
            .catch(console.error);
    }, []);

    // Auto-generate slug from name
    useEffect(() => {
        if (formData.name) {
            if (!initialData || initialData.status !== 'PUBLISHED') {
                setFormData(prev => ({ ...prev, slug: generateSlug(formData.name || "") }));
            }
        }
    }, [formData.name, initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation: Minimum 2 secondary assets
        const secondaryCount = formData.images?.secondaryAssets?.length || 0;
        if (secondaryCount < 2) {
            alert(`Se requieren al menos 2 imágenes secundarias (actualmente: ${secondaryCount}) para la galería.`);
            return;
        }

        onSubmit(formData as Omit<Package, "id">);
    };

    const filteredPlaces = availablePlaces.filter(p =>
        p.name.toLowerCase().includes(placeSearch.toLowerCase())
    );

    const togglePlace = (placeId: string) => {
        const currentIds = formData.placeIds || [];
        const newIds = currentIds.includes(placeId)
            ? currentIds.filter(id => id !== placeId)
            : [...currentIds, placeId];
        setFormData(prev => ({ ...prev, placeIds: newIds }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="rounded-xl bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                <h3 className="text-xl font-bold text-dark dark:text-white mb-6">Información Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Nombre del Paquete *</label>
                        <input
                            type="text"
                            required
                            value={formData.name || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Ej: Aventura en Volcán Arenal"
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Slug</label>
                        <input
                            type="text"
                            value={formData.slug || ""}
                            readOnly
                            className="w-full rounded-lg border border-stroke bg-gray-100 px-4 py-3 text-dark/60 outline-none dark:border-dark-3 dark:text-white/60 dark:bg-white/5 cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-dark-6">Se genera automáticamente del nombre.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Región</label>
                        <select
                            value={formData.region || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                        >
                            <option value="">Seleccionar Región</option>
                            <option value="Guanacaste">Guanacaste</option>
                            <option value="Puntarenas">Puntarenas</option>
                            <option value="Limón (Caribe)">Limón (Caribe)</option>
                            <option value="San José (Valle Central)">San José (Valle Central)</option>
                            <option value="Alajuela">Alajuela</option>
                            <option value="Heredia">Heredia</option>
                            <option value="Cartago">Cartago</option>
                            <option value="Zona Norte">Zona Norte</option>
                            <option value="Zona Sur">Zona Sur</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Precio Adulto (USD) *</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={formData.price || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                            placeholder="0.00"
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Precio Niño (USD)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.priceChild || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, priceChild: Number(e.target.value) }))}
                            placeholder="0.00"
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-dark dark:text-white mb-2">Descripción</label>
                        <textarea
                            value={formData.description || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe el paquete turístico..."
                            rows={4}
                            className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            {/* Media Gallery */}
            <div className="rounded-xl bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                <h3 className="text-xl font-bold text-dark dark:text-white mb-6">Galería Multimedia</h3>
                <MediaGalleryEditor
                    images={formData.images || {}}
                    onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
                    folderName="paquetes"
                    slug={formData.slug || "nuevo-paquete"}
                />
            </div>

            {/* Destinations Selector */}
            <div className="rounded-xl bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                <h3 className="text-xl font-bold text-dark dark:text-white mb-4">Destinos Incluidos</h3>
                <input
                    type="text"
                    value={placeSearch}
                    onChange={(e) => setPlaceSearch(e.target.value)}
                    placeholder="Buscar destino..."
                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary mb-4"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto">
                    {filteredPlaces.map(place => {
                        const isSelected = formData.placeIds?.includes(place.id);
                        return (
                            <div
                                key={place.id}
                                onClick={() => togglePlace(place.id)}
                                className={`cursor-pointer rounded-lg border p-2 flex flex-col gap-2 transition-all ${isSelected
                                    ? "border-primary bg-primary/5 dark:bg-primary/20 ring-1 ring-primary"
                                    : "border-stroke dark:border-dark-3 hover:border-primary/50"
                                    }`}
                            >
                                <div className="relative h-20 w-full overflow-hidden rounded-md">
                                    {place.images?.heroImage?.path ? (
                                        <Image src={place.images.heroImage.path} alt={place.name} fill className="object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-dark-2">
                                            <span className="text-xs text-gray-400">Sin foto</span>
                                        </div>
                                    )}
                                    {isSelected && (
                                        <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs font-semibold text-dark dark:text-white line-clamp-1 text-center">
                                    {place.name}
                                </span>
                            </div>
                        );
                    })}
                </div>
                {formData.placeIds && formData.placeIds.length > 0 && (
                    <p className="mt-3 text-sm text-primary font-medium">
                        {formData.placeIds.length} destino{formData.placeIds.length > 1 ? "s" : ""} seleccionado{formData.placeIds.length > 1 ? "s" : ""}
                    </p>
                )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 justify-end">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-stroke bg-white px-6 py-3 font-medium text-dark hover:bg-gray-50 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-white/5"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-lg bg-primary px-8 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
                >
                    {isSubmitting ? "Guardando..." : initialData ? "Actualizar Paquete" : "Crear Paquete"}
                </button>
            </div>
        </form>
    );
}
