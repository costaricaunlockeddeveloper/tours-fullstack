"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Package, Place, ApiService, PlaceImages, PackageActivity } from "@/services/api-service";
import Link from "next/link";
import Image from "next/image";
import EditableSection from "@/components/Admin/ui/EditableSection";
import MediaGalleryEditor from "@/components/Admin/Commons/MediaGalleryEditor";
import ListManager from "@/components/Admin/Commons/ListManager";
import StarRatingInput from "@/components/Admin/Commons/StarRatingInput";
import ActivityManager from "@/components/Admin/Commons/ActivityManager";

function canBeVisible(pkg: Partial<Package>): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    if (!pkg.name) missing.push("Nombre");
    if (!pkg.slug) missing.push("Slug");
    if (!pkg.description) missing.push("Descripción");
    if (!pkg.price) missing.push("Precio");
    if (!pkg.images?.heroImage?.path) missing.push("Hero Image");
    if (!pkg.placeIds?.length) missing.push("Destinos (mínimo 1)");
    if (!pkg.included?.length) missing.push("Inclusiones (mínimo 1)");
    return { valid: missing.length === 0, missing };
}

export default function PackageDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [pkg, setPkg] = useState<Package | null>(null);
    const [relatedPlaces, setRelatedPlaces] = useState<Place[]>([]);
    const [availablePlaces, setAvailablePlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    // Edit State
    const [editMode, setEditMode] = useState<{ [key: string]: boolean }>({});
    const [formData, setFormData] = useState<Partial<Package>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [visibilityTooltip, setVisibilityTooltip] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const [pkgData, allPlaces] = await Promise.all([
                    ApiService.getPackage(id),
                    ApiService.getPlaces({ status: 'PUBLISHED' })
                ]);

                if (!pkgData.images) pkgData.images = {};

                setPkg(pkgData);
                setFormData(pkgData);
                setAvailablePlaces(allPlaces);

                if (pkgData.placeIds && pkgData.placeIds.length > 0) {
                    const relevant = allPlaces.filter(p => pkgData.placeIds!.includes(p.id));
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

        fetchData();
    }, [id, router]);

    const handleDelete = async () => {
        if (confirm("¿Estás seguro de eliminar este paquete?")) {
            await ApiService.deletePackage(id);
            router.push("/admin/paquetes");
        }
    };

    const toggleEdit = (section: string) => {
        setEditMode(prev => ({ ...prev, [section]: !prev[section] }));
        if (!editMode[section] && pkg) {
            setFormData(pkg);
        }
    };

    const handleSave = async (section: string) => {
        try {
            setIsSaving(true);
            await ApiService.updatePackage(id, formData);
            setPkg(prev => ({ ...prev, ...formData } as Package));

            if (section === 'places' && formData.placeIds) {
                const relevant = availablePlaces.filter(p => formData.placeIds?.includes(p.id));
                setRelatedPlaces(relevant);
            }

            setEditMode(prev => ({ ...prev, [section]: false }));
        } catch (error: any) {
            console.error("Error updating package:", error);
            alert(error.message || "Error al actualizar.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleStatusChange = async (newStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
        if (!pkg) return;
        if (newStatus === 'PUBLISHED') {
            const check = canBeVisible(pkg as any);
            if (!check.valid) {
                setVisibilityTooltip(true);
                setTimeout(() => setVisibilityTooltip(false), 4000);
                return;
            }
        }
        try {
            await ApiService.updatePackage(id, { status: newStatus });
            setPkg(prev => prev ? { ...prev, status: newStatus } : prev);
            if (newStatus === 'ARCHIVED') {
                router.push('/admin/paquetes');
            }
        } catch (error: any) {
            console.error("Error toggling status:", error);
            alert(error?.response?.data?.error || error.message || "Error al actualizar estado");
        }
    };

    const handleIncludesChange = async (items: string[]) => {
        setFormData(prev => ({ ...prev, included: items }));
        try {
            await ApiService.updatePackage(id, { included: items });
            setPkg(prev => ({ ...prev, included: items } as Package));
        } catch (error) {
            console.error("Error auto-saving includes:", error);
        }
    };

    const handleExcludesChange = async (items: string[]) => {
        setFormData(prev => ({ ...prev, excludes: items }));
        try {
            await ApiService.updatePackage(id, { excludes: items });
            setPkg(prev => ({ ...prev, excludes: items } as Package));
        } catch (error) {
            console.error("Error auto-saving excludes:", error);
        }
    };

    const handleActivitiesChange = async (items: PackageActivity[]) => {
        setFormData(prev => ({ ...prev, activities: items }));
        try {
            await ApiService.updatePackage(id, { activities: items });
            setPkg(prev => ({ ...prev, activities: items } as Package));
        } catch (error) {
            console.error("Error auto-saving activities:", error);
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando detalles...</div>;
    if (!pkg) return null;

    // Gallery: use new images structure
    const heroPath = pkg.images?.heroImage?.path;
    const secondaryPaths = pkg.images?.secondaryAssets?.map(a => a.path) || [];
    const allImagePaths = heroPath ? [heroPath, ...secondaryPaths] : [];
    const hasImages = allImagePaths.length > 0;

    const visCheck = canBeVisible(pkg);

    return (
        <div className="mx-auto max-w-7xl">
            {/* Header with Visibility Toggle */}
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
                        <h2 className="text-2xl font-bold text-dark dark:text-white">{pkg.name}</h2>
                        <p className="text-sm text-dark-6">{pkg.slug ? `/${pkg.slug}` : "Detalles del paquete"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Actions depending on Status */}
                    {(!pkg.status || pkg.status === 'DRAFT') && (
                        <>
                            <div className="relative">
                                <button
                                    onClick={() => handleStatusChange('PUBLISHED')}
                                    className="rounded-lg bg-green-600 px-6 py-2 font-medium text-white hover:bg-green-700 transition dark:bg-green-500 dark:hover:bg-green-600 shadow-sm"
                                >
                                    Publicar
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
                                className="rounded-lg bg-red-50 px-6 py-2 font-medium text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 transition"
                            >
                                Eliminar Paquete
                            </button>
                        </>
                    )}
                    
                    {pkg.status === 'PUBLISHED' && (
                        <button
                            onClick={() => handleStatusChange('ARCHIVED')}
                            className="rounded-lg bg-amber-500 px-6 py-2 font-medium text-white hover:bg-amber-600 transition shadow-sm"
                        >
                            Archivar
                        </button>
                    )}

                    {pkg.status === 'ARCHIVED' && (
                        <span className="rounded-lg bg-gray-100 dark:bg-dark-2 border border-stroke dark:border-dark-3 px-6 py-2 font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-sm">
                            Archivado
                        </span>
                    )}
                </div>
            </div>

            {/* Media Section */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="flex items-center justify-between mb-6 border-b border-stroke pb-4 dark:border-dark-3">
                    <h3 className="text-xl font-bold text-dark dark:text-white">Galería Multimedia</h3>
                </div>
                <MediaGalleryEditor
                    images={formData.images || {}}
                    onChange={async (newImages) => {
                        setFormData(prev => ({ ...prev, images: newImages }));
                        try {
                            await ApiService.updatePackage(id, { images: newImages });
                            setPkg(prev => prev ? { ...prev, images: newImages } : prev);
                        } catch (error) {
                            console.error("Error auto-saving gallery:", error);
                        }
                    }}
                    folderName="paquetes"
                    slug={pkg.slug || pkg.id}
                />
            </div>

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
                            <textarea
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-lg border border-stroke bg-transparent px-4 py-3 text-dark outline-none dark:border-dark-3 dark:text-white focus:border-primary min-h-[150px]"
                                maxLength={1500}
                            />
                        ) : (
                            <p className="text-body-color dark:text-dark-6 whitespace-pre-line leading-relaxed">
                                {pkg.description || "Sin descripción."}
                            </p>
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
                                    items={formData.included || []}
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

                    {/* Activities */}
                    <div className="rounded-xl bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-dark dark:text-white">Actividades</h3>
                        </div>
                        <div className="pt-2">
                            <ActivityManager
                                activities={formData.activities || []}
                                onActivitiesChange={handleActivitiesChange}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Pricing */}
                    <EditableSection
                        title="Precios"
                        isEditing={!!editMode['pricing']}
                        onEdit={() => toggleEdit('pricing')}
                        onSave={() => handleSave('pricing')}
                        onCancel={() => toggleEdit('pricing')}
                        isSaving={isSaving}
                    >
                        {editMode['pricing'] ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Precio Adulto (USD)</label>
                                    <input type="number" min="0" step="0.01" value={formData.price || ""} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full rounded border border-stroke px-3 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:bg-transparent" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Precio Niño (USD)</label>
                                    <input type="number" min="0" step="0.01" value={formData.priceChild || ""} onChange={e => setFormData({ ...formData, priceChild: Number(e.target.value) })} className="w-full rounded border border-stroke px-3 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white dark:bg-transparent" />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-stroke pb-2 dark:border-dark-3">
                                    <span className="text-gray-500">Precio Adulto</span>
                                    <span className="font-bold text-primary">${pkg.price || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Precio Niño</span>
                                    <span className="font-bold text-secondary">${pkg.priceChild || 0}</span>
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
                                        <svg key={i} className={`w-5 h-5 ${i < Math.round(pkg.rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {pkg.rating?.toFixed(1)} · {pkg.reviews || 0} reseñas
                                </span>
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
