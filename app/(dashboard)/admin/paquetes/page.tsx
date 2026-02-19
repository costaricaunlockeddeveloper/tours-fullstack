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
                        <div className="relative h-48 w-full overflow-hidden">
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
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-sm backdrop-blur-sm ${pkg.isVisible ? "bg-green-500/90 text-white" : "bg-gray-500/90 text-white"}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${pkg.isVisible ? "bg-white" : "bg-gray-300"}`}></span>
                                    {pkg.isVisible ? "Visible" : "Oculto"}
                                </span>
                            </div>
                            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                                {pkg.price ? (
                                    <span className="inline-flex rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                                        Adul: ${pkg.price}
                                    </span>
                                ) : null}
                                {pkg.priceChild ? (
                                    <span className="inline-flex rounded-full bg-secondary/90 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                                        Niños: ${pkg.priceChild}
                                    </span>
                                ) : null}
                            </div>
                        </div>

                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-bold text-dark dark:text-white mb-2 line-clamp-1">
                                {pkg.name}
                            </h3>

                            <p className="mb-4 text-sm text-body-color dark:text-dark-6 line-clamp-2 min-h-[2.5rem]">
                                {pkg.description || "Sin descripción"}
                            </p>

                            <div className="mb-4 mt-auto">
                                <p className="text-xs font-semibold uppercase text-dark-5 mb-2">Destinos Incluidos:</p>
                                <div className="flex flex-wrap gap-2">
                                    {pkg.places && pkg.places.length > 0 ? (
                                        pkg.places.slice(0, 3).map(place => (
                                            <span key={place.id} className="inline-block rounded-md bg-gray-100 dark:bg-dark-2 px-2 py-1 text-xs text-dark dark:text-white">
                                                {place.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-dark-6 italic">Sin destinos asignados</span>
                                    )}
                                    {pkg.places && pkg.places.length > 3 && (
                                        <span className="inline-block rounded-md bg-gray-100 dark:bg-dark-2 px-2 py-1 text-xs text-dark dark:text-white">
                                            +{pkg.places.length - 3}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 border-t border-stroke pt-4 dark:border-dark-3 mt-4">
                                <AnimatedButton
                                    href={`/admin/paquetes/${pkg.id}`}
                                    className="w-full"
                                >
                                    Ver detalles
                                </AnimatedButton>
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
