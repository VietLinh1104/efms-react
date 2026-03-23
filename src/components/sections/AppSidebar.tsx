import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader
} from "@/components/ui/sidebar"
import {
    Codepen,
    UserRoundPlus,
    User,
    ListTree,           // Thay cho LayoutChartScatter (Phù hợp với Chart of Accounts)
    BookText,
    Scale,
    Users,
    Receipt,
    CreditCard,
    Landmark,
    History,
    ShieldCheck,
    Building2,
    CalendarDays
} from 'lucide-react';
import SidebarGroupComponent from "@components/common/SidebarGroupComponent";
import type { SidebarGroupComponentProps } from "@components/common/SidebarGroupComponent";

export function AppSidebar() {

    const sidebarGroups: SidebarGroupComponentProps[] = [
        {
            label: "Kế toán (Accounting)",
            items: [
                { label: "Hệ thống tài khoản", href: "/accounting/accounts", icon: <ListTree className="w-4 h-4" /> },
                { label: "Bút toán nhật ký", href: "/accounting/journals", icon: <BookText className="w-4 h-4" /> },
                { label: "Bảng cân đối thử", href: "/accounting/trial-balance", icon: <Scale className="w-4 h-4" /> },
            ],
        },
        {
            label: "Chứng từ (Invoices)",
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
                { label: "Lịch sử giao dịch", href: "/finance/transactions", icon: <History className="w-4 h-4" /> },
                { label: "Đối soát", href: "/finance/reconciliation", icon: <ShieldCheck className="w-4 h-4" /> },
            ],
        },
        {
            label: "Cấu hình (Settings)",
            items: [
                { label: "Thông tin công ty", href: "/settings/company", icon: <Building2 className="w-4 h-4" /> },
                { label: "Người dùng & Phân quyền", href: "/settings/users", icon: <UserRoundPlus className="w-4 h-4" /> },
                { label: "Kỳ kế toán", href: "/settings/periods", icon: <CalendarDays className="w-4 h-4" /> },
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
                        <h1 className="text-sm font-normal text-sidebar-foreground">Viet Linh</h1>
                        <p className="text-[10px] text-muted-foreground leading-none">Quản trị viên</p>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}