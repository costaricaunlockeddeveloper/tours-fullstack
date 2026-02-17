"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Place, ApiService, AssetMeta } from "@/services/api-service";
import { generateSlug } from "@/utils/generate-slug";
import Link from "next/link";
import Image from "next/image";
import EditableSection from "@/components/Admin/ui/EditableSection";
import LocationPickerModal from "@/components/Admin/LocationPickerModal";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">Cargando mapa...</div>
});

export default function DestinationDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [place, setPlace] = useState<Place | null>(null);
    const [loading, setLoading] = useState(true);

    // Editing States
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
    const [formData, setFormData] = useState<Partial<Place>>({});
    const [isSaving, setIsSaving] = useState(false);


    // Specific state for location picker
    const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchPlace = async () => {
            if (!id) return;
            try {
                const data = await ApiService.getPlace(id);
                setPlace(data);
                setFormData(data);
            } catch (error) {
                console.error("Error fetching place:", error);
                router.push("/admin/destinos");
            } finally {
                setLoading(false);
            }
        };

        fetchPlace();
    }, [id, router]);

    const handleDelete = async () => {
        if (confirm("¿Estás seguro de eliminar este destino?")) {
            await ApiService.deletePlace(id);
            router.push("/admin/destinos");
        }
    };

    const toggleEdit = (section: string) => {
        setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
        if (!editMode[section] && place) {
            setFormData(place); // Reset form data to current place data when starting edit
        }
    };

    const handleSave = async (section: string) => {
        try {
            setIsSaving(true);
            let dataToSave = { ...formData };
            await ApiService.updatePlace(id, dataToSave);
            setPlace(prev => ({ ...prev, ...dataToSave } as Place));
            setEditMode(prev => ({ ...prev, [section]: false }));
        } catch (error) {
            console.error("Error updating place:", error);
            alert("Error al actualizar.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLocationPick = (lat: number, lng: number) => {
        setFormData(prev => ({
            ...prev,
            coordinates: { lat, lng },
            googleMapsLink: `https://www.google.com/maps/?q=${lat},${lng}`
        }));
        setIsLocationPickerOpen(false);
    };

    if (loading) return <div className="p-10 text-center">Cargando detalles...</div>;
    if (!place) return null;

    const heroPath = place.images?.heroImage?.path;
    const secondaryPaths = (place.images?.secondaryAssets || []).map(a => a.path).filter(Boolean) as string[];
    const allImagePaths = [heroPath, ...secondaryPaths].filter(Boolean) as string[];
    const hasImages = allImagePaths.length > 0;

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/destinos"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark hover:shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    >
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                            <path d="M14.707 16.707a1 1 0 01-1.414 0L6 9.414l7.293-7.293a1 1 0 011.414 1.414L8.414 9.414l6.293 6.293a1 1 0 010 1.414z" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-dark dark:text-white">{place.name}</h2>
                        <p className="text-sm text-dark-6">Detalles del destino</p>
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleDelete}
                        className="rounded-lg bg-red-50 px-6 py-2 font-medium text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                    >
                        Eliminar Destino
                    </button>
                </div>
            </div>

            {/* Top Section: Gallery */}
            <EditableSection
                title="Galería Multimedia"
                isEditing={!!editMode['gallery']}
                onEdit={() => toggleEdit('gallery')}
                onSave={() => handleSave('gallery')}
                onCancel={() => toggleEdit('gallery')}
                isSaving={isSaving}
                className="mb-8"
            >
                {editMode['gallery'] ? (
                    <div className="space-y-6">
                        {/* Hero Image Edit */}
                        <div>
                            <label className="block font-medium text-dark dark:text-white mb-2 text-sm">Hero Image</label>
                            <div className="relative border-2 border-dashed border-stroke dark:border-dark-3 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-dark-2 transition-all cursor-pointer mb-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const slug = formData.slug || place.slug || place.id;
                                        setIsUploading(true);
                                        try {
                                            const payload = new FormData();
                                            payload.append("file", file);
                                            payload.append("slug", slug);
                                            payload.append("folder", "destino");
                                            const res = await fetch("/api/upload", { method: "POST", body: payload });
                                            const data = await res.json();
                                            if (!data.success) throw new Error(data.message);
                                            const heroAsset: AssetMeta = { path: data.url, size: file.size, typefile: file.type };
                                            setFormData(prev => ({ ...prev, images: { ...prev.images, heroImage: heroAsset } }));
                                        } catch (err) { console.error(err); alert("Error subiendo Hero Image"); }
                                        finally { setIsUploading(false); e.target.value = ""; }
                                    }}
                                    disabled={isUploading}
                                />
                                <div className="flex items-center justify-center gap-2 text-sm text-dark dark:text-white">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    {isUploading ? "Subiendo..." : "Cambiar Hero Image"}
                                </div>
                            </div>
                            {formData.images?.heroImage?.path && (
                                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-stroke">
                                    <Image src={formData.images.heroImage.path} alt="Hero" fill className="object-cover" />
                                    <span className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                                        {(formData.images.heroImage.size / 1024).toFixed(0)} KB · {formData.images.heroImage.typefile}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Secondary Assets Edit */}
                        <div>
                            <label className="block font-medium text-dark dark:text-white mb-2 text-sm">Assets Secundarios</label>
                            <div className="relative border-2 border-dashed border-stroke dark:border-dark-3 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-dark-2 transition-all cursor-pointer mb-3">
                                <input
                                    type="file"
                                    accept="image/*,video/*"
                                    multiple
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={async (e) => {
                                        const files = e.target.files;
                                        if (!files || files.length === 0) return;
                                        const slug = formData.slug || place.slug || place.id;
                                        setIsUploading(true);
                                        try {
                                            const newAssets: AssetMeta[] = [];
                                            for (const file of Array.from(files)) {
                                                const payload = new FormData();
                                                payload.append("file", file);
                                                payload.append("slug", slug);
                                                payload.append("folder", "destino");
                                                const res = await fetch("/api/upload", { method: "POST", body: payload });
                                                const data = await res.json();
                                                if (!data.success) throw new Error(data.message);
                                                newAssets.push({ path: data.url, size: file.size, typefile: file.type });
                                            }
                                            setFormData(prev => ({
                                                ...prev,
                                                images: { ...prev.images, secondaryAssets: [...(prev.images?.secondaryAssets || []), ...newAssets] },
                                            }));
                                        } catch (err) { console.error(err); alert("Error subiendo archivos"); }
                                        finally { setIsUploading(false); e.target.value = ""; }
                                    }}
                                    disabled={isUploading}
                                />
                                <div className="flex items-center justify-center gap-2 text-sm text-dark dark:text-white">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                    {isUploading ? "Subiendo..." : "Agregar imágenes / videos"}
                                </div>
                            </div>
                            {(formData.images?.secondaryAssets || []).length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {formData.images!.secondaryAssets!.map((asset, idx) => (
                                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-stroke shadow-sm">
                                            {asset.typefile.startsWith("video/") ? (
                                                <video src={asset.path} className="w-full h-28 object-cover" muted />
                                            ) : (
                                                <div className="relative w-full h-28">
                                                    <Image src={asset.path} alt={`Asset ${idx + 1}`} fill className="object-cover" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-0.5 flex justify-between">
                                                <span>{(asset.size / 1024).toFixed(0)} KB</span>
                                                <span>{asset.typefile.split("/")[1]}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        images: { ...prev.images, secondaryAssets: (prev.images?.secondaryAssets || []).filter((_, i) => i !== idx) },
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
                ) : (
                    hasImages ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {allImagePaths.map((imgPath, idx) => (
                                <div key={idx} className="relative w-full h-48 rounded-lg overflow-hidden border border-stroke">
                                    <Image src={imgPath} alt={`${place.name} ${idx + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">Sin imágenes disponibles.</p>
                    )
                )}
            </EditableSection>

            {/* Main Content Grid: Top Row (Info + Location) & Bottom Row (Description) */}
            <div className="flex flex-col gap-8">

                {/* Top Row: Info & Location */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <EditableSection
                        title="Información Básica"
                        isEditing={!!editMode['general']}
                        onEdit={() => toggleEdit('general')}
                        onSave={() => handleSave('general')}
                        onCancel={() => toggleEdit('general')}
                        isSaving={isSaving}
                        className="h-full"
                    >
                        {editMode['general'] ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Nombre del Destino</label>
                                    <input
                                        type="text"
                                        value={formData.name || ""}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            setFormData({ ...formData, name, slug: generateSlug(name) });
                                        }}
                                        className="w-full rounded border border-stroke bg-transparent px-3 py-2 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary font-bold text-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Slug / URL ID <span className="text-xs font-normal normal-case text-gray-400">(auto-generado)</span></label>
                                    <input
                                        type="text"
                                        value={formData.slug || ""}
                                        readOnly
                                        className="w-full rounded border border-stroke bg-gray-100 px-3 py-2 text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-gray-400 font-mono text-sm cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Región</label>
                                    <select
                                        value={formData.region || ""}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        className="w-full rounded border border-stroke bg-transparent px-3 py-2 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary"
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
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Ecosistema / Clima</label>
                                    <select
                                        value={formData.ecosystem || ""}
                                        onChange={(e) => setFormData({ ...formData, ecosystem: e.target.value })}
                                        className="w-full rounded border border-stroke bg-transparent px-3 py-2 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary"
                                    >
                                        <option value="">Seleccionar Ecosistema</option>
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
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase block">Nombre</span>
                                    <p className="text-lg font-bold text-dark dark:text-white">{place.name}</p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-500 uppercase block">ID / Slug</span>
                                    <p className="font-mono text-sm text-primary bg-primary/5 inline-block px-2 py-1 rounded mt-1">{place.slug}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase block">Región</span>
                                        <p className="text-dark dark:text-white">{place.region || "-"}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase block">Ecosistema</span>
                                        <p className="text-dark dark:text-white">{place.ecosystem || "-"}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </EditableSection>

                    {/* Location */}
                    <EditableSection
                        title="Ubicación y Coordenadas"
                        isEditing={!!editMode['location']}
                        onEdit={() => toggleEdit('location')}
                        onSave={() => handleSave('location')}
                        onCancel={() => toggleEdit('location')}
                        isSaving={isSaving}
                        className="h-full flex flex-col"
                    >
                        {editMode['location'] ? (
                            <div className="space-y-4 flex-1">
                                <div className="flex flex-col gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsLocationPickerOpen(true)}
                                        className="w-full px-4 py-2 rounded-lg bg-primary text-white hover:bg-opacity-90 flex items-center justify-center gap-2 text-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Seleccionar en Mapa
                                    </button>
                                    <div className="text-xs text-center text-gray-500">
                                        {formData.coordinates ? (
                                            <span className="text-green-600">✓ Coordenadas: {formData.coordinates.lat.toFixed(4)}, {formData.coordinates.lng.toFixed(4)}</span>
                                        ) : "No seleccionadas"}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Google Maps Link</label>
                                    <input
                                        type="text"
                                        value={formData.googleMapsLink || ""}
                                        onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
                                        className="w-full rounded border border-stroke bg-transparent px-3 py-2 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary text-sm"
                                        placeholder="https://goo.gl/maps/..."
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 h-full">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 p-2 rounded-lg">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-dark dark:text-white">Coordenadas GPS</p>
                                            <p className="text-xs text-gray-500 font-mono">
                                                {place.coordinates ? `${place.coordinates.lat.toFixed(6)}, ${place.coordinates.lng.toFixed(6)}` : "No definidas"}
                                            </p>
                                        </div>
                                    </div>
                                    {place.googleMapsLink && (
                                        <a
                                            href={place.googleMapsLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium mt-1"
                                        >
                                            Ver en Google Maps &rarr;
                                        </a>
                                    )}
                                </div>
                                {/* Map Preview */}
                                <div className="w-full h-60 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden relative border border-stroke dark:border-dark-3 z-0">
                                    {place.coordinates ? (
                                        <LeafletMap
                                            selectedPos={[place.coordinates.lat, place.coordinates.lng]}
                                            readOnly={true}
                                            className="h-full w-full pointer-events-none" // pointer-events-none ensures it doesn't capture scroll/clicks
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
                                            Sin ubicación en mapa
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </EditableSection>
                </div>

                {/* Bottom Row: Description (Full Width) */}
                <EditableSection
                    title="Descripción Detallada"
                    isEditing={!!editMode['description']}
                    onEdit={() => toggleEdit('description')}
                    onSave={() => handleSave('description')}
                    onCancel={() => toggleEdit('description')}
                    isSaving={isSaving}
                    className="min-h-[200px]"
                >
                    {editMode['description'] ? (
                        <textarea
                            value={formData.description || ""}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full h-64 rounded border border-stroke bg-transparent px-4 py-3 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary leading-relaxed"
                            placeholder="Escribe una descripción detallada..."
                        />
                    ) : (
                        <div className="prose dark:prose-invert max-w-none text-base leading-relaxed text-body-color dark:text-dark-6">
                            <p className="whitespace-pre-line">
                                {place.description || "Sin descripción disponible."}
                            </p>
                        </div>
                    )}
                </EditableSection>

            </div>

            {isLocationPickerOpen && (
                <LocationPickerModal
                    isOpen={isLocationPickerOpen}
                    onClose={() => setIsLocationPickerOpen(false)}
                    onConfirm={handleLocationPick}
                    initialCoordinates={formData.coordinates || place.coordinates}
                />
            )}
        </div>
    );
}
