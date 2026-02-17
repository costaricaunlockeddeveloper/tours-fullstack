"use client";
import React from "react";
import Link from "next/link";
import { GoogleIcon } from "@/assets/icons";
import { signIn } from "next-auth/react";

export default function Signup() {
    const handleGoogleSignIn = async () => {
        await signIn("google", { callbackUrl: "/" });
    };

    return (
        <>
            <button
                onClick={handleGoogleSignIn}
                type="button"
                className="flex w-full items-center justify-center gap-3.5 rounded-xl border border-stroke bg-white p-[15px] font-medium text-dark transition hover:bg-opacity-90 hover:shadow-lg dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
                <GoogleIcon />
                Sign up with Google
            </button>

            <div className="mt-6 text-center">
                <p className="text-dark-5 dark:text-white/60">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-primary hover:text-dark dark:hover:text-white transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </>
    );
}
