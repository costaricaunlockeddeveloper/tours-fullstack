"use client";

import { useEffect, useState } from "react";
import { PlacesService } from "@/services/places.service";
import { Place } from "@/types";
import Image from "next/image";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminGrid } from "@/components/Admin/AdminGrid";
import { EmptyState } from "@/components/Admin/EmptyState";

export default function DestinationsAdmin() {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);

    const loadPlaces = async () => {
        try {
            setLoading(true);
            const data = await PlacesService.getPlaces();
            setPlaces(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPlaces();
    }, []);

    const {
        searchQuery,
        setSearchQuery,
        currentItems,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage
    } = useSearchPagination(places, 6, (place, query) =>
        place.name.toLowerCase().includes(query.toLowerCase()) ||
        (place.description?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
        (place.officialName?.toLowerCase().includes(query.toLowerCase()) ?? false)
    );

    if (loading) {
        return <div className="p-10 text-center">Cargando destinos...</div>;
    }

    return (
        <div className="mx-auto max-w-7xl">
            <AdminHeader
                title="Destinos"
                description="Administra los destinos turísticos del mapa interactivo."
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Buscar destino..."
                actionLabel="Nuevo Destino"
                actionHref="/admin/destinos/create"
            />

            <AdminGrid>
                {currentItems.map((place) => (
                    <div
                        key={place.id}
                        className="group relative overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card hover:shadow-2 transition-all duration-300 flex flex-col h-full"
                    >
                        <div className="relative h-48 w-full overflow-hidden shrink-0">
                            <Image
                                src={place.images?.heroImage?.path || "/images/place-01.jpg"}
                                alt={place.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            {/* Status Badge */}
                            <div className="absolute top-2 left-2">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-sm ${place.status === 'PUBLISHED' ? "bg-green-500/90 text-white" : place.status === 'ARCHIVED' ? "bg-rose-500/90 text-white" : "bg-gray-500/90 text-white"}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full bg-white`}></span>
                                    {place.status === 'PUBLISHED' ? "Publicado" : place.status === 'ARCHIVED' ? "Archivado" : "Borrador"}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex flex-col grow">
                            <div className="mb-4">
                                <h3 className="mb-1 text-xl font-bold text-dark dark:text-white line-clamp-2">
                                    {place.name}
                                </h3>
                                {place.officialName && (
                                    <p className="mb-2 text-xs italic text-gray-500 line-clamp-1 flex items-center gap-1">
                                        <i className="bi bi-info-circle"></i> {place.officialName}
                                    </p>
                                )}
                                
                                {/* Coordinates Indicator */}
                                <div className="mb-3">
                                    {place.coordinates?.lat && place.coordinates?.lng ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
                                            <i className="bi bi-geo-alt"></i> Coordenadas OK
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                                            <i className="bi bi-exclamation-triangle"></i> Faltan coordenadas
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-body-color dark:text-dark-6 line-clamp-3">
                                    {place.shortDescription || place.description}
                                </p>
                            </div>

                            <div className="grow"></div>

                            <div className="mt-auto">
                                <div className="mb-4 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1 rounded bg-gray-100 dark:bg-dark-2 px-2 py-1 text-xs text-dark dark:text-white font-medium">
                                        <i className="bi bi-tree"></i> {place.ecosystem?.toUpperCase() || place.region?.toUpperCase() || "DESTINO"}
                                    </span>
                                    {place.region && (
                                        <span className="inline-flex items-center gap-1 rounded bg-gray-100 dark:bg-dark-2 px-2 py-1 text-xs text-dark dark:text-white font-medium">
                                            <i className="bi bi-map"></i> {place.region}
                                        </span>
                                    )}
                                </div>

                                <div className="border-t border-stroke pt-4 dark:border-dark-3">
                                    <AnimatedButton
                                        href={`/admin/destinos/${place.id}`}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <i className="bi bi-eye"></i> Ver detalles
                                    </AnimatedButton>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {currentItems.length === 0 && !loading && <EmptyState />}
            </AdminGrid>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="rounded px-3 py-1 bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                        Anterior
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i + 1)}
                            className={`rounded px-3 py-1 border border-stroke dark:border-dark-3 ${currentPage === i + 1
                                ? "bg-primary text-white border-primary"
                                : "bg-white dark:bg-dark-2 hover:bg-gray-50 dark:hover:bg-white/5"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="rounded px-3 py-1 bg-white dark:bg-dark-2 border border-stroke dark:border-dark-3 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
