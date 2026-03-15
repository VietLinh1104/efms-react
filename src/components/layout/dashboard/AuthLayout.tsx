// src/layouts/DashboardLayout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import {
  SidebarHeader
} from "@/components/ui/sidebar"
import { Codepen } from 'lucide-react';

// Khai báo Interface để code sạch và dễ mở rộng
interface AuthLayoutProps {
  title?: string; // Dấu ? nghĩa là không bắt buộc
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ title }) => {
  return (
    <div className="layout flex h-screen">
      <header className="bg-primary-foreground w-1/2 border-r border-border p-8">
        <SidebarHeader className="bg-none h-12 flex items-start justify-center p-2"  >
          <div className="flex items-center gap-2 hover:bg-sidebar-accent rounded-sm cursor-pointer px-3 py-3 h-full ">
            <Codepen className="w-5 h-5" />
            <h1 className="text-sm font-semibold">Dashboard</h1>
          </div>
        </SidebarHeader>
      </header>
      <main className="w-1/2 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;