"use client";

import { useEffect, useState } from "react";
import { ReservationsService } from "@/services/reservations.service";
import { Reservation } from "@/types";
import { useParams, useRouter } from "next/navigation";
import AnimatedButton from "@/components/ui/AnimatedButton";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export default function ReservationDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [reservation, setReservation] = useState<Reservation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await ReservationsService.getReservationById(Array.isArray(id) ? id[0] : id);
                setReservation(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) return <div className="p-10 text-center">Cargando reserva...</div>;
    if (!reservation) return <div className="p-10 text-center">Reserva no encontrada.</div>;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "text-emerald-700 bg-emerald-100 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
            case "pending": return "text-amber-700 bg-amber-100 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
            case "cancelled": return "text-rose-700 bg-rose-100 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
            case "completed": return "text-blue-700 bg-blue-100 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
            default: return "text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "confirmed": return "Confirmada";
            case "pending": return "Pendiente";
            case "cancelled": return "Cancelada";
            case "completed": return "Completada";
            default: return status.toUpperCase();
        }
    };

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-white">
                        Reserva #{reservation.id}
                    </h2>
                    <p className="text-sm text-dark-6">
                        Creada el {dayjs(reservation.createdAt).format("DD [de] MMMM, YYYY")}
                    </p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-medium text-dark hover:text-primary dark:text-white"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Client Info */}
                <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                    <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">Información del Cliente</h3>
                    <div className="flex flex-col gap-4">
                        <div>
                            <span className="block text-sm text-dark-6">Nombre Completo</span>
                            <span className="text-base font-medium text-dark dark:text-white">{reservation.userName}</span>
                        </div>
                        <div>
                            <span className="block text-sm text-dark-6">Email</span>
                            <span className="text-base font-medium text-dark dark:text-white">{reservation.userEmail}</span>
                        </div>
                        {reservation.userId && (
                            <div>
                                <span className="block text-sm text-dark-6">ID Usuario</span>
                                <span className="text-base font-medium text-dark dark:text-white text-xs">{reservation.userId}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Booking Info */}
                <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card">
                    <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">Detalles de la Reserva</h3>
                    <div className="flex flex-col gap-4">
                        <div>
                            <span className="block text-sm text-dark-6">Producto Reservado</span>
                            <span className="text-base font-medium text-dark dark:text-white">
                                {reservation.tourName || reservation.packageName}
                            </span>
                            {reservation.tourId && <span className="text-xs text-primary ml-2">(Tour)</span>}
                            {reservation.packageId && <span className="text-xs text-secondary ml-2">(Paquete)</span>}
                        </div>
                        <div>
                            <span className="block text-sm text-dark-6">Fecha del Viaje</span>
                            <span className="text-base font-medium text-dark dark:text-white">
                                {dayjs(reservation.date).format("DD [de] MMMM, YYYY")}
                            </span>
                        </div>
                        <div>
                            <span className="block text-sm text-dark-6">Pasajeros (Pax)</span>
                            <span className="text-base font-medium text-dark dark:text-white">{reservation.pax}</span>
                        </div>
                    </div>
                </div>

                {/* Status & Payment */}
                <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark dark:shadow-card md:col-span-2 border-l-4 border-primary">
                    <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Resumen de Pago
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <span className="block text-xs uppercase font-bold text-gray-400 mb-2">Estado de Reserva</span>
                            <span className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-semibold ${getStatusColor(reservation.status)}`}>
                                {getStatusLabel(reservation.status)}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs uppercase font-bold text-gray-400 mb-2">Estado de Pago</span>
                            <span className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-semibold ${reservation.paymentStatus === 'paid'
                                ? 'text-emerald-700 bg-emerald-100 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400'
                                : reservation.paymentStatus === 'partial'
                                    ? 'text-amber-700 bg-amber-100 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400'
                                    : 'text-rose-700 bg-rose-100 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400'
                                }`}>
                                {reservation.paymentStatus === 'paid' ? 'PAGADO' : reservation.paymentStatus === 'partial' ? 'PARCIAL' : 'PENDIENTE'}
                            </span>
                        </div>
                        <div>
                            <span className="block text-xs uppercase font-bold text-gray-400 mb-2">Total con impuestos</span>
                            <span className="text-3xl font-black text-primary dark:text-white">
                                ${reservation.totalPrice.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="mt-8 bg-gray-50 dark:bg-white/5 rounded-xl p-4">
                        <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">Desglose de Costos (Snapshot)</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Adultos ({reservation.adults} x ${reservation.unitPriceAdult?.toLocaleString() || (reservation.subtotal / reservation.pax).toLocaleString()})</span>
                                <span className="font-semibold">${(reservation.adults * (reservation.unitPriceAdult || (reservation.subtotal / reservation.pax))).toLocaleString()}</span>
                            </div>
                            {reservation.children > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Niños ({reservation.children} x ${reservation.unitPriceChild?.toLocaleString() || (reservation.subtotal / reservation.pax).toLocaleString()})</span>
                                    <span className="font-semibold">${(reservation.children * (reservation.unitPriceChild || (reservation.subtotal / reservation.pax))).toLocaleString()}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold">
                                <span>Subtotal</span>
                                <span>${reservation.subtotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details Section (New) */}
                    {reservation.paymentId && (
                        <div className="mt-8 border-t border-stroke pt-6 dark:border-dark-3">
                            <h4 className="mb-4 text-lg font-semibold text-dark dark:text-white">Datos del Pago</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <span className="block text-xs text-dark-6 uppercase mb-1">Transacción ID</span>
                                    <span className="text-sm font-medium text-dark dark:text-white break-all">{reservation.paymentId}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-dark-6 uppercase mb-1">Monto Pagado</span>
                                    <span className="text-sm font-medium text-dark dark:text-white">${reservation.paymentAmount} {reservation.paymentCurrency?.toUpperCase()}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-dark-6 uppercase mb-1">Método</span>
                                    <span className="text-sm font-medium text-dark dark:text-white capitalize">{reservation.paymentMethod}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-dark-6 uppercase mb-1">Fecha de Pago</span>
                                    <span className="text-sm font-medium text-dark dark:text-white">
                                        {reservation.paymentDate ? dayjs(reservation.paymentDate).format("DD/MM/YYYY HH:mm") : '-'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                <button className="px-6 py-2 rounded-lg border border-stroke text-dark hover:bg-gray-50 dark:border-dark-3 dark:text-white dark:hover:bg-white/5 transition">
                    Cancelar Reserva
                </button>
                <button className="px-6 py-2 rounded-lg bg-primary text-white hover:opacity-90 transition">
                    Confirmar Pago
                </button>
            </div>
        </div>
    );
}
