import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface SidebarGroupComponentProps {
    label: string;
    items: { label: string; href: string, icon?: React.ReactNode, roles?: string[] }[];
    roles?: string[];
}

export default function SidebarGroupComponent({ label, items }: SidebarGroupComponentProps) {
    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>{label}</SidebarGroupLabel>
                <SidebarGroupAction>
                    <ChevronDown /> <span className="sr-only">Add Project</span>
                </SidebarGroupAction>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {items.map((item, index) => (
                            <SidebarMenuItem key={index}>
                                <SidebarMenuButton asChild>
                                    <Link to={item.href}>
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

        </>
    )
}