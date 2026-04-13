// src/components/common/PublicRoute.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

/**
 * Inverse of ProtectedRoute.
 * - Nếu đang hydrate → show spinner (tránh flash redirect sai).
 * - Nếu đã đăng nhập → redirect về "/" (không cho vào /login nữa).
 * - Nếu chưa đăng nhập → render children bình thường.
 */
const PublicRoute: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuthContext();

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

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;
