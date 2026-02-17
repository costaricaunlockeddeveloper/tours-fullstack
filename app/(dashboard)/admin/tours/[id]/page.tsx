"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Tour, Place, ApiService, TourDefaults, TourDateEntry } from "@/services/api-service";
import Link from "next/link";
import Image from "next/image";
import EditableSection from "@/components/Admin/ui/EditableSection";
import CalendarScheduler from "@/components/Admin/tours/CalendarScheduler";
import MediaGalleryEditor from "@/components/Admin/Commons/MediaGalleryEditor";
import ListManager from "@/components/Admin/Commons/ListManager";
import StarRatingInput from "@/components/Admin/Commons/StarRatingInput";
import TourItineraryManager from "@/components/Admin/tours/TourItineraryManager";
import LocationPickerModal from "@/components/Admin/LocationPickerModal";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const DEFAULT_DEFAULTS: TourDefaults = {
    price: 0,
    priceChild: 0,
    maxQuota: 0,
    schedules: [],
};

function canBeVisible(tour: Partial<Tour>): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    if (!tour.name) missing.push("Nombre");
    if (!tour.slug) missing.push("Slug");
    if (!tour.description) missing.push("Descripción");
    if (!tour.duration) missing.push("Duración");
    if (!tour.images?.heroImage) missing.push("Hero Image");
    if (!tour.defaults?.price) missing.push("Precio base");
    if (!tour.defaults?.maxQuota) missing.push("Cupo base");
    if (!tour.defaults?.schedules?.length) missing.push("Horarios base");
    if (!tour.availableDates?.length) missing.push("Fechas disponibles");
    return { valid: missing.length === 0, missing };
}

