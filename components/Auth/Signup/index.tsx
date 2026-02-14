
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { GoogleIcon, EmailIcon, PasswordIcon } from "@/assets/icons";
import InputGroup from "../../FormElements/InputGroup";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Signup() {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

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

        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    displayName: data.name,
                }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Registration failed");
            }

            // Login after registration
            const result = await signIn("credentials", {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            router.push("/");
            router.refresh();

        } catch (error: any) {
            console.error("Registration failed:", error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

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

            <div className="my-6 flex items-center justify-center">
                <span className="block h-px w-full bg-stroke dark:bg-white/10"></span>
                <div className="block w-full min-w-fit bg-transparent px-3 text-center font-medium text-dark-5 dark:text-white/50">
                    Or sign up with email
                </div>
                <span className="block h-px w-full bg-stroke dark:bg-white/10"></span>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <InputGroup
                    type="text"
                    label="Full Name"
                    className="[&_input]:py-[15px] [&_input]:bg-transparent [&_input]:border-stroke [&_input]:text-dark [&_input]:focus:border-primary dark:[&_input]:border-white/20 dark:[&_input]:text-white dark:[&_input]:focus:border-primary [&_label]:text-dark dark:[&_label]:text-white/80"
                    placeholder="Enter your full name"
                    name="name"
                    handleChange={handleChange}
                    value={data.name}
                />

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

                <InputGroup
                    type="password"
                    label="Confirm Password"
                    className="[&_input]:py-[15px] [&_input]:bg-transparent [&_input]:border-stroke [&_input]:text-dark [&_input]:focus:border-primary dark:[&_input]:border-white/20 dark:[&_input]:text-white dark:[&_input]:focus:border-primary [&_label]:text-dark dark:[&_label]:text-white/80"
                    placeholder="Confirm your password"
                    name="confirmPassword"
                    handleChange={handleChange}
                    value={data.confirmPassword}
                    icon={<PasswordIcon className="text-dark-5 dark:text-white/60" />}
                />

                <div className="flex flex-col gap-4 mt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 hover:shadow-lg hover:shadow-primary/50"
                    >
                        Create Account
                        {loading && (
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
                        )}
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-dark-5 dark:text-white/60">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-primary hover:text-dark dark:hover:text-white transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </form>
        </>
    );
}
