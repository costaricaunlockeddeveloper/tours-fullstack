"use client";

import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    user: any | null;
    loading: boolean;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    loginWithGoogle: async () => { },
    logout: async () => { },
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

    const loginWithGoogle = async () => {
        await signIn("google", { callbackUrl: "/sign-in" });
    };

    const logout = async () => {
        await signOut({ redirect: false });
        router.push("/");
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user: session?.user || null, loading, loginWithGoogle, logout }}>
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
