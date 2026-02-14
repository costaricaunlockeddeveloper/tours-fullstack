"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiService, Package, Place } from "@/services/api-service";
import Link from "next/link";
import Image from "next/image";
import EditableSection from "@/components/Admin/ui/EditableSection";
import GalleryUploader from "@/components/Admin/GalleryUploader";
import ImageGallery from "@/components/Admin/Commons/ImageGallery";
import ListManager from "@/components/Admin/Commons/ListManager";
import ActivityManager from "@/components/Admin/Commons/ActivityManager";

export default function PackageDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [packageData, setPackageData] = useState<Package | null>(null);
    const [relatedPlaces, setRelatedPlaces] = useState<Place[]>([]);
    const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // Edit State
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
    const [formData, setFormData] = useState<Partial<Package>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchPackage = async () => {
            if (!id) return;
            try {
                const [data, allPlaces] = await Promise.all([
                    ApiService.getPackage(id),
                    ApiService.getPlaces()
                ]);

                setPackageData(data);
                setFormData(data);
                setAvailablePlaces(allPlaces);

                if (data.placeIds && data.placeIds.length > 0) {
                    const relevant = allPlaces.filter(p => data.placeIds?.includes(p.id));
                    setRelatedPlaces(relevant);
                } else {
                    setRelatedPlaces([]);
                }
            } catch (error) {
                console.error("Error fetching package:", error);
                router.push("/admin/paquetes");
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [id, router]);

    const handleDelete = async () => {
        if (confirm("¿Estás seguro de eliminar este paquete?")) {
            await ApiService.deletePackage(id);
            router.push("/admin/paquetes");
        }
    };

    const toggleEdit = (section: string) => {
        setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
        if (!editMode[section] && packageData) {
            setFormData(packageData); // Reset
        }
    };

    const handleSave = async (section: string) => {
        try {
            setIsSaving(true);
            await ApiService.updatePackage(id, formData);
            setPackageData(prev => ({ ...prev, ...formData } as Package));

            // If updating places, refresh relatedPlaces
            if (section === 'places' && formData.placeIds) {
                const relevant = availablePlaces.filter(p => formData.placeIds?.includes(p.id));
                setRelatedPlaces(relevant);
            }

            setEditMode(prev => ({ ...prev, [section]: false }));
        } catch (error) {
            console.error("Error updating package:", error);
            alert("Error al actualizar el paquete.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando detalles...</div>;
    if (!packageData) return null;

    const allImages = packageData.images || [];

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/paquetes"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark hover:shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    >
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                            <path d="M14.707 16.707a1 1 0 01-1.414 0L6 9.414l7.293-7.293a1 1 0 011.414 1.414L8.414 9.414l6.293 6.293a1 1 0 010 1.414z" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-dark dark:text-white">{packageData.title}</h2>
                        <p className="text-sm text-dark-6">Detalles del Paquete</p>
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleDelete}
                        className="rounded-lg bg-red-50 px-6 py-2 font-medium text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                    >
                        Eliminar Paquete
                    </button>
                </div>
            </div>

            {/* Media */}
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
                        images={formData.images || []}
                        onImagesChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
                        folderName="packages"
                        slug={packageData.id}
                        title="Gestionar Imágenes del Paquete"
                    />
                ) : (
                    <ImageGallery
                        images={allImages}
                        alt={packageData.title}
                        height="h-[450px]"
                    />
                )}
            </EditableSection>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <EditableSection
                        title="Descripción"
                        isEditing={!!editMode['description']}
                        onEdit={() => toggleEdit('description')}
                        onSave={() => handleSave('description')}
                        onCancel={() => toggleEdit('description')}
                        isSaving={isSaving}
                    >
                        {editMode['description'] ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Título</label>
                                    <input type="text" value={formData.title || ""} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full rounded border border-stroke px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Descripción</label>
                                    <textarea
                                        value={formData.description || ""}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary min-h-[150px]"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h4 className="font-bold text-lg mb-2">{packageData.title}</h4>
                                <p className="text-body-color dark:text-dark-6 whitespace-pre-line leading-relaxed">
                                    {packageData.description}
                                </p>
                            </div>
                        )}
                    </EditableSection>

                    {/* Inclusions & Exclusions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Included */}
                        <EditableSection
                            title="Lo que incluye"
                            isEditing={!!editMode['includes']}
                            onEdit={() => toggleEdit('includes')}
                            onSave={() => handleSave('includes')}
                            onCancel={() => toggleEdit('includes')}
                            isSaving={isSaving}
                        >
                            {editMode['includes'] ? (
                                <ListManager
                                    items={formData.included || []}
                                    onItemsChange={(items) => setFormData({ ...formData, included: items })}
                                    label=""
                                    placeholder="Ej: Desayuno, Transporte..."
                                    type="check"
                                />
                            ) : (
                                <ul className="space-y-2">
                                    {packageData.included && packageData.included.length > 0 ? (
                                        packageData.included.map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-dark dark:text-white">
                                                <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                <span>{item}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-dark-6 italic text-sm">No se han especificado inclusiones.</li>
                                    )}
                                </ul>
                            )}
                        </EditableSection>

                        {/* Excluded */}
                        <EditableSection
                            title="Lo que NO incluye"
                            isEditing={!!editMode['excludes']}
                            onEdit={() => toggleEdit('excludes')}
                            onSave={() => handleSave('excludes')}
                            onCancel={() => toggleEdit('excludes')}
                            isSaving={isSaving}
                        >
                            {editMode['excludes'] ? (
                                <ListManager
                                    items={formData.excludes || []}
                                    onItemsChange={(items) => setFormData({ ...formData, excludes: items })}
                                    label=""
                                    placeholder="Ej: Propinas, Vuelos..."
                                    type="cross"
                                />
                            ) : (
                                <ul className="space-y-2">
                                    {packageData.excludes && packageData.excludes.length > 0 ? (
                                        packageData.excludes.map((item, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-dark dark:text-white">
                                                <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                                <span>{item}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-dark-6 italic text-sm">No se han especificado exclusiones.</li>
                                    )}
                                </ul>
                            )}
                        </EditableSection>
                    </div>

                    {/* Activities */}
                    <EditableSection
                        title="Actividades"
                        isEditing={!!editMode['activities']}
                        onEdit={() => toggleEdit('activities')}
                        onSave={() => handleSave('activities')}
                        onCancel={() => toggleEdit('activities')}
                        isSaving={isSaving}
                    >
                        {editMode['activities'] ? (
                            <ActivityManager
                                activities={formData.itinerary || []}
                                onActivitiesChange={(itinerary) => setFormData({ ...formData, itinerary })}
                            />
                        ) : (
                            <div className="space-y-8 relative">
                                {packageData.itinerary && packageData.itinerary.length > 0 ? (
                                    <>
                                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-3 -z-10"></div>
                                        {packageData.itinerary.map((act, idx) => (
                                            <div key={idx} className="relative pl-20 group">
                                                <div className="absolute left-0 top-0 w-16 h-16 flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-dark-2 border-2 border-primary/20 shadow-md z-10">
                                                    <span className="text-xs font-semibold text-primary uppercase">Actividad</span>
                                                    <span className="text-2xl font-bold text-dark dark:text-white leading-none">{idx + 1}</span>
                                                </div>
                                                <div className="bg-white dark:bg-dark-2 rounded-2xl p-5 border border-stroke dark:border-dark-3 shadow-sm hover:shadow-card transition-all">
                                                    <h5 className="text-lg font-bold text-dark dark:text-white mb-2">{act.title}</h5>
                                                    <p className="text-base text-dark-6 leading-relaxed">{act.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <p className="text-dark-6 italic text-center py-4">No hay actividades registradas.</p>
                                )}
                            </div>
                        )}
                    </EditableSection>
                </div>

                <div className="space-y-6">
                    {/* Pricing */}
                    <EditableSection
                        title="Precios"
                        isEditing={!!editMode['pricing']}
                        onEdit={() => toggleEdit('pricing')}
                        onSave={() => handleSave('pricing')}
                        onCancel={() => toggleEdit('pricing')}
                        isSaving={isSaving}
                        className="border-t-4 border-primary"
                    >
                        {editMode['pricing'] ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Precio Adulto</label>
                                    <input type="number" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full rounded border border-stroke px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Precio Niño</label>
                                    <input type="number" value={formData.priceChild || 0} onChange={e => setFormData({ ...formData, priceChild: Number(e.target.value) })} className="w-full rounded border border-stroke px-3 py-2" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500 uppercase">Adulto</span>
                                    <span className="text-2xl font-bold text-primary">${packageData.price}</span>
                                </div>
                                {packageData.priceChild !== undefined && (
                                    <div className="flex items-center justify-between border-t pt-2 dark:border-dark-3">
                                        <span className="text-sm font-medium text-gray-500 uppercase">Niño</span>
                                        <span className="text-xl font-bold text-dark dark:text-white">${packageData.priceChild}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </EditableSection>

                    {/* Associated Destinations */}
                    <EditableSection
                        title="Destinos Asociados"
                        isEditing={!!editMode['places']}
                        onEdit={() => toggleEdit('places')}
                        onSave={() => handleSave('places')}
                        onCancel={() => toggleEdit('places')}
                        isSaving={isSaving}
                    >
                        {editMode['places'] ? (
                            <div className="space-y-3">
                                {/* Search Bar */}
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Buscar destinos..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-stroke bg-gray-50 dark:bg-dark-2 dark:border-dark-3 text-sm focus:border-primary outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                                    {availablePlaces
                                        .filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map(place => {
                                            const isSelected = formData.placeIds?.includes(place.id);
                                            return (
                                                <div
                                                    key={place.id}
                                                    onClick={() => {
                                                        const currentIds = formData.placeIds || [];
                                                        const newIds = isSelected
                                                            ? currentIds.filter(id => id !== place.id)
                                                            : [...currentIds, place.id];
                                                        setFormData({ ...formData, placeIds: newIds });
                                                    }}
                                                    className={`cursor-pointer rounded-lg border p-2 flex flex-col gap-2 transition-all ${isSelected
                                                        ? "border-primary bg-primary/5 dark:bg-primary/20"
                                                        : "border-stroke dark:border-dark-3 hover:border-primary/50"
                                                        }`}
                                                >
                                                    <div className="relative h-20 w-full overflow-hidden rounded-md">
                                                        {(place.heroImage || (place.images && place.images[0])) ? (
                                                            <Image
                                                                src={place.heroImage || place.images[0]}
                                                                alt={place.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-dark-2">
                                                                <span className="text-xs text-gray-400">Sin foto</span>
                                                            </div>
                                                        )}
                                                        {isSelected && (
                                                            <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-0.5">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
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
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {relatedPlaces && relatedPlaces.length > 0 ? (
                                    relatedPlaces.map(place => (
                                        <div key={place.id} className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-dark-2 border border-stroke dark:border-dark-3 p-1 pr-3">
                                            <div className="relative h-8 w-8 overflow-hidden rounded-md">
                                                {(place.heroImage || (place.images && place.images[0])) ? (
                                                    <Image src={place.heroImage || place.images[0]} alt={place.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="bg-gray-200 h-full w-full" />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-dark dark:text-white">{place.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-sm text-gray-500 italic">No hay destinos asociados.</span>
                                )}
                            </div>
                        )}
                    </EditableSection>

                    {/* Additional Details (Duration, Location, etc could go here if needed) */}
                </div>
            </div>
        </div>
    );
}
