"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Place, AssetMeta } from "@/services/api-service";
import { generateSlug } from "@/utils/generate-slug";
import LocationPickerModal from "@/components/Admin/LocationPickerModal";

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
        googleMapsLink: "",
        images: {
            heroImage: undefined,
            secondaryAssets: [],
        },
        coordinates: { lat: 0, lng: 0 }
    };

    const [formData, setFormData] = useState<Partial<Place>>(initialData || defaultFormState);
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

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

        await onSubmit(placeData);
    };



    // Always auto-generate slug from name
    const handleNameChange = (val: string) => {
        setFormData(prev => ({
            ...prev,
            name: val,
            slug: generateSlug(val),
        }));
    };

    const handleLocationConfirm = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            coordinates: { lat, lng },
            googleMapsLink: `https://www.google.com/maps/?q=${lat},${lng}`
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
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-2 block font-medium text-dark dark:text-white text-sm">
                                ID / Slug (URL Friendly)
                            </label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-gray-50 px-4 py-3 text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-white font-mono text-sm"
                                required={!simpleMode}
                                placeholder="ej: manuel-antonio"
                                readOnly={!!initialData?.id && !!initialData?.slug} // Only lock if ID AND slug exist
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

                                    <div className="flex-1 w-full">
                                        <input type="text" value={formData.googleMapsLink} onChange={e => setFormData({ ...formData, googleMapsLink: e.target.value })} className="input-class w-full border border-stroke rounded-lg p-3 dark:bg-transparent dark:border-dark-3" placeholder="Link Google Maps (Auto)" />
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
                                    required
                                />
                            </div>

                        </div>

                        <hr className="border-stroke dark:border-dark-3" />

                        {/* Section 3: Multimedia */}
                        <div className="space-y-6">
                            <h4 className="flex items-center gap-2 text-lg font-semibold text-primary">
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">3</span>
                                Multimedia
                            </h4>

                            {/* Hero Image */}
                            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-dashed border-stroke dark:border-dark-3">
                                <label className="block font-medium text-dark dark:text-white mb-2">
                                    Hero Image (Alta Resolución 1920x1080)
                                </label>
                                <p className="text-xs text-gray-500 mb-4">
                                    Crucial: Debe tener una zona segura oscura o degradada para que el texto sea legible.
                                </p>

                                <div className="relative border-2 border-dashed border-stroke dark:border-dark-3 rounded-lg p-6 text-center hover:bg-white dark:hover:bg-dark-2 transition-all cursor-pointer group mb-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            if (!formData.slug) {
                                                alert("Debes definir un nombre/slug primero.");
                                                e.target.value = "";
                                                return;
                                            }

                                            setIsUploading(true);
                                            try {
                                                const payload = new FormData();
                                                payload.append("file", file);
                                                payload.append("slug", formData.slug);
                                                payload.append("folder", "destino");

                                                const res = await fetch("/api/upload", {
                                                    method: "POST",
                                                    body: payload,
                                                });
                                                const data = await res.json();
                                                if (!data.success) throw new Error(data.message || "Upload failed");

                                                const heroAsset: AssetMeta = {
                                                    path: data.url,
                                                    size: file.size,
                                                    typefile: file.type,
                                                };
                                                setFormData(prev => ({
                                                    ...prev,
                                                    images: { ...prev.images, heroImage: heroAsset },
                                                }));
                                            } catch (err) {
                                                console.error(err);
                                                alert("Error subiendo Hero Image");
                                            } finally {
                                                setIsUploading(false);
                                                e.target.value = "";
                                            }
                                        }}
                                        disabled={isUploading}
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </span>
                                        <p className="text-sm font-medium text-dark dark:text-white">
                                            {isUploading ? "Subiendo..." : "Clic o arrastra para cambiar Hero Image"}
                                        </p>
                                    </div>
                                </div>

                                {formData.images?.heroImage?.path && (
                                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-stroke shadow-md">
                                        <Image src={formData.images.heroImage.path} alt="Hero" fill className="object-cover" />
                                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                            {(formData.images.heroImage.size / 1024).toFixed(0)} KB · {formData.images.heroImage.typefile}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Secondary Assets (Images, 360, Videos) */}
                            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-6 border border-dashed border-stroke dark:border-dark-3">
                                <label className="block font-medium text-dark dark:text-white mb-2">
                                    Assets Secundarios (Imágenes, 360, Videos)
                                </label>
                                <p className="text-xs text-gray-500 mb-4">
                                    Sube imágenes adicionales, fotos 360 o videos para la galería.
                                </p>

                                <div className="relative border-2 border-dashed border-stroke dark:border-dark-3 rounded-lg p-6 text-center hover:bg-white dark:hover:bg-dark-2 transition-all cursor-pointer group mb-4">
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        multiple
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={async (e) => {
                                            const files = e.target.files;
                                            if (!files || files.length === 0) return;
                                            if (!formData.slug) {
                                                alert("Debes definir un nombre/slug primero.");
                                                e.target.value = "";
                                                return;
                                            }

                                            setIsUploading(true);
                                            try {
                                                const newAssets: AssetMeta[] = [];
                                                for (const file of Array.from(files)) {
                                                    const payload = new FormData();
                                                    payload.append("file", file);
                                                    payload.append("slug", formData.slug!);
                                                    payload.append("folder", "destino");

                                                    const res = await fetch("/api/upload", {
                                                        method: "POST",
                                                        body: payload,
                                                    });
                                                    const data = await res.json();
                                                    if (!data.success) throw new Error(data.message || "Upload failed");

                                                    newAssets.push({
                                                        path: data.url,
                                                        size: file.size,
                                                        typefile: file.type,
                                                    });
                                                }
                                                setFormData(prev => ({
                                                    ...prev,
                                                    images: {
                                                        ...prev.images,
                                                        secondaryAssets: [
                                                            ...(prev.images?.secondaryAssets || []),
                                                            ...newAssets,
                                                        ],
                                                    },
                                                }));
                                            } catch (err) {
                                                console.error(err);
                                                alert("Error subiendo archivos");
                                            } finally {
                                                setIsUploading(false);
                                                e.target.value = "";
                                            }
                                        }}
                                        disabled={isUploading}
                                    />
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                        </span>
                                        <p className="text-sm font-medium text-dark dark:text-white">
                                            {isUploading ? "Subiendo..." : "Clic o arrastra archivos (múltiples)"}
                                        </p>
                                    </div>
                                </div>

                                {/* Preview of secondary assets */}
                                {(formData.images?.secondaryAssets || []).length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {formData.images!.secondaryAssets!.map((asset, idx) => (
                                            <div key={idx} className="relative group rounded-lg overflow-hidden border border-stroke shadow-sm">
                                                {asset.typefile.startsWith("video/") ? (
                                                    <video src={asset.path} className="w-full h-32 object-cover" muted />
                                                ) : (
                                                    <div className="relative w-full h-32">
                                                        <Image src={asset.path} alt={`Asset ${idx + 1}`} fill className="object-cover" />
                                                    </div>
                                                )}
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 flex justify-between items-center">
                                                    <span>{(asset.size / 1024).toFixed(0)} KB</span>
                                                    <span>{asset.typefile.split("/")[1]}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            images: {
                                                                ...prev.images,
                                                                secondaryAssets: (prev.images?.secondaryAssets || []).filter((_, i) => i !== idx),
                                                            },
                                                        }));
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                <div className="flex gap-4 justify-end pt-4 border-t border-stroke dark:border-dark-3">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-lg border border-stroke px-6 py-3 font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white dark:hover:bg-white/5 transition-all"
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
