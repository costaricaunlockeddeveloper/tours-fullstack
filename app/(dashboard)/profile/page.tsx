"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useAuth } from "@/contexts/AuthContext";
import { UsersService } from "@/services/users.service";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  // Form States
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");

  // UI States
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPhone((user as any).phone || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSaving(true);
    try {
      if (user) {
        await UsersService.syncUser({
          uid: user.uid,
          email: user.email,
          displayName: displayName,
          phone: phone
        });
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
        // Optionally reload or sync context here if needed, 
        // but syncUser updates the DB which is the source of truth for next session.
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al actualizar perfil.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando...</div>;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-[970px] p-4">
        <div className="rounded-lg bg-red-50 p-4 text-red-500 border border-red-200">
          No has iniciado sesión.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Configuración de Perfil" />

      {message && (
        <div className={`mb-6 rounded-lg border px-4 py-3 ${message.type === 'success'
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-red-50 text-red-700 border-red-200'
          }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9">
          {/* Profile Information */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card overflow-hidden">
            <div className="bg-primary/5 border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-bold text-dark dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Información de la Cuenta
              </h3>
            </div>
            <form onSubmit={handleUpdateProfile}>
              <div className="p-6.5">
                <div className="mb-6">
                  <label className="mb-3 block text-sm font-bold text-black dark:text-white uppercase tracking-wider">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={user.email || ""}
                      disabled
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-gray-100 py-3 px-5 font-medium outline-none transition dark:border-dark-3 dark:bg-form-input opacity-70 cursor-not-allowed"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Autenticado con Google. El correo no se puede modificar.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="mb-3 block text-sm font-bold text-black dark:text-white uppercase tracking-wider">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-form-input dark:focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-bold text-black dark:text-white uppercase tracking-wider">
                      Número de Teléfono
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="+506 8888-8888"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 pl-12 pr-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-form-input dark:focus:border-primary"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-10 py-3.5 text-center font-bold text-white hover:bg-opacity-90 disabled:opacity-70 transition-all shadow-lg shadow-primary/20"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Guardando...
                      </>
                    ) : "Guardar Cambios"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
