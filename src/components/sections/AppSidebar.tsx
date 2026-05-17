import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader
} from "@/components/ui/sidebar"
import {
    Bot,
    Codepen,
    User,
    ListTree,
    BookText,
    Users,
    Receipt,
    CreditCard,
    Landmark,
    Building2,
    CalendarDays,
    LogOut
} from 'lucide-react';
import { useAuth } from "@/hooks/useAuth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SidebarGroupComponent from "@components/common/SidebarGroupComponent";
import type { SidebarGroupComponentProps } from "@components/common/SidebarGroupComponent";

export function AppSidebar() {
    const { user, logout } = useAuth();

    const sidebarGroups: SidebarGroupComponentProps[] = [
        {
            label: "Kế toán",
            items: [
                { label: "Hệ thống tài khoản", href: "/accounting/accounts", icon: <ListTree className="w-4 h-4" /> },
                { label: "Bút toán nhật ký", href: "/accounting/journals", icon: <BookText className="w-4 h-4" /> },
                // { label: "Bảng cân đối thử", href: "/accounting/trial-balance", icon: <Scale className="w-4 h-4" /> },
            ],
        },
        {
            label: "Chứng từ",
            items: [
                { label: "Đối tác", href: "/partners", icon: <Users className="w-4 h-4" /> },
                { label: "Hóa đơn & Chứng từ", href: "/invoices", icon: <Receipt className="w-4 h-4" /> },
                { label: "Thanh toán", href: "/payments", icon: <CreditCard className="w-4 h-4" /> },
            ],
        },
        {
            label: "Tiền mặt & Ngân hàng",
            items: [
                { label: "Tài khoản ngân hàng", href: "/finance/accounts", icon: <Landmark className="w-4 h-4" /> },
                // { label: "Lịch sử giao dịch", href: "/finance/transactions", icon: <History className="w-4 h-4" /> },
                // { label: "Đối soát", href: "/finance/reconciliation", icon: <ShieldCheck className="w-4 h-4" /> },
            ],
        },
        {
            label: "Cấu hình",
            items: [
                { label: "Cài đặt cá nhân", href: "/settings/user", icon: <User className="w-4 h-4" /> },
                { label: "Thông tin công ty", href: "/settings/company", icon: <Building2 className="w-4 h-4" /> },
                { label: "Kết nối AI (MCP)", href: "/settings/mcp", icon: <Bot className="w-4 h-4" /> },
                // { label: "Người dùng & Phân quyền", href: "/settings/users", icon: <UserRoundPlus className="w-4 h-4" /> },
                // { label: "Kỳ kế toán", href: "/settings/periods", icon: <CalendarDays className="w-4 h-4" /> },
            ],
        },
        {
            label: "Quản trị hệ thống",
            items: [
                { label: "Người dùng", href: "/admin/users", icon: <User className="w-4 h-4" /> },
                { label: "Vai trò & Quyền người dùng", href: "/admin/roles-permissions", icon: <User className="w-4 h-4" /> },
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
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 hover:bg-sidebar-accent rounded-sm cursor-pointer px-3 py-3 h-full w-full">
                            <div className="flex border justify-center items-center border-sidebar-border rounded-full w-7 h-7 overflow-hidden bg-sidebar-primary/10">
                                {user?.name ? (
                                    <span className="text-[10px] font-bold text-sidebar-primary">
                                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                                    </span>
                                ) : (
                                    <User className="w-4 h-4" />
                                )}
                            </div>
                            <div className="flex flex-col flex-1 text-left">
                                <h1 className="text-sm font-normal text-sidebar-foreground truncate">
                                    {user?.name || 'Guest'}
                                </h1>
                                <p className="text-[10px] text-muted-foreground leading-none truncate">
                                    {user?.role?.name || 'User'}
                                </p>
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="start" className="w-48">
                        <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Đăng xuất</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    )
}