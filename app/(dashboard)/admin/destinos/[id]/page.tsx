"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Place, ApiService } from "@/services/api-service";
import Link from "next/link";
import Image from "next/image";
import EditableSection from "@/components/Admin/ui/EditableSection";
import LocationPickerModal from "@/components/Admin/LocationPickerModal";
import GalleryUploader from "@/components/Admin/GalleryUploader";
import ImageGallery from "@/components/Admin/Commons/ImageGallery";

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

            // Sync images with galleryImages if updating gallery
            let dataToSave = { ...formData };
            if (section === 'gallery' && dataToSave.galleryImages) {
                dataToSave.images = dataToSave.galleryImages;
            }

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

    const allImages = [place.heroImage, ...(place.galleryImages || place.images || [])].filter(Boolean) as string[];
    const hasImages = allImages.length > 0;

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
                    <GalleryUploader
                        images={formData.galleryImages || []}
                        onImagesChange={(newImages) => setFormData(prev => ({ ...prev, galleryImages: newImages }))}
                        folderName="destino"
                        slug={place.slug || place.id}
                        title="Gestionar Imágenes de Galería"
                    />
                ) : (
                    <ImageGallery
                        images={allImages}
                        alt={place.name}
                        height="h-[400px] md:h-[500px]"
                    />
                )}
            </EditableSection>

            {/* Main Content Grid: 3 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Columns 1 & 2: Basic Info, 360, Description */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info & 360 Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <EditableSection
                            title="Información Básica"
                            isEditing={!!editMode['general']}
                            onEdit={() => toggleEdit('general')}
                            onSave={() => handleSave('general')}
                            onCancel={() => toggleEdit('general')}
                            isSaving={isSaving}
                        >
                            {editMode['general'] ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Nombre del Destino</label>
                                        <input
                                            type="text"
                                            value={formData.name || ""}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full rounded border border-stroke bg-transparent px-3 py-2 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary font-bold text-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Slug / URL ID</label>
                                        <input
                                            type="text"
                                            value={formData.slug || ""}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full rounded border border-stroke bg-gray-100 px-3 py-2 text-dark outline-none dark:border-dark-3 dark:bg-dark-2 dark:text-gray-400 font-mono text-sm"
                                            placeholder="ej: manuel-antonio"
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
                                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Categoría</label>
                                        <select
                                            value={formData.category || "playas"}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                            className="w-full rounded border border-stroke bg-transparent px-3 py-2 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary"
                                        >
                                            <option value="playas">Playas</option>
                                            <option value="volcanes">Volcanes</option>
                                            <option value="parques">Parques Nacionales</option>
                                            <option value="rutas">Rutas</option>
                                            <option value="otro">Otro</option>
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
                                            <span className="text-xs font-semibold text-gray-500 uppercase block">Categoría</span>
                                            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 mt-1">
                                                {(place.category || "General").toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-gray-500 uppercase block">Ecosistema</span>
                                        <p className="text-dark dark:text-white">{place.ecosystem || "-"}</p>
                                    </div>
                                </div>
                            )}
                        </EditableSection>

                        <EditableSection
                            title="Vista 360"
                            isEditing={!!editMode['view360']}
                            onEdit={() => toggleEdit('view360')}
                            onSave={() => handleSave('view360')}
                            onCancel={() => toggleEdit('view360')}
                            isSaving={isSaving}
                        >
                            {editMode['view360'] ? (
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">URL Principal (Kuula/Matterport)</label>
                                    <input
                                        type="text"
                                        value={formData.view360Main || ""}
                                        onChange={(e) => setFormData({ ...formData, view360Main: e.target.value })}
                                        className="w-full rounded border border-stroke bg-transparent px-3 py-2 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary"
                                        placeholder="https://..."
                                    />
                                </div>
                            ) : (
                                <div>
                                    {place.view360Main ? (
                                        <a
                                            href={place.view360Main}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 p-3 rounded-lg border border-stroke dark:border-dark-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                                        >
                                            <div className="bg-primary/10 text-primary p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            </div>
                                            <div>
                                                <p className="font-medium text-dark dark:text-white text-sm">Abrir Tour Virtual</p>
                                                <p className="text-xs text-gray-500 truncate max-w-[200px]">{place.view360Main}</p>
                                            </div>
                                        </a>
                                    ) : (
                                        <span className="text-sm text-gray-500 italic">No hay tour virtual asignado.</span>
                                    )}
                                </div>
                            )}
                        </EditableSection>
                    </div>

                    {/* Description - Prominent */}
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

                {/* Column 3: Location */}
                <div className="lg:col-span-1 h-full">
                    <EditableSection
                        title="Ubicación y Coordenadas"
                        isEditing={!!editMode['location']}
                        onEdit={() => toggleEdit('location')}
                        onSave={() => handleSave('location')}
                        onCancel={() => toggleEdit('location')}
                        isSaving={isSaving}
                    >
                        {editMode['location'] ? (
                            <div className="space-y-4">
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
                                    <p className="text-xs text-gray-400 mt-1">Se genera automáticamente al usar el selector de mapa, pero puedes editarlo.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
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
                                    {place.googleMapsLink ? (
                                        <a
                                            href={place.googleMapsLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium mt-1"
                                        >
                                            Ver en Google Maps &rarr;
                                        </a>
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">Sin enlace de mapa</span>
                                    )}
                                </div>
                                {place.coordinates && (
                                    <div className="w-full h-48 bg-gray-100 dark:bg-white/5 rounded-lg overflow-hidden relative border border-stroke dark:border-dark-3">
                                        {/* Simple Static Map Placeholder using Google Static Maps or generic placeholder */}
                                        <Image
                                            src={`https://maps.googleapis.com/maps/api/staticmap?center=${place.coordinates.lat},${place.coordinates.lng}&zoom=13&size=400x300&maptype=roadmap&markers=color:red%7C${place.coordinates.lat},${place.coordinates.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}`}
                                            alt="Map Preview"
                                            fill
                                            className="object-cover opacity-80"
                                            unoptimized // Since it's dynamic external
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-2 h-2 bg-red-500 rounded-full ring-4 ring-red-500/30 animate-pulse"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </EditableSection>
                </div>
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
