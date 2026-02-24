"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ApiService, Package } from "@/services/api-service";
import { useSearchPagination } from "@/hooks/useSearchPagination";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminGrid } from "@/components/Admin/AdminGrid";
import { EmptyState } from "@/components/Admin/EmptyState";

export default function PackagesAdmin() {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getPackages();
            setPackages(data);
        } catch (error) {
            console.error("Error loading packages:", error);
        } finally {
            setLoading(false);
        }
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
    } = useSearchPagination(packages, 6, (pkg, query) =>
        pkg.name.toLowerCase().includes(query.toLowerCase()) ||
        (pkg.description?.toLowerCase().includes(query.toLowerCase()) ?? false)
    );

    if (loading) {
        return <div className="p-10 text-center">Cargando paquetes...</div>;
    }

    return (
        <div className="mx-auto max-w-7xl">
            <AdminHeader
                title="Paquetes Turísticos"
                description="Administra los paquetes disponibles en la plataforma."
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Buscar paquete..."
                actionLabel="Nuevo Paquete"
                actionHref="/admin/paquetes/create"
            />

            <AdminGrid>
                {currentItems.map((pkg) => (
                    <div
                        key={pkg.id}
                        className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card group hover:shadow-2 transition-all duration-300 overflow-hidden flex flex-col h-full"
                    >
                        <div className="relative h-48 w-full overflow-hidden shrink-0">
                            {pkg.images?.heroImage?.path ? (
                                <Image
                                    src={pkg.images.heroImage.path}
                                    alt={pkg.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-dark-2">
                                    <span className="text-sm text-gray-500">Sin imagen</span>
                                </div>
                            )}
                            <div className="absolute top-2 left-2">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-sm ${pkg.status === 'PUBLISHED' ? "bg-green-500/90 text-white" : pkg.status === 'ARCHIVED' ? "bg-rose-500/90 text-white" : "bg-gray-500/90 text-white"}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full bg-white`}></span>
                                    {pkg.status === 'PUBLISHED' ? "Publicado" : pkg.status === 'ARCHIVED' ? "Archivado" : "Borrador"}
                                </span>
                            </div>
                        </div>

                        <div className="p-6 flex flex-col grow">
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-dark dark:text-white mb-2 line-clamp-2">
                                    {pkg.name}
                                </h3>

                                {/* Base Price Data */}
                                <div className="mb-3 flex flex-wrap gap-x-4 gap-y-2 items-center">
                                    {pkg.price ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-dark dark:text-gray-200 font-medium tracking-wide">
                                            <i className="bi bi-tag-fill"></i> Base: ${pkg.price}
                                        </span>
                                    ) : null}
                                    {pkg.priceChild ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-dark dark:text-gray-200 font-medium tracking-wide">
                                            <i className="bi bi-person-fill"></i> Niñ: ${pkg.priceChild}
                                        </span>
                                    ) : null}
                                </div>

                                <p className="text-sm text-body-color dark:text-dark-6 line-clamp-3">
                                    {pkg.description || "Sin descripción"}
                                </p>
                            </div>

                            <div className="grow"></div>

                            <div className="mt-auto">
                                <div className="mb-4">
                                    <h4 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-gray-400 dark:text-gray-500 mb-2 tracking-wider">
                                        <i className="bi bi-geo-alt-fill"></i> Destinos Incluidos
                                    </h4>
                                <div className="flex flex-wrap gap-2">
                                    {pkg.places && pkg.places.length > 0 ? (
                                        <>
                                            {pkg.places.slice(0, 2).map(place => (
                                                <span key={place.id} className="inline-block rounded-md bg-gray-100 dark:bg-dark-2 px-2 py-1 text-xs text-dark dark:text-white max-w-[150px] truncate" title={place.name}>
                                                    {place.name}
                                                </span>
                                            ))}
                                            {pkg.places.length > 2 && (
                                                <span className="inline-block rounded-md bg-gray-100 dark:bg-dark-2 px-2 py-1 text-xs text-dark dark:text-white">
                                                    +{pkg.places.length - 2} destinos
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
                                        href={`/admin/paquetes/${pkg.id}`}
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
