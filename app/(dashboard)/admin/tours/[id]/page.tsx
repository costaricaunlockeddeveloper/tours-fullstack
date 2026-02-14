"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Tour, Place, ApiService } from "@/services/api-service";
import Link from "next/link";
import Image from "next/image";
import EditableSection from "@/components/Admin/ui/EditableSection";
import CalendarScheduler from "@/components/Admin/tours/CalendarScheduler";
import GalleryUploader from "@/components/Admin/GalleryUploader";
import ImageGallery from "@/components/Admin/Commons/ImageGallery";
import ListManager from "@/components/Admin/Commons/ListManager";
import TourItineraryManager from "@/components/Admin/tours/TourItineraryManager";
import LocationPickerModal from "@/components/Admin/LocationPickerModal";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export default function TourDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [tour, setTour] = useState<Tour | null>(null);
    const [relatedPlaces, setRelatedPlaces] = useState<Place[]>([]);
    const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]); // All places for selection
    const [loading, setLoading] = useState(true);

    // Edit State
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Tour>>({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchTour = async () => {
            if (!id) return;
            try {
                // Fetch Tour and Places in parallel
                const [tourData, allPlaces] = await Promise.all([
                    ApiService.getTour(id),
                    ApiService.getPlaces()
                ]);

                // Ensure defaults
                if (!tourData.gallery) tourData.gallery = [];

                setTour(tourData);
                setFormData(tourData);
                setAvailablePlaces(allPlaces);

                if (tourData.placeIds && tourData.placeIds.length > 0) {
                    const relevant = allPlaces.filter(p => tourData.placeIds.includes(p.id));
                    setRelatedPlaces(relevant);
                } else {
                    setRelatedPlaces([]);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                // router.push("/admin/tours"); // Commented out to debug if error occurs
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [id, router]);

    const handleDelete = async () => {
        if (confirm("¿Estás seguro de eliminar este tour?")) {
            await ApiService.deleteTour(id);
            router.push("/admin/tours");
        }
    };

    const toggleEdit = (section: string) => {
        setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
        if (!editMode[section] && tour) {
            setFormData(tour); // Reset to current data on enter edit
        }
    };

    const handleSave = async (section: string) => {
        try {
            setIsSaving(true);
            await ApiService.updateTour(id, formData);
            setTour(prev => ({ ...prev, ...formData } as Tour));

            // If updating places, refresh relatedPlaces
            if (section === 'places' && formData.placeIds) {
                const relevant = availablePlaces.filter(p => formData.placeIds?.includes(p.id));
                setRelatedPlaces(relevant);
            }

            setEditMode(prev => ({ ...prev, [section]: false }));
        } catch (error) {
            console.error("Error updating tour:", error);
            alert("Error al actualizar.");
        } finally {
            setIsSaving(false);
        }
    };



    const handleOffersChange = async (items: string[]) => {
        const newFormData = { ...formData, whatItOffers: items };
        setFormData(newFormData);
        try {
            await ApiService.updateTour(id, { whatItOffers: items });
            setTour(prev => ({ ...prev, whatItOffers: items } as Tour));
        } catch (error) {
            console.error("Error auto-saving offers:", error);
        }
    };

    const handleExcludesChange = async (items: string[]) => {
        const newFormData = { ...formData, excludes: items };
        setFormData(newFormData);
        try {
            await ApiService.updateTour(id, { excludes: items });
            setTour(prev => ({ ...prev, excludes: items } as Tour));
        } catch (error) {
            console.error("Error auto-saving excludes:", error);
        }
    };

    const handleItineraryChange = async (items: any[]) => {
        const newFormData = { ...formData, itinerary: items };
        setFormData(newFormData);
        try {
            await ApiService.updateTour(id, { itinerary: items });
            setTour(prev => ({ ...prev, itinerary: items } as Tour));
        } catch (error) {
            console.error("Error auto-saving itinerary:", error);
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando detalles...</div>;
    if (!tour) return null;

    const allImages = tour.gallery || [];
    const hasImages = allImages.length > 0;

    return (
        <div className="mx-auto max-w-7xl">
            {/* ... Header ... */}
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/tours"
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark hover:shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                    >
                        <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                            <path d="M14.707 16.707a1 1 0 01-1.414 0L6 9.414l7.293-7.293a1 1 0 011.414 1.414L8.414 9.414l6.293 6.293a1 1 0 010 1.414z" />
                        </svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-dark dark:text-white">{tour.name}</h2>
                        <p className="text-sm text-dark-6">Detalles del tour</p>
                    </div>
                </div>
                <div>
                    <button
                        onClick={handleDelete}
                        className="rounded-lg bg-red-50 px-6 py-2 font-medium text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                    >
                        Eliminar Tour
                    </button>
                </div>
            </div>

            {/* Media Section: Editable */}
            <EditableSection
                title="Galería de Imágenes"
                isEditing={!!editMode['gallery']}
                onEdit={() => toggleEdit('gallery')}
                onSave={() => handleSave('gallery')}
                onCancel={() => toggleEdit('gallery')}
                isSaving={isSaving}
                className="mb-8"
            >
                {isLocationModalOpen && (
                    <LocationPickerModal
                        isOpen={isLocationModalOpen}
                        onClose={() => setIsLocationModalOpen(false)}
                        onConfirm={(lat, lng) => setFormData(prev => ({ ...prev, meetingPointCoordinates: { lat, lng } }))}
                        initialCoordinates={formData.meetingPointCoordinates ? { lat: formData.meetingPointCoordinates.lat, lng: formData.meetingPointCoordinates.lng } : undefined}
                    />
                )}

                {editMode['gallery'] ? (
                    <GalleryUploader
                        images={formData.gallery || []}
                        onImagesChange={(newImages) => setFormData(prev => ({ ...prev, gallery: newImages }))}
                        folderName="tours"
                        slug={tour.id}
                        title="Gestionar Imágenes"
                    />
                ) : (
                    <ImageGallery
                        images={allImages}
                        alt={tour.name}
                        height="h-[450px]"
                    />
                )}
            </EditableSection>



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">


                    {/* Description */}
                    <EditableSection
                        title="Descripción Turística"
                        isEditing={!!editMode['description']}
                        onEdit={() => toggleEdit('description')}
                        onSave={() => handleSave('description')}
                        onCancel={() => toggleEdit('description')}
                        isSaving={isSaving}
                    >
                        {editMode['description'] ? (
                            <textarea
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary min-h-[150px]"
                            />
                        ) : (
                            <p className="text-body-color dark:text-dark-6 whitespace-pre-line leading-relaxed">
                                {tour.description}
                            </p>
                        )}
                    </EditableSection>

                    {/* Schedules & Calendar */}
                    <EditableSection
                        title="Programación y Fechas"
                        isEditing={!!editMode['schedules']}
                        onEdit={() => toggleEdit('schedules')}
                        onSave={() => handleSave('schedules')}
                        onCancel={() => toggleEdit('schedules')}
                        isSaving={isSaving}
                    >
                        {/* ... Calendar Content ... */}
                        {editMode['schedules'] ? (
                            <div className="pt-2">
                                <CalendarScheduler
                                    schedules={formData.schedules || []}
                                    availableDates={formData.availableDates || []}
                                    onChange={(schedules, dates) => setFormData({ ...formData, schedules, availableDates: dates })}
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Horarios Base</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tour.schedules && tour.schedules.length > 0 ? (
                                            tour.schedules.map(s => (
                                                <span key={s} className="px-2 py-1 bg-gray-100 dark:bg-dark-2 rounded text-xs text-dark-6">{s}</span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-500 italic">No hay horarios definidos</span>
                                        )}
                                    </div>
                                </div>
                                <div className="border-t border-stroke dark:border-dark-3 pt-4">
                                    <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Próximas Fechas ({tour.availableDates?.length || 0})</h4>
                                    <div className="max-h-40 overflow-y-auto">
                                        {tour.availableDates && tour.availableDates.length > 0 ? (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {tour.availableDates
                                                    .sort((a, b) => a.date.localeCompare(b.date))
                                                    .filter(d => dayjs(d.date).isAfter(dayjs().subtract(1, 'day')))
                                                    .slice(0, 9)
                                                    .map(d => (
                                                        <div key={d.date} className="p-2 border border-stroke dark:border-dark-3 rounded bg-gray-50 dark:bg-white/5 text-xs">
                                                            <div className="font-medium text-primary mb-1">{dayjs(d.date).format("D MMM, YYYY")}</div>
                                                            <div className="text-gray-500">{d.schedules.length} horarios</div>
                                                        </div>
                                                    ))}
                                                {tour.availableDates.length > 9 && (
                                                    <div className="flex items-center justify-center p-2 text-xs text-gray-500 italic">
                                                        +{tour.availableDates.length - 9} más...
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-500 italic">No hay fechas disponibles activas</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </EditableSection>

                    {/* Includes & Excludes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Includes (formerly What it offers) */}
                        <div className="rounded-xl bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-dark dark:text-white">Lo que incluye</h3>
                            </div>
                            <div className="pt-2">
                                <ListManager
                                    items={formData.whatItOffers || []}
                                    onItemsChange={handleOffersChange}
                                    placeholder="Ej: Transporte ida y vuelta"
                                    layout="list"
                                    type="check"
                                    label=""
                                />
                            </div>
                        </div>

                        {/* Excludes */}
                        <div className="rounded-xl bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-dark dark:text-white">Lo que NO incluye</h3>
                            </div>
                            <div className="pt-2">
                                <ListManager
                                    items={formData.excludes || []}
                                    onItemsChange={handleExcludesChange}
                                    placeholder="Ej: Gastos personales"
                                    layout="list"
                                    type="cross"
                                    label=""
                                />
                            </div>
                        </div>
                    </div>

                    {/* Itinerary */}
                    <div className="rounded-xl bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-dark dark:text-white">Itinerario</h3>
                        </div>
                        <div className="pt-2">
                            <TourItineraryManager
                                items={formData.itinerary || []}
                                onItemsChange={handleItineraryChange}
                            />
                        </div>
                    </div>

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
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500 uppercase">Precio Adulto</span>
                                    <span className="text-2xl font-bold text-primary">${tour.price}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500 uppercase">Precio Niño</span>
                                    <span className="text-xl font-bold text-secondary">${tour.priceChild}</span>
                                </div>
                            </div>
                        )}
                    </EditableSection>

                    {/* Operational Details */}
                    <EditableSection
                        title="Detalles Operativos"
                        isEditing={!!editMode['operation']}
                        onEdit={() => toggleEdit('operation')}
                        onSave={() => handleSave('operation')}
                        onCancel={() => toggleEdit('operation')}
                        isSaving={isSaving}
                    >
                        {editMode['operation'] ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Duración</label>
                                    <input type="text" value={formData.duration || ""} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full rounded border border-stroke px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Dificultad</label>
                                    <select value={formData.difficulty || "Moderado"} onChange={e => setFormData({ ...formData, difficulty: e.target.value as any })} className="w-full rounded border border-stroke px-3 py-2">
                                        <option value="Fácil">Fácil</option>
                                        <option value="Moderado">Moderado</option>
                                        <option value="Difícil">Difícil</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Cupo Máximo</label>
                                    <input type="number" value={formData.maxQuota || 0} onChange={e => setFormData({ ...formData, maxQuota: Number(e.target.value) })} className="w-full rounded border border-stroke px-3 py-2" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between border-b border-stroke pb-2 dark:border-dark-3">
                                    <span className="text-gray-500">Duración</span>
                                    <span className="font-medium text-dark dark:text-white">{tour.duration || "-"}</span>
                                </div>
                                <div className="flex justify-between border-b border-stroke pb-2 dark:border-dark-3">
                                    <span className="text-gray-500">Dificultad</span>
                                    <span className="font-medium px-2 py-0.5 rounded text-xs text-white bg-blue-500">{tour.difficulty}</span>
                                </div>
                                <div className="flex justify-between border-b border-stroke pb-2 dark:border-dark-3">
                                    <span className="text-gray-500">Cupo Máximo</span>
                                    <span className="font-medium text-dark dark:text-white">{tour.maxQuota || "-"} personas</span>
                                </div>
                            </div>
                        )}
                    </EditableSection>

                    {/* Meeting Point Section (New Compact Design) */}
                    <EditableSection
                        title="Punto de Encuentro"
                        isEditing={!!editMode['meetingPoint']}
                        onEdit={() => toggleEdit('meetingPoint')}
                        onSave={() => handleSave('meetingPoint')}
                        onCancel={() => toggleEdit('meetingPoint')}
                        isSaving={isSaving}
                    >
                        {editMode['meetingPoint'] ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Nombre del Lugar</label>
                                    <input
                                        type="text"
                                        value={formData.meetingPoint || ""}
                                        onChange={(e) => setFormData({ ...formData, meetingPoint: e.target.value })}
                                        placeholder="Ej: Lobby del Hotel"
                                        className="w-full rounded border border-stroke px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Ubicación</label>
                                    <button
                                        type="button"
                                        onClick={() => setIsLocationModalOpen(true)}
                                        className="w-full flex items-center justify-center gap-2 rounded-full border border-primary border-dashed px-3 py-2 text-primary hover:bg-primary/5 transition"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Actualizar en Mapa
                                    </button>
                                    {formData.meetingPointCoordinates && (
                                        <p className="text-xs text-green-600 mt-1 text-center">
                                            ✓ Ubicación seleccionada ({formData.meetingPointCoordinates.lat.toFixed(4)}, {formData.meetingPointCoordinates.lng.toFixed(4)})
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Instrucciones</label>
                                    <textarea
                                        value={formData.meetingPointDescription || ""}
                                        onChange={(e) => setFormData({ ...formData, meetingPointDescription: e.target.value })}
                                        placeholder="Instrucciones breves..."
                                        rows={3}
                                        className="w-full rounded border border-stroke px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-medium text-dark dark:text-white">{tour.meetingPoint || "No definido"}</h4>
                                    {tour.meetingPointCoordinates && (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${tour.meetingPointCoordinates.lat},${tour.meetingPointCoordinates.lng}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-primary hover:underline flex items-center gap-1 mt-0.5"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                            Ver en mapa
                                        </a>
                                    )}
                                </div>

                                {tour.meetingPointDescription && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400 border-t border-stroke dark:border-dark-3 pt-2 mt-2">
                                        {tour.meetingPointDescription}
                                    </div>
                                )}

                                {(!tour.meetingPoint && !tour.meetingPointDescription) && (
                                    <span className="text-sm text-gray-400 italic">Sin información de punto de encuentro.</span>
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
                            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                                {availablePlaces.map(place => {
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
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {relatedPlaces.length > 0 ? (
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
                </div>
            </div>
        </div>
    );
}
