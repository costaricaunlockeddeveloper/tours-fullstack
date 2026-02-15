
import Signin from "@/components/Auth/Signin";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign in | Admin Dashboard",
};

export default function SignIn() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-black">
      {/* Left Column: Hero Image & Branding */}
      <div className="relative w-full lg:w-1/2 h-[40vh] lg:h-screen flex flex-col justify-between p-8 lg:p-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/img/hero/03.jpg"
            alt="Costa Rica Nature"
            fill
            className="object-cover"
            priority
          />
          {/* Dark Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 lg:bg-gradient-to-r lg:from-black/80 lg:via-black/40 lg:to-transparent" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <Image
              src="/assets/img/logo/dark.svg"
              alt="Logo"
              width={160}
              height={40}
              className="drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]"
            />
          </Link>
        </div>

        {/* Tagline (Visible on Desktop mainly, adjusted for mobile) */}
        <div className="relative z-10 text-white mt-auto lg:mt-0">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight drop-shadow-lg">
            Unlock Your Ultimate <br /> <span className="text-primary">Costa Rica Adventure</span>
          </h1>
          <p className="text-gray-200 text-sm lg:text-lg max-w-md drop-shadow-md hidden sm:block">
            Accede al panel de control para gestionar tours, destinos y experiencias inolvidables.
          </p>
        </div>
      </div>

      {/* Right Column: Sign-in Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative -mt-8 lg:mt-0 z-20 bg-white dark:bg-gray-dark rounded-t-3xl lg:rounded-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:shadow-none">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold text-dark dark:text-white mb-2">
              Bienvenido de nuevo
            </h2>
            <p className="text-body-color dark:text-dark-6">
              Ingresa con Google
            </p>
          </div>

          <div className="bg-white dark:bg-dark-2 rounded-xl p-0 lg:p-0 shadow-none">
            <Signin />
          </div>

          <div className="text-center text-xs text-gray-500 mt-8">
            <p>&copy; 2026 Dignita Tech.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
