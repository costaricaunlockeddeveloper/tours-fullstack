"use client";

import { useState, useEffect } from "react";
import { Place } from "@/services/api-service";
import { generateSlug } from "@/utils/generate-slug";
import LocationPickerModal from "@/components/Admin/LocationPickerModal";
import MediaGalleryEditor from "@/components/Admin/Commons/MediaGalleryEditor";

interface DestinationFormProps {
    initialData?: Partial<Place>;
    onSubmit: (data: Partial<Place>) => Promise<void>;
    isSubmitting: boolean;
    onCancel?: () => void;
    simpleMode?: boolean;
}

export default function DestinationForm({ initialData, onSubmit, isSubmitting, onCancel, simpleMode = false }: DestinationFormProps) {
    // Initial State including new fields
    const defaultFormState: Partial<Place> = {
        name: "",
        slug: "",
        description: "",
        region: "",
        ecosystem: "",

        images: {
            heroImage: undefined,
            secondaryAssets: [],
        },
        coordinates: { lat: 0, lng: 0 }
    };

    const [formData, setFormData] = useState<Partial<Place>>(initialData || defaultFormState);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);

    // Sync initialData if it changes late (good for edits)
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...defaultFormState,
                ...initialData,
                coordinates: initialData.coordinates || { lat: 0, lng: 0 },
                images: initialData.images || { heroImage: undefined, secondaryAssets: [] },
            }));
        }
    }, [initialData]);



    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Auto-generate slug if missing
        if (!formData.slug && formData.name) {
            formData.slug = generateSlug(formData.name);
        }

        if (!formData.slug) {
            alert("El ID/Slug es obligatorio para crear la carpeta de imágenes.");
            return;
        }

        const placeData: Partial<Place> = {
            ...formData,
            description: formData.description || "Descripción pendiente...",
        };

        console.log("Submitting Place Data:", JSON.stringify(placeData.images?.secondaryAssets, null, 2));

        await onSubmit(placeData);
    };



    const handleNameChange = (val: string) => {
        setFormData(prev => ({
            ...prev,
            name: val,
            slug: initialData?.slug ? prev.slug : generateSlug(val),
        }));
    };

    const handleLocationConfirm = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            coordinates: { lat, lng }
        }));
        setIsLocationPickerOpen(false);
    };

    return (
        <>
            <form id="placeForm" onSubmit={handleFormSubmit} className="space-y-8 bg-white dark:bg-gray-dark p-6 rounded-lg shadow-1">
                {/* Section 1: Información Básica */}
                <div>
                    <h4 className="flex items-center gap-2 mb-4 text-lg font-semibold text-primary">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">1</span>
                        Información Básica
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="mb-2 block font-medium text-dark dark:text-white text-sm">
                                Nombre Común
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                maxLength={100}
                                required
                            />
                            <p className="mt-1 text-[10px] text-right text-gray-400">
                                {formData.name?.length || 0}/100
                            </p>
                        </div>
                        <div>
                            <label className="mb-2 block font-medium text-dark dark:text-white text-sm">
                                ID / Slug (URL Friendly)
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                readOnly
                                className="w-full rounded-lg border border-stroke bg-gray-100 dark:bg-white/5 px-5 py-3 text-dark/60 outline-none dark:border-dark-3 dark:text-white/60 cursor-not-allowed font-mono text-sm"
                                placeholder="Auto-generado del nombre"
                            />
                            {!simpleMode && <p className="text-xs text-gray-500 mt-1">Usado para la carpeta: /public/destino/{formData.slug || "slug"}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-medium text-dark dark:text-white text-sm">
                                Región
                            </label>
                            <select
                                value={formData.region}
                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
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
                            <label className="mb-2 block font-medium text-dark dark:text-white text-sm">
                                Tipo de Clima/Ecosistema
                            </label>
                            <select
                                value={formData.ecosystem}
                                onChange={(e) => setFormData({ ...formData, ecosystem: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            >
                                <option value="">Seleccionar Clima/Ecosistema</option>
                                <option value="Bosque Nuboso">Bosque Nuboso</option>
                                <option value="Bosque Lluvioso">Bosque Lluvioso</option>
                                <option value="Bosque Seco">Bosque Seco</option>
                                <option value="Playa">Playa</option>
                                <option value="Montaña">Montaña</option>
                                <option value="Volcánico">Volcánico</option>
                                <option value="Manglar">Manglar</option>
                                <option value="Urbano">Urbano</option>
                            </select>
                        </div>
                    </div>
                </div>

                {!simpleMode && (
                    <>
                        <hr className="border-stroke dark:border-dark-3" />

                        {/* Section 2: Ubicación */}
                        <div>
                            <h4 className="flex items-center gap-2 mb-4 text-lg font-semibold text-primary">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">2</span>
                                Ubicación y Coordenadas
                            </h4>

                            {/* Sub-section: Ubicación (Full Row) */}
                            <div className="mb-6 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-dashed border-stroke dark:border-dark-3">
                                <label className="mb-2 block font-medium text-dark dark:text-white text-sm">
                                    Ubicación y Coordenadas
                                </label>
                                <div className="flex flex-col xl:flex-row gap-4 items-center">
                                    <button
                                        type="button"
                                        onClick={() => setIsLocationPickerOpen(true)}
                                        className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-opacity-90 transition-all shadow-md flex items-center justify-center gap-2 whitespace-nowrap min-w-fit"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Buscar en mapa
                                    </button>

                                    <div className="flex gap-2 flex-1 w-full">
                                        <input
                                            type="number"
                                            step="any"
                                            placeholder="Latitud"
                                            value={formData.coordinates?.lat}
                                            onChange={(e) => setFormData({ ...formData, coordinates: { ...formData.coordinates!, lat: parseFloat(e.target.value) } })}
                                            className="w-full rounded-lg border border-stroke bg-transparent px-3 py-3 text-dark outline-none dark:border-dark-3 dark:text-white"

                                        />
                                        <input
                                            type="number"
                                            step="any"
                                            placeholder="Longitud"
                                            value={formData.coordinates?.lng}
                                            onChange={(e) => setFormData({ ...formData, coordinates: { ...formData.coordinates!, lng: parseFloat(e.target.value) } })}
                                            className="w-full rounded-lg border border-stroke bg-transparent px-3 py-3 text-dark outline-none dark:border-dark-3 dark:text-white"

                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="mb-2 block font-medium text-dark dark:text-white text-sm">
                                    Descripción Completa (Contenido)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white dark:focus:border-primary"
                                    rows={5}
                                    maxLength={1500}
                                    required
                                />
                                <p className="mt-1 text-[10px] text-right text-gray-400">
                                    {formData.description?.length || 0}/1500
                                </p>
                            </div>

                        </div>

                        <hr className="border-stroke dark:border-dark-3" />

                        {/* Section 3: Multimedia */}
                        <div className="space-y-6">
                            <h4 className="flex items-center gap-2 text-lg font-semibold text-primary">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">3</span>
                                Multimedia
                            </h4>

                            <MediaGalleryEditor
                                images={formData.images || {}}
                                onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
                                folderName="destino"
                                slug={formData.slug || "nuevo-destino"}
                            />
                        </div>
                    </>
                )}

                <div className="flex gap-4 justify-end pt-4 border-t border-stroke dark:border-dark-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-lg border border-stroke px-6 py-3 font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white dark:hover:bg-white/5 transition-all"
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
                            "Guardar Destino"
                        )}
                    </button>
                </div>
            </form>

            {isLocationPickerOpen && (
                <LocationPickerModal
                    isOpen={isLocationPickerOpen}
                    onClose={() => setIsLocationPickerOpen(false)}
                    onConfirm={handleLocationConfirm}
                    initialCoordinates={formData.coordinates}
                />
            )}
        </>
    );
}
