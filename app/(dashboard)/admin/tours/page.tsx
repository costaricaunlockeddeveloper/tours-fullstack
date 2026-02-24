"use client";

import { useEffect, useState } from "react";
import { ToursService } from "@/services/tours.service";
import { Tour, Place } from "@/types";
import Image from "next/image";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminGrid } from "@/components/Admin/AdminGrid";
import { EmptyState } from "@/components/Admin/EmptyState";

dayjs.locale("es");

export default function ToursAdmin() {
    const [tours, setTours] = useState<(Tour & { places?: Place[] })[]>([]);

    const loadData = async () => {
        const toursData = await ToursService.getTours();
        setTours(toursData);
    };

    useEffect(() => {
        loadData();
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
    } = useSearchPagination(tours, 6, (tour, query) =>
        tour.name.toLowerCase().includes(query.toLowerCase()) ||
        (tour.description?.toLowerCase().includes(query.toLowerCase()) ?? false)
    );

    return (
        <div className="mx-auto max-w-7xl">
            <AdminHeader
                title="Tours"
                description="Administra los tours y sus horarios."
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Buscar tour..."
                actionLabel="Nuevo Tour"
                actionHref="/admin/tours/create"
            />

            <AdminGrid>
                {currentItems.map((tour) => (
                    <div
                        key={tour.id}
                        className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card group hover:shadow-2 transition-all duration-300 overflow-hidden flex flex-col h-full"
                    >
                        <div className="relative h-48 w-full overflow-hidden shrink-0">
                            {tour.images?.heroImage?.path ? (
                                <Image
                                    src={tour.images.heroImage.path}
                                    alt={tour.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-dark-2">
                                    <span className="text-sm text-gray-500">Sin imagen</span>
                                </div>
                            )}
                            <div className="absolute top-2 left-2">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-sm ${tour.status === 'PUBLISHED' ? "bg-green-500/90 text-white" : tour.status === 'ARCHIVED' ? "bg-rose-500/90 text-white" : "bg-gray-500/90 text-white"}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full bg-white`}></span>
                                    {tour.status === 'PUBLISHED' ? "Publicado" : tour.status === 'ARCHIVED' ? "Archivado" : "Borrador"}
                                </span>
                            </div>
                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                {tour.defaults?.price ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 dark:bg-black/80 px-3 py-1 text-xs font-bold text-dark dark:text-white shadow-sm backdrop-blur-sm">
                                        <i className="bi bi-tag-fill"></i> Adul: ${tour.defaults.price}
                                    </span>
                                ) : null}
                                {tour.defaults?.priceChild ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 dark:bg-black/80 px-3 py-1 text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm backdrop-blur-sm">
                                        <i className="bi bi-person-fill"></i> Niños: ${tour.defaults.priceChild}
                                    </span>
                                ) : null}
                            </div>
                        </div>

                        <div className="p-6 flex flex-col grow">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-dark dark:text-white mb-2 line-clamp-2">
                                    {tour.name}
                                </h3>

                                {/* Operational Data & Dates */}
                                <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2 items-center">
                                    {tour.duration ? (
                                        <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 font-medium">
                                            <i className="bi bi-clock"></i> {tour.duration}h
                                        </span>
                                    ) : null}

                                    {tour.availableDates && tour.availableDates.length > 0 ? (
                                        <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                                            <i className="bi bi-calendar"></i> {tour.availableDates.length} fechas activas
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                                            <i className="bi bi-exclamation-triangle"></i> Sin fechas programadas
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-body-color dark:text-dark-6 line-clamp-3">
                                    {tour.description}
                                </p>
                            </div>

                            <div className="grow"></div>

                            <div className="mt-auto">
                                <div className="mb-4">
                                    <h4 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2 tracking-wider">
                                        <i className="bi bi-geo-alt-fill"></i> Destinos Incluidos
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tour.places && tour.places.length > 0 ? (
                                            <>
                                                {tour.places.slice(0, 2).map(place => (
                                                    <span key={place.id} className="inline-block rounded-md bg-gray-100 dark:bg-dark-2 px-2 py-1 text-xs text-dark dark:text-white max-w-[150px] truncate" title={place.name}>
                                                        {place.name}
                                                    </span>
                                                ))}
                                                {tour.places.length > 2 && (
                                                    <span className="inline-block rounded-md bg-gray-100 dark:bg-dark-2 px-2 py-1 text-xs text-dark dark:text-white">
                                                        +{tour.places.length - 2} destinos
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-xs text-dark-6 italic">Sin destinos asignados</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2 border-t border-stroke pt-4 dark:border-dark-3">
                                    <AnimatedButton
                                        href={`/admin/tours/${tour.id}`}
                                        className="w-full flex items-center justify-center gap-2"
                                    >
                                        <i className="bi bi-eye"></i> Ver detalles
                                    </AnimatedButton>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {currentItems.length === 0 && <EmptyState />}
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
