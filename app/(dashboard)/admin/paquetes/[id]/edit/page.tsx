"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ApiService, Package } from "@/services/api-service";
import PackageForm from "@/components/Admin/packages/PackageForm";
import Link from "next/link";

export default function EditPackagePage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [pkg, setPkg] = useState<Package | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!id) return;
            try {
                // Fetch Package
                const pkgData = await ApiService.getPackage(id);

                setPkg(pkgData);
            } catch (error) {
                console.error("Error loading data:", error);
                router.push("/admin/paquetes");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [id, router]);

    const handleSubmit = async (data: Omit<Package, "id">) => {
        try {
            setIsSubmitting(true);
            // Ensure type compatibility - the form gives Omit<Package, "id"> which is essentially Partial<Package> compatible
            await ApiService.updatePackage(id, data);
            router.push(`/admin/paquetes/${id}`);
            router.refresh();
        } catch (error) {
            console.error("Error updating package:", error);
            alert("Error al actualizar el paquete.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando datos...</div>;
    if (!pkg) return null;

    return (
        <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-4">
                <Link
                    href={`/admin/paquetes/${id}`}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-stroke bg-white text-dark hover:shadow-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                    <svg className="fill-current" width="20" height="20" viewBox="0 0 20 20">
                        <path d="M14.707 16.707a1 1 0 01-1.414 0L6 9.414l7.293-7.293a1 1 0 011.414 1.414L8.414 9.414l6.293 6.293a1 1 0 010 1.414z" />
                    </svg>
                </Link>
                <div>
                    <h2 className="text-2xl font-bold text-dark dark:text-white">Editar Paquete</h2>
                    <p className="text-sm text-dark-6">Modifica la información del paquete turístico.</p>
                </div>
            </div>

            <PackageForm
                initialData={pkg}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => router.push(`/admin/paquetes/${id}`)}
                simpleMode={false} // Full editing mode
            />
        </div>
    );
}
