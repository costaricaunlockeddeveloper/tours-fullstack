
"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SigninWithPassword() {
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(data.email, data.password);
      router.push("/admin/destinos");
    } catch (error: any) {
      console.error("Login failed:", error);
      alert("Error al iniciar sesión: " + (error.message || "Credenciales incorrectas"));
    } finally {
      setLoading(false);
    }
  };

  const handleDirectAdminLogin = async () => {
    setLoading(true);
    const adminEmail = "admin@admin.com";
    const adminPass = "admin";

    try {
      // Create seed just in case
      await fetch('/api/seed');
      await login(adminEmail, adminPass);
      router.push("/admin/destinos");
    } catch (error) {
      console.error("Direct admin login failed:", error);
      alert("No se pudo acceder como administrador. Verifica la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputGroup
        type="email"
        label="Email"
        className="[&_input]:py-[15px] [&_input]:bg-transparent [&_input]:border-stroke [&_input]:text-dark [&_input]:focus:border-primary dark:[&_input]:border-white/20 dark:[&_input]:text-white dark:[&_input]:focus:border-primary [&_label]:text-dark dark:[&_label]:text-white/80"
        placeholder="Enter your email"
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon className="text-dark-5 dark:text-white/60" />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="[&_input]:py-[15px] [&_input]:bg-transparent [&_input]:border-stroke [&_input]:text-dark [&_input]:focus:border-primary dark:[&_input]:border-white/20 dark:[&_input]:text-white dark:[&_input]:focus:border-primary [&_label]:text-dark dark:[&_label]:text-white/80"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon className="text-dark-5 dark:text-white/60" />}
      />

      <div className="flex items-center justify-between gap-2 py-2 font-medium text-dark-5 dark:text-white/80">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary transition-colors"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 hover:shadow-lg hover:shadow-primary/50"
        >
          Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
          )}
        </button>

        <button
          type="button"
          onClick={handleDirectAdminLogin}
          disabled={loading}
          className="group relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-stroke bg-white p-4 font-medium text-dark transition hover:bg-gray-1 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
        >
          <span className="relative flex items-center gap-2">
            🚀 Acceso Directo Admin
          </span>
        </button>
      </div>
    </form>
  );
}
