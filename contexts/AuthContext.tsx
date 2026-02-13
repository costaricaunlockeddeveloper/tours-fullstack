"use client";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ApiService, User as AppUser } from "@/services/api-service";

type CombinedUser = AppUser & { photoURL?: string | null };

interface AuthContextType {
    user: CombinedUser | null;
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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<CombinedUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Subscribe to Firebase Auth changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    // 1. User is signed in to Firebase.
                    // 2. Fetch additional role/data from our MongoDB via ApiService.
                    try {
                        const dbUser = await ApiService.syncUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || "",
                            displayName: firebaseUser.displayName || "",
                            photoURL: firebaseUser.photoURL
                        });
                        
                        // Merge Firebase User info (like photoURL) with DB info (role)
                        setUser({
                            ...dbUser,
                            photoURL: firebaseUser.photoURL,
                            uid: firebaseUser.uid // Ensure UID matches
                        });

                    } catch (err) {
                        console.error("Error fetching user data from DB:", err);
                        // Fallback if DB fails: set a basic user so they aren't locked out
                        setUser({
                            uid: firebaseUser.uid,
                            email: firebaseUser.email || "",
                            displayName: firebaseUser.displayName || "",
                            role: "client", // Fallback role
                            photoURL: firebaseUser.photoURL
                        });
                    }
                } else {
                    // User is signed out.
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth state change error:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        console.warn("Email/Password login not yet implemented with Firebase in this context.");
    };

    const logout = async () => {
        // 1. Clear the server-side session cookie
        await fetch("/api/auth/logout", { method: "POST" });
        // 2. Sign out of Firebase (clears client-side tokens)
        await signOut(auth);
        setUser(null);
        router.push("/sign-in");
        router.refresh();
    };

    const checkSession = async () => {
         // No-op manually, handled by effect
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkSession }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
