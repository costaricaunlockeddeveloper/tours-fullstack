"use client";

import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiService, User as AppUser } from "@/services/api-service";

interface AuthContextType {
    user: any | null; // Using any to match the flexible session structure for now
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    logout: async () => { },
    checkSession: async () => { },
});

// Inner component to use the session hook
const AuthContextContent = ({ children }: { children: React.ReactNode }) => {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (status === "loading") {
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [status]);

    const login = async (email: string, password: string) => {
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (result?.error) {
            throw new Error(result.error);
        }

        // Router refresh or push handled by component or here
        router.refresh();
    };

    const logout = async () => {
        await signOut({ redirect: false });
        router.push("/sign-in");
        router.refresh();
    };

    const checkSession = async () => {
        // Handled by NextAuth useSession automatically
    };

    return (
        <AuthContext.Provider value={{ user: session?.user || null, loading, login, logout, checkSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SessionProvider>
            <AuthContextContent>{children}</AuthContextContent>
        </SessionProvider>
    );
};

export const useAuth = () => useContext(AuthContext);
