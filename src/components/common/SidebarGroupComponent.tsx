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

export interface SidebarGroupComponentProps {
    label: string;
    items: { label: string; href: string, icon?: React.ReactNode }[];
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
                                    <a href={item.href} target="_self" rel="noopener noreferrer">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

        </>
    )
}