// src/layouts/DashboardLayout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import React from "react";
import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/sections/AppSidebar";
import { NavbarApp } from "@/components/sections/NavbarApp";

// Khai báo Interface để code sạch và dễ mở rộng
interface DashboardLayoutProps {
  title?: string; // Dấu ? nghĩa là không bắt buộc
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ title }) => {
  return (
    <div className="layout">
      {/* sidebar */}
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full flex flex-col">
          <NavbarApp>
            <SidebarTrigger />
            <h1 className="text-sm font-semibold">{title}</h1>
          </NavbarApp>
          <main className="w-full p-10">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;