"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Place, ApiService } from "@/services/api-service";
import MediaGalleryEditor from "@/components/Admin/Commons/MediaGalleryEditor";
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
            <div className="mb-8 rounded-xl bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="flex items-center justify-between mb-6 border-b border-stroke pb-4 dark:border-dark-3">
                    <h3 className="text-xl font-bold text-dark dark:text-white">Galería Multimedia</h3>
                    <button
                        onClick={() => handleSave('gallery')}
                        disabled={isSaving}
                        className="rounded-lg bg-primary px-6 py-2 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
                    >
                        {isSaving ? "Guardando..." : "Guardar Galería"}
                    </button>
                </div>
                <MediaGalleryEditor
                    images={formData.images || {}}
                    onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
                    folderName="destino"
                    slug={formData.slug || place.slug || place.id}
                />
            </div>

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