export default function TourDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [tour, setTour] = useState<Tour | null>(null);
    const [relatedPlaces, setRelatedPlaces] = useState<Place[]>([]);
    const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit State
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Tour>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [visibilityTooltip, setVisibilityTooltip] = useState(false);

    useEffect(() => {
        const fetchTour = async () => {
            if (!id) return;
            try {
                const [tourData, allPlaces] = await Promise.all([
                    ApiService.getTour(id),
                    ApiService.getPlaces()
                ]);

                if (!tourData.defaults) tourData.defaults = { ...DEFAULT_DEFAULTS };
                if (!tourData.images) tourData.images = {};
                if (!tourData.meetingPoint) tourData.meetingPoint = {};

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
            setFormData(tour);
        }
    };

    const handleSave = async (section: string) => {
        try {
            setIsSaving(true);
            await ApiService.updateTour(id, formData);
            setTour(prev => ({ ...prev, ...formData } as Tour));

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

    const handleToggleVisibility = async () => {
        if (!tour) return;
        const check = canBeVisible(tour);
        if (!tour.isVisible && !check.valid) {
            setVisibilityTooltip(true);
            setTimeout(() => setVisibilityTooltip(false), 4000);
            return;
        }
        try {
            const newVal = !tour.isVisible;
            await ApiService.updateTour(id, { isVisible: newVal });
            setTour(prev => prev ? { ...prev, isVisible: newVal } : prev);
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    const handleIncludesChange = async (items: string[]) => {
        setFormData(prev => ({ ...prev, includes: items }));
        try {
            await ApiService.updateTour(id, { includes: items });
            setTour(prev => ({ ...prev, includes: items } as Tour));
        } catch (error) {
            console.error("Error auto-saving includes:", error);
        }
    };

    const handleExcludesChange = async (items: string[]) => {
        setFormData(prev => ({ ...prev, excludes: items }));
        try {
            await ApiService.updateTour(id, { excludes: items });
            setTour(prev => ({ ...prev, excludes: items } as Tour));
        } catch (error) {
            console.error("Error auto-saving excludes:", error);
        }
    };

    const handleItineraryChange = async (items: any[]) => {
        setFormData(prev => ({ ...prev, itinerary: items }));
        try {
            await ApiService.updateTour(id, { itinerary: items });
            setTour(prev => ({ ...prev, itinerary: items } as Tour));
        } catch (error) {
            console.error("Error auto-saving itinerary:", error);
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando detalles...</div>;
    if (!tour) return null;

    // Gallery: use new images structure
    const heroPath = tour.images?.heroImage?.path;
    const secondaryPaths = tour.images?.secondaryAssets?.map(a => a.path) || [];
    const allImagePaths = heroPath ? [heroPath, ...secondaryPaths] : [];
    const hasImages = allImagePaths.length > 0;

    const tourDefaults = tour.defaults || { ...DEFAULT_DEFAULTS };
    const visCheck = canBeVisible(tour);
    const mp = tour.meetingPoint || {};

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header with Visibility Toggle */}
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
                        <p className="text-sm text-dark-6">{tour.slug ? `/${tour.slug}` : "Detalles del tour"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Visibility Toggle */}
                    <div className="relative">
                        <button
                            onClick={handleToggleVisibility}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                                tour.isVisible
                                    ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400"
                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400"
                            }`}
                        >
                            <span className={`w-2.5 h-2.5 rounded-full ${tour.isVisible ? "bg-green-500" : "bg-gray-400"}`}></span>
                            {tour.isVisible ? "Visible" : "No visible"}
                        </button>
                        {visibilityTooltip && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 rounded-lg shadow-lg p-3 z-50">
                                <p className="text-xs font-semibold text-red-600 mb-1">Campos faltantes:</p>
                                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5">
                                    {visCheck.missing.map(m => <li key={m}>• {m}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleDelete}
                        className="rounded-lg bg-red-50 px-6 py-2 font-medium text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400"
                    >
                        Eliminar Tour
                    </button>
                </div>
            </div>

            {/* Location Modal */}
            {isLocationModalOpen && (
                <LocationPickerModal
                    isOpen={isLocationModalOpen}
                    onClose={() => setIsLocationModalOpen(false)}
                    onConfirm={(lat, lng) => setFormData(prev => ({
                        ...prev,
                        meetingPoint: {
                            ...prev.meetingPoint,
                            coordinates: { lat, lng },
                            link: `https://www.google.com/maps/?q=${lat},${lng}`,
                        },
                    }))}
                    initialCoordinates={formData.meetingPoint?.coordinates}
                />
            )}

            {/* Media Section — grid like destinos */}
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
                    <MediaGalleryEditor
                        images={formData.images || {}}
                        onChange={(newImages) => setFormData(prev => ({ ...prev, images: newImages }))}
                        folderName="tours"
                        slug={tour.slug || tour.id}
                    />
                ) : (
                    hasImages ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {allImagePaths.map((imgPath, idx) => (
                                <div key={idx} className="relative w-full h-48 rounded-lg overflow-hidden border border-stroke group">
                                    <Image src={imgPath} alt={`${tour.name} ${idx + 1}`} fill className="object-cover transition-transform duration-300 group-hover:scale-110" />
                                    {idx === 0 && (
                                        <span className="absolute top-2 left-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Hero</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic py-8 text-center">Sin imágenes disponibles. Haz clic en Editar para agregar.</p>
                    )
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
                        {editMode['schedules'] ? (
                            <div className="pt-2">
                                <CalendarScheduler
                                    defaults={formData.defaults || { ...DEFAULT_DEFAULTS }}
                                    availableDates={formData.availableDates || []}
                                    onChange={(dates) => setFormData(prev => ({ ...prev, availableDates: dates }))}
                                    onDefaultsChange={(newDefaults) => setFormData(prev => ({ ...prev, defaults: newDefaults }))}
                                />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Base Values Summary */}
                                <div>
                                    <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Valores Base (Plantilla)</h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="text-center p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                                            <span className="block text-xs text-gray-500">Precio Adulto</span>
                                            <span className="block font-bold text-primary">${tourDefaults.price}</span>
                                        </div>
                                        <div className="text-center p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                                            <span className="block text-xs text-gray-500">Precio Niño</span>
                                            <span className="block font-bold text-secondary">${tourDefaults.priceChild}</span>
                                        </div>
                                        <div className="text-center p-2 bg-gray-50 dark:bg-white/5 rounded-lg">
                                            <span className="block text-xs text-gray-500">Cupo/día</span>
                                            <span className="block font-bold text-dark dark:text-white">{tourDefaults.maxQuota}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Horarios Base</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tourDefaults.schedules && tourDefaults.schedules.length > 0 ? (
                                            tourDefaults.schedules.map(s => (
                                                <span key={s} className="px-2 py-1 bg-gray-100 dark:bg-dark-2 rounded text-xs text-dark-6">{s}</span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-500 italic">No hay horarios definidos. Haz clic en Editar para agregar.</span>
                                        )}
                                    </div>
                                </div>
                                {/* All upcoming dates */}
                                <div className="border-t border-stroke dark:border-dark-3 pt-4">
                                    <h4 className="text-sm font-semibold text-dark dark:text-white mb-2">Próximas Fechas ({tour.availableDates?.filter(d => dayjs(d.date).isAfter(dayjs().subtract(1, 'day'))).length || 0})</h4>
                                    <div className="max-h-72 overflow-y-auto">
                                        {tour.availableDates && tour.availableDates.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {tour.availableDates
                                                    .sort((a, b) => a.date.localeCompare(b.date))
                                                    .filter(d => dayjs(d.date).isAfter(dayjs().subtract(1, 'day')))
                                                    .map(d => (
                                                        <div key={d.date} className="p-2.5 border border-stroke dark:border-dark-3 rounded-lg bg-gray-50 dark:bg-white/5 text-xs">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="font-semibold text-primary">{dayjs(d.date).format("ddd, D MMM YYYY")}</span>
                                                                {d.enrolled > 0 && (
                                                                    <span className="bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                                                                        {d.enrolled} inscritos
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5">
                                                                <span>${d.price}</span>
                                                                <span>Cupo: {d.maxQuota}</span>
                                                                <span>{d.schedules.length} horarios</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-500 italic">No hay fechas disponibles. Haz clic en Editar para configurar.</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </EditableSection>

                    {/* Includes & Excludes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="rounded-xl bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-dark dark:text-white">Lo que incluye</h3>
                            </div>
                            <div className="pt-2">
                                <ListManager
                                    items={formData.includes || []}
                                    onItemsChange={handleIncludesChange}
                                    placeholder="Ej: Transporte ida y vuelta"
                                    layout="list"
                                    type="check"
                                    label=""
                                />
                            </div>
                        </div>
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

                {/* Right Sidebar */}
                <div className="space-y-6">
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
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Duración (horas)</label>
                                    <input type="number" min="0" step="0.5" value={formData.duration || ""} onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })} className="w-full rounded border border-stroke px-3 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:bg-transparent" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-stroke pb-2 dark:border-dark-3">
                                    <span className="text-gray-500">Duración</span>
                                    <span className="font-medium text-dark dark:text-white">{tour.duration ? `${tour.duration}h` : "-"}</span>
                                </div>
                            </div>
                        )}
                    </EditableSection>

                    {/* Rating & Reviews */}
                    <EditableSection
                        title="Rating y Reseñas"
                        isEditing={!!editMode['rating']}
                        onEdit={() => toggleEdit('rating')}
                        onSave={() => handleSave('rating')}
                        onCancel={() => toggleEdit('rating')}
                        isSaving={isSaving}
                    >
                        {editMode['rating'] ? (
                            <div className="space-y-4">
                                <StarRatingInput
                                    value={formData.rating || 0}
                                    onChange={(val) => setFormData({ ...formData, rating: val })}
                                    label="Calificación"
                                />
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Cantidad de Reseñas</label>
                                    <input type="number" min="0" value={formData.reviews || 0} onChange={e => setFormData({ ...formData, reviews: parseInt(e.target.value) || 0 })} className="w-full rounded border border-stroke px-3 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:bg-transparent" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <svg key={i} className={`w-5 h-5 ${i < Math.round(tour.rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {tour.rating?.toFixed(1)} · {tour.reviews || 0} reseñas
                                </span>
                            </div>
                        )}
                    </EditableSection>

                    {/* Unified Meeting Point */}
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
                                    <input type="text" value={formData.meetingPoint?.name || ""} onChange={(e) => setFormData(prev => ({ ...prev, meetingPoint: { ...prev.meetingPoint, name: e.target.value } }))} placeholder="Ej: Lobby del Hotel" className="w-full rounded border border-stroke px-3 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:bg-transparent" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Google Maps Link</label>
                                    <input type="text" value={formData.meetingPoint?.link || ""} onChange={(e) => setFormData(prev => ({ ...prev, meetingPoint: { ...prev.meetingPoint, link: e.target.value } }))} placeholder="https://maps.google.com/..." className="w-full rounded border border-stroke px-3 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:bg-transparent" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Instrucciones</label>
                                    <textarea
                                        value={formData.meetingPoint?.description || ""}
                                        onChange={(e) => setFormData(prev => ({ ...prev, meetingPoint: { ...prev.meetingPoint, description: e.target.value } }))}
                                        placeholder="Instrucciones breves..."
                                        rows={2}
                                        className="w-full rounded border border-stroke px-3 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:bg-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Coordenadas</label>
                                    <button type="button" onClick={() => setIsLocationModalOpen(true)} className="w-full flex items-center justify-center gap-2 rounded-full border border-primary border-dashed px-3 py-2 text-primary hover:bg-primary/5 transition text-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        Seleccionar en Mapa
                                    </button>
                                    {formData.meetingPoint?.coordinates && (
                                        <p className="text-xs text-green-600 mt-1 text-center">
                                            ✓ ({formData.meetingPoint.coordinates.lat.toFixed(4)}, {formData.meetingPoint.coordinates.lng.toFixed(4)})
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {mp.name ? (
                                    <>
                                        <h4 className="font-medium text-dark dark:text-white">{mp.name}</h4>
                                        {mp.link && (
                                            <a href={mp.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                Ver en mapa
                                            </a>
                                        )}
                                        {mp.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 border-t border-stroke dark:border-dark-3 pt-2">{mp.description}</p>
                                        )}
                                    </>
                                ) : (
                                    <span className="text-sm text-gray-400 italic">Sin punto de encuentro definido. Haz clic en Editar.</span>
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
                                                    ? currentIds.filter(pid => pid !== place.id)
                                                    : [...currentIds, place.id];
                                                setFormData({ ...formData, placeIds: newIds });
                                            }}
                                            className={`cursor-pointer rounded-lg border p-2 flex flex-col gap-2 transition-all ${isSelected
                                                ? "border-primary bg-primary/5 dark:bg-primary/20"
                                                : "border-stroke dark:border-dark-3 hover:border-primary/50"
                                                }`}
                                        >
                                            <div className="relative h-20 w-full overflow-hidden rounded-md">
                                                {(place.images?.heroImage?.path) ? (
                                                    <Image src={place.images.heroImage.path} alt={place.name} fill className="object-cover" />
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
                                                {(place.images?.heroImage?.path) ? (
                                                    <Image src={place.images.heroImage.path} alt={place.name} fill className="object-cover" />
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
