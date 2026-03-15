import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader
} from "@/components/ui/sidebar"
import { Codepen, Database, FileText, Settings, UserRoundPlus, User } from 'lucide-react';
import SidebarGroupComponent from "@components/common/SidebarGroupComponent";
import type { SidebarGroupComponentProps } from "@components/common/SidebarGroupComponent";

export function AppSidebar() {

    const sidebarGroups: SidebarGroupComponentProps[] = [
        {
            label: "Application",
            items: [
                { label: "Project 1", href: "/project/1", icon: <Database /> },
                { label: "Project 2", href: "/project/2", icon: <FileText /> },
            ],
        },
        {
            label: "Settings",
            items: [
                { label: "Project 1", href: "/project/1", icon: <Settings /> },
                { label: "Project 2", href: "/project/2", icon: <UserRoundPlus /> },
            ],
        },
    ];

    return (
        <Sidebar>
            <SidebarHeader className="border-b bg-none h-12 flex items-center justify-center p-2"  >
                <div className="flex items-center gap-2 hover:bg-sidebar-accent rounded-sm cursor-pointer px-3 py-3 h-full w-full">
                    <Codepen className="w-5 h-5" />
                    <h1 className="text-sm font-semibold">Dashboard</h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                {sidebarGroups.map((group, index) => (
                    <SidebarGroupComponent key={index} label={group.label} items={group.items} />
                ))}
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center gap-2 hover:bg-sidebar-accent rounded-sm cursor-pointer px-3 py-3 h-full w-full">
                    <div className="flex border justify-center items-center border-sidebar-border rounded-full w-7 h-7">
                        <User className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-sm font-normal">Viet Linh</h1>
                        <p className="text-xs text-muted-foreground">Admin</p>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}