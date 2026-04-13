// src/components/common/ProtectedRoute.tsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

/**
 * Middleware component that guards all child routes.
 * - If still hydrating auth state → shows a loading spinner (no flash redirect).
 * - If not authenticated → redirects to /login, preserving the intended destination.
 * - If authenticated → renders children via <Outlet />.
 */
const ProtectedRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuthContext();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-background">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Preserve the attempted URL so we can redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
