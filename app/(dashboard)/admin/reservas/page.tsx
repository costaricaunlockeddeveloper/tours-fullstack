"use client";

import { useEffect, useState } from "react";
import { ReservationsService } from "@/services/reservations.service";
import { Reservation } from "@/types";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import { AdminTable } from "@/components/Admin/AdminTable";
import { useSearchPagination } from "@/hooks/useSearchPagination"; // Reusing pagination hook logic manually for now or adapting
import AnimatedButton from "@/components/ui/AnimatedButton";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export default function ReservationsAdmin() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("all");

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await ReservationsService.getReservations();
            setReservations(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // 1. Filter by Status first
    const statusFilteredData = reservations.filter(res =>
        filterStatus === "all" || res.status === filterStatus
    );

    // 2. Use hook for Search and Pagination
    const {
        searchQuery,
        setSearchQuery,
        currentItems,
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        totalItems
    } = useSearchPagination(statusFilteredData, 10, (res, query) =>
        res.userName.toLowerCase().includes(query.toLowerCase()) ||
        res.userEmail.toLowerCase().includes(query.toLowerCase()) ||
        res.id.toLowerCase().includes(query.toLowerCase()) ||
        (res.tourName?.toLowerCase().includes(query.toLowerCase()) ?? false) ||
        (res.packageName?.toLowerCase().includes(query.toLowerCase()) ?? false)
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "text-emerald-700 bg-emerald-100 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
            case "pending": return "text-amber-700 bg-amber-100 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
            case "cancelled": return "text-rose-700 bg-rose-100 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
            case "completed": return "text-blue-700 bg-blue-100 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
            default: return "text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case "paid": return "text-emerald-600 dark:text-emerald-400";
            case "partial": return "text-amber-600 dark:text-amber-400";
            default: return "text-rose-600 dark:text-rose-400";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "confirmed": return "Confirmada";
            case "pending": return "Pendiente";
            case "cancelled": return "Cancelada";
            case "completed": return "Completada";
            default: return status;
        }
    };

    const columns = [
        {
            header: "ID",
            cell: (res: Reservation) => (
                <span className="text-xs font-mono text-gray-400 hover:text-primary cursor-default whitespace-nowrap">
                    #{res.id.substring(res.id.length - 6).toUpperCase()}
                </span>
            )
        },
        {
            header: "Cliente",
            cell: (res: Reservation) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                        {res.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 dark:text-white leading-tight">{res.userName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{res.userEmail}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Producto",
            cell: (res: Reservation) => (
                <div className="flex items-center gap-2">
                    {res.tourId ? (
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    )}
                    <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 line-clamp-1">
                            {res.tourName || res.packageName || "N/A"}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                            {res.tourId ? "Tour" : "Paquete"}
                        </p>
                    </div>
                </div>
            )
        },
        {
            header: "Fecha",
            cell: (res: Reservation) => (
                <div className="text-sm">
                    <p className="font-medium text-gray-700 dark:text-gray-200">{dayjs(res.date).format("DD MMM YYYY")}</p>
                    {res.selectedTime && <p className="text-xs text-gray-500">{res.selectedTime}</p>}
                </div>
            )
        },
        {
            header: "Pago",
            cell: (res: Reservation) => (
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ${res.totalPrice.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                        <div className={`h-1.5 w-1.5 rounded-full ${res.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className={`text-[10px] font-bold uppercase ${getPaymentStatusColor(res.paymentStatus)}`}>
                            {res.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: "Estado",
            cell: (res: Reservation) => (
                <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${getStatusColor(res.status)}`}>
                    {getStatusLabel(res.status)}
                </span>
            )
        },
        {
            header: "Acciones",
            className: "text-right",
            cell: (res: Reservation) => (
                <div className="flex justify-end gap-2">
                    <Link
                        href={`/admin/reservas/${res.id}`}
                        className="p-2 rounded-lg bg-gray-100 hover:bg-primary hover:text-white dark:bg-dark-2 dark:hover:bg-primary transition-all duration-200"
                        title="Ver Detalles"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </Link>
                </div>
            )
        }
    ];

    return (
        <div className="mx-auto max-w-7xl">
            <AdminHeader
                title="Reservas"
                description="Gestiona todas las reservas de tours y paquetes."
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchPlaceholder="Buscar por cliente, ID..."
            // actionLabel="Nueva Reserva" // Optional if we want manual creation
            // actionHref="/admin/reservas/create"
            />

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-2">
                {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${filterStatus === status
                            ? "bg-primary text-white"
                            : "bg-white text-dark hover:bg-gray-50 dark:bg-dark-2 dark:text-white dark:hover:bg-white/5"
                            }`}
                    >
                        {status === "all" ? "Todas" : getStatusLabel(status)}
                    </button>
                ))}
            </div>

            <AdminTable
                data={currentItems}
                columns={columns}
                keyExtractor={(item) => item.id}
                isLoading={loading}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Mostrando {currentItems.length} de {totalItems} reservas
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-gray-300 dark:border-strokedark disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-meta-4"
                        >
                            Anterior
                        </button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => goToPage(i + 1)}
                                className={`px-3 py-1 rounded border ${currentPage === i + 1
                                    ? "bg-primary text-white border-primary"
                                    : "border-gray-300 dark:border-strokedark hover:bg-gray-100 dark:hover:bg-meta-4"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border border-gray-300 dark:border-strokedark disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-meta-4"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
