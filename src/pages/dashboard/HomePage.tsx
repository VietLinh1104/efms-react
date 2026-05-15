// src/pages/dashboard/HomePage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Receipt,
  CreditCard,
  Landmark,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ── Fake Data ─────────────────────────────────────────────────────────────────

const STATS = [
  {
    label: "Tổng Phải Thu (AR)",
    value: "842.500.000 ₫",
    change: "+12.4%",
    up: true,
    icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "Tổng Phải Trả (AP)",
    value: "531.200.000 ₫",
    change: "-3.1%",
    up: false,
    icon: <Receipt className="w-5 h-5 text-orange-400" />,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    label: "Số dư Tiền mặt",
    value: "1.240.000.000 ₫",
    change: "+5.8%",
    up: true,
    icon: <Landmark className="w-5 h-5 text-green-400" />,
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    label: "Thanh toán tháng này",
    value: "318.750.000 ₫",
    change: "+21.3%",
    up: true,
    icon: <CreditCard className="w-5 h-5 text-purple-400" />,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

const MONTHLY_DATA = [
  { month: "Th01", revenue: 320, expense: 210 },
  { month: "Th02", revenue: 415, expense: 280 },
  { month: "Th03", revenue: 510, expense: 320 },
  { month: "Th04", revenue: 380, expense: 250 },
  { month: "Th05", revenue: 620, expense: 410 },
  { month: "Th06", revenue: 540, expense: 360 },
];

const INVOICE_STATUS_DATA = [
  { name: "Đã duyệt", value: 42, color: "#22c55e" },
  { name: "Chờ duyệt", value: 18, color: "#f59e0b" },
  { name: "Từ chối", value: 7, color: "#ef4444" },
  { name: "Nháp", value: 11, color: "#64748b" },
];

const PENDING_INVOICES = [
  {
    id: "INV-2026-0089",
    partner: "Công ty TNHH Minh Phát",
    type: "AP",
    amount: "112.000.000 ₫",
    date: "06/05/2026",
    status: "confirmed",
  },
  {
    id: "INV-2026-0092",
    partner: "Tổng công ty Vật liệu Xây dựng",
    type: "AP",
    amount: "543.254.325 ₫",
    date: "06/05/2026",
    status: "confirmed",
  },
  {
    id: "INV-2026-0095",
    partner: "Siêu thị điện máy Nguyễn Kim",
    type: "AR",
    amount: "212.800.000 ₫",
    date: "06/05/2026",
    status: "draft",
  },
  {
    id: "INV-2026-0101",
    partner: "Công ty Cổ phần Phần mềm FAST",
    type: "AP",
    amount: "110.000.000 ₫",
    date: "08/05/2026",
    status: "confirmed",
  },
  {
    id: "INV-2026-0103",
    partner: "Tập đoàn Bưu chính Viễn thông",
    type: "AR",
    amount: "100.000.000 ₫",
    date: "07/05/2026",
    status: "draft",
  },
];

const RECENT_PAYMENTS = [
  { id: "PAY-0041", partner: "Minh Phát", amount: "112.000.000 ₫", date: "10/05/2026", posted: true },
  { id: "PAY-0042", partner: "Fast Software", amount: "110.000.000 ₫", date: "10/05/2026", posted: true },
  { id: "PAY-0043", partner: "Nguyễn Kim", amount: "50.000.000 ₫", date: "09/05/2026", posted: false },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "confirmed": return <Badge variant="secondary" className="text-blue-400 bg-blue-500/10">Chờ duyệt</Badge>;
    case "approved":  return <Badge variant="default" className="bg-green-600">Đã duyệt</Badge>;
    case "draft":     return <Badge variant="outline">Nháp</Badge>;
    case "rejected":  return <Badge variant="destructive">Từ chối</Badge>;
    default:          return <Badge variant="outline">{status}</Badge>;
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card p-3 shadow-md text-sm space-y-1">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{(p.value * 1_000_000).toLocaleString("vi-VN")} ₫</strong>
        </p>
      ))}
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tổng quan hệ thống</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Tháng 05/2026 — Cập nhật lần cuối: 15/05/2026, 16:30
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bg}`}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold tabular-nums">{stat.value}</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${stat.up ? "text-green-500" : "text-red-400"}`}>
                {stat.up
                  ? <ArrowUpRight className="w-3 h-3" />
                  : <ArrowDownRight className="w-3 h-3" />}
                {stat.change} so với tháng trước
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Bar Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Doanh thu & Chi phí</CardTitle>
            <CardDescription>Tổng hợp theo tháng (triệu VND)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={MONTHLY_DATA} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Doanh thu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Chi phí" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trạng thái Hóa đơn</CardTitle>
            <CardDescription>Tổng số: 78 hóa đơn</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={INVOICE_STATUS_DATA}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {INVOICE_STATUS_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val} hóa đơn`]} />
                <Legend
                  iconSize={10}
                  formatter={(val) => <span className="text-xs text-muted-foreground">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Pending Invoices */}
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Hóa đơn chờ xử lý</CardTitle>
              <CardDescription>Các hóa đơn cần phê duyệt hoặc xử lý</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/invoices")} className="gap-1 text-muted-foreground">
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {PENDING_INVOICES.map((inv, i) => (
              <React.Fragment key={inv.id}>
                {i > 0 && <Separator />}
                <div
                  className="flex items-center justify-between px-6 py-3 hover:bg-muted/40 cursor-pointer transition-colors"
                  onClick={() => navigate(`/invoices/${inv.id}`)}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{inv.partner}</span>
                    <span className="text-xs text-muted-foreground font-mono">{inv.id} · {inv.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={inv.type === "AP" ? "outline" : "secondary"} className="text-xs">
                      {inv.type}
                    </Badge>
                    <span className="text-sm font-semibold tabular-nums">{inv.amount}</span>
                    <StatusBadge status={inv.status} />
                  </div>
                </div>
              </React.Fragment>
            ))}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Thanh toán gần đây</CardTitle>
              <CardDescription>3 giao dịch mới nhất</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/payments")} className="gap-1 text-muted-foreground">
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {RECENT_PAYMENTS.map((pay) => (
              <div key={pay.id} className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-full p-1.5 ${pay.posted ? "bg-green-500/10" : "bg-amber-500/10"}`}>
                  {pay.posted
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    : <Clock className="w-3.5 h-3.5 text-amber-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{pay.partner}</p>
                  <p className="text-xs text-muted-foreground">{pay.id} · {pay.date}</p>
                </div>
                <div className="text-sm font-semibold tabular-nums text-right shrink-0">
                  {pay.amount}
                </div>
              </div>
            ))}

            <Separator />

            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={() => navigate("/payments/new")}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Tạo thanh toán mới
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;