// src/hooks/useAuth.ts
import { useAuthContext } from "@/context/AuthContext";

/**
 * Convenience hook — re-exports the AuthContext value with a derived `companyId`
 * so existing call-sites that depend on `companyId` continue to work.
 */
export function useAuth() {
    const { auth, isAuthenticated, isLoading, logout } = useAuthContext();

    return {
        /** Raw JWT token */
        token: auth?.token ?? null,
        /** Full user object from the Identity service */
        user: auth?.user ?? null,
        /** Company UUID scoped to the current session */
        companyId: auth?.user?.company?.id ?? null,
        isAuthenticated,
        isLoading,
        logout,
    };
}
