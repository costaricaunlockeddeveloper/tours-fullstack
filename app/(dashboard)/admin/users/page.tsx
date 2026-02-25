"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { ApiService, User } from "@/services/api-service";
import { useEffect, useState } from "react";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function UsersAdmin() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addEmail, setAddEmail] = useState("");
    const [addError, setAddError] = useState("");

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await ApiService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRemoveAdmin = async (id: string) => {
        if (confirm("¿Estás seguro que deseas quitar los permisos de administrador a este usuario?")) {
            try {
                await ApiService.updateUserRole(id, "client");
                loadUsers();
            } catch (error) {
                alert("Error al actualizar rol");
                console.error(error);
            }
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddError("");
        
        if (!addEmail.trim()) {
            setAddError("Por favor ingresa un correo electrónico.");
            return;
        }

        const userFound = users.find(u => u.email.toLowerCase() === addEmail.toLowerCase().trim());
        
        if (!userFound) {
            setAddError("El usuario no ha iniciado sesión en el sistema. Asegúrate de que se haya registrado antes.");
            return;
        }

        if (userFound.role === "admin") {
            setAddError("Este usuario ya ha sido agregado como administrador.");
            return;
        }

        try {
            await ApiService.updateUserRole(userFound.id, "admin");
            setIsAddModalOpen(false);
            setAddEmail("");
            loadUsers();
        } catch (error) {
             setAddError("Error al agregar administrador.");
             console.error(error);
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Cargando administradores...</div>;
    }

    const admins = users.filter(u => u.role === "admin");

    return (
        <div className="mx-auto max-w-7xl relative">
            <Breadcrumb pageName="Gestión de Administradores" />

            {/* Header / Actions */}
            <div className="mb-6 flex justify-end">
                <AnimatedButton onClick={() => { setIsAddModalOpen(true); setAddError(""); setAddEmail(""); }}>
                    + Agregar Administrador
                </AnimatedButton>
            </div>

            <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="px-4 py-6 md:px-6 xl:px-7.5">
                    <h4 className="text-xl font-bold text-dark dark:text-white">
                        Administradores del Sistema
                    </h4>
                </div>
                <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-9 md:px-6 2xl:px-7.5">
                    <div className="col-span-3 flex items-center">
                        <p className="font-medium">Usuario</p>
                    </div>
                    <div className="col-span-3 hidden items-center sm:flex">
                        <p className="font-medium">Email</p>
                    </div>
                    <div className="col-span-3 flex items-center justify-end">
                        <p className="font-medium">Acciones</p>
                    </div>
                </div>
                {admins.map((user, key) => (
                    <div
                        className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-9 md:px-6 2xl:px-7.5 items-center"
                        key={key}
                    >
                        <div className="col-span-3 flex items-center">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden shrink-0 bg-primary/10 flex items-center justify-center text-primary font-bold uppercase">
                                    {user.displayName?.charAt(0) || "A"}
                                </div>
                                <p className="text-sm font-medium text-dark dark:text-white">
                                    {user.displayName || "Usuario sin nombre"}
                                </p>
                            </div>
                        </div>
                        <div className="col-span-3 hidden items-center sm:flex">
                            <p className="text-sm text-dark dark:text-white">
                                {user.email}
                            </p>
                        </div>
                        <div className="col-span-3 flex items-center justify-end">
                            <button
                                onClick={() => handleRemoveAdmin(user.id)}
                                className="text-sm font-medium text-danger hover:underline transition-all hover:text-red-600"
                            >
                                Quitar permisos
                            </button>
                        </div>
                    </div>
                ))}

                {admins.length === 0 && (
                    <div className="p-6 text-center text-sm text-gray-500">No hay administradores registrados aparte de los configurados por defecto.</div>
                )}
            </div>

            {/* Modal for adding Admin */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 transition-opacity">
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg dark:bg-dark-2">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-dark dark:text-white">Agregar Administrador</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-dark dark:hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddAdmin}>
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
                                    Correo electrónico del usuario
                                </label>
                                <input
                                    type="email"
                                    value={addEmail}
                                    onChange={(e) => setAddEmail(e.target.value)}
                                    placeholder="ejemplo@correo.com"
                                    className="w-full rounded-lg border border-stroke bg-transparent py-3 px-4 text-dark outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:text-white"
                                    required
                                    autoFocus
                                />
                                {addError && (
                                    <p className="mt-2 text-sm text-danger">{addError}</p>
                                )}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="rounded-lg border border-stroke px-6 py-2 font-medium text-dark hover:shadow-1 transition-all dark:border-dark-3 dark:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-primary px-6 py-2 font-medium text-white shadow-md hover:bg-opacity-90 transition-all hover:shadow-lg"
                                >
                                    Agregar Administrador
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
