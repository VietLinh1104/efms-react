// src/context/AuthContext.tsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { UserResponse } from "@/api/generated/identity/api";

// -------------------------------------------------------------------
// Types
// -------------------------------------------------------------------
export interface AuthUser {
    token: string;
    user: UserResponse;
}

interface AuthContextValue {
    /** Currently authenticated user + token, or null if not logged in */
    auth: AuthUser | null;
    /** true while the initial auth state is being hydrated from storage */
    isLoading: boolean;
    /** Persist auth data after a successful login */
    setAuthData: (data: AuthUser) => void;
    /** Clear auth state and remove token from storage */
    logout: () => void;
    /** Convenience getter */
    isAuthenticated: boolean;
}

// -------------------------------------------------------------------
// Context
// -------------------------------------------------------------------
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// -------------------------------------------------------------------
// Storage helpers
// -------------------------------------------------------------------
const TOKEN_KEY = "efms_token";
const USER_KEY = "efms_user";

function persistAuth(data: AuthUser) {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
}

function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

function loadAuth(): AuthUser | null {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    if (!token || !userRaw) return null;
    try {
        const user: UserResponse = JSON.parse(userRaw);
        return { token, user };
    } catch {
        return null;
    }
}

// -------------------------------------------------------------------
// Provider
// -------------------------------------------------------------------
interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [auth, setAuth] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Hydrate auth state from localStorage on mount
    useEffect(() => {
        const stored = loadAuth();
        if (stored) {
            setAuth(stored);
        }
        setIsLoading(false);
    }, []);

    const setAuthData = useCallback((data: AuthUser) => {
        persistAuth(data);
        setAuth(data);
    }, []);

    const logout = useCallback(() => {
        clearAuth();
        setAuth(null);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            auth,
            isLoading,
            setAuthData,
            logout,
            isAuthenticated: auth !== null,
        }),
        [auth, isLoading, setAuthData, logout]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// -------------------------------------------------------------------
// Hook
// -------------------------------------------------------------------
export function useAuthContext(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuthContext must be used within <AuthProvider>");
    }
    return ctx;
}
