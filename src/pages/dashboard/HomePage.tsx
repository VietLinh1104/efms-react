// src/pages/dashboard/HomePage.tsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  TrendingUp,
  Receipt,
  CreditCard,
  Clock,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  PlusCircle,
  Pencil,
  Trash2,
  ShieldCheck,
  ShieldX,
  Ban,
  CircleDollarSign,
  Activity,
  Users,
  UserCheck,
  Shield,
  Building2,
  Settings,
  UserPlus,
  Key,
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
import { useAuth } from "@/hooks/useAuth";
import {
  coreDashboardApi,
  coreAuditLogsApi,
  identityUserControllerApi,
  identityRoleControllerApi,
} from "@/api";
import { useToastApp } from "@hooks/use-toast-app.ts";
import type {
  DashboardSummaryResponse,
  AuditLogResponse,
} from "@/api/generated/core/api";
import type {
  UserResponse,
  RoleResponse,
} from "@/api/generated/identity/api";
import { formatApiErrorForUser, logApiError } from "@/lib/api-error";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatCurrency = (val: number | undefined | null) => {
  if (val === undefined || val === null) return "0 VND";
  return val.toLocaleString("vi-VN") + " VND";
};

const formatDate = (dateStr: string | undefined | null) => {
  if (!dateStr) return "—";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
};

const StatusBadge = ({
  status,
  approvalStatus,
}: {
  status?: string;
  approvalStatus?: string;
}) => {
  const displayStatus = (approvalStatus || status || "").toLowerCase();
  switch (displayStatus) {
    case "confirmed":
    case "pending":
      return (
        <Badge variant="secondary" className="text-blue-400 bg-blue-500/10">
          Chờ duyệt
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="default" className="bg-green-600">
          Đã duyệt
        </Badge>
      );
    case "draft":
      return <Badge variant="outline">Nháp</Badge>;
    case "rejected":
      return <Badge variant="destructive">Từ chối</Badge>;
    default:
      return <Badge variant="outline">{displayStatus}</Badge>;
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-card p-3 shadow-md text-sm space-y-1">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}:{" "}
          <span>{(p.value * 1_000_000).toLocaleString("vi-VN")} VND</span>
        </p>
      ))}
    </div>
  );
};

// ── Audit helpers ──────────────────────────────────────────────────────────────

const TABLE_LABELS: Record<string, string> = {
  invoices: "Hóa đơn",
  payments: "Thanh toán",
  partners: "Đối tác",
  bank_accounts: "Tài khoản NH",
  journal_entries: "Bút toán",
  accounts: "Tài khoản KT",
};

type AuditCfg = {
  label: string;
  icon: React.ReactNode;
  dot: string;
  text: string;
};

const AUDIT_CFG: Record<string, AuditCfg> = {
  INSERT: {
    label: "Tạo mới",
    icon: <PlusCircle className="h-3.5 w-3.5" />,
    dot: "bg-blue-500",
    text: "text-blue-600",
  },
  UPDATE: {
    label: "Cập nhật",
    icon: <Pencil className="h-3.5 w-3.5" />,
    dot: "bg-amber-500",
    text: "text-amber-600",
  },
  DELETE: {
    label: "Xóa",
    icon: <Trash2 className="h-3.5 w-3.5" />,
    dot: "bg-red-500",
    text: "text-red-600",
  },
  CONFIRM: {
    label: "Xác nhận",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    dot: "bg-blue-500",
    text: "text-blue-600",
  },
  APPROVE: {
    label: "Phê duyệt",
    icon: <ShieldCheck className="h-3.5 w-3.5" />,
    dot: "bg-green-500",
    text: "text-green-600",
  },
  REJECT: {
    label: "Từ chối",
    icon: <ShieldX className="h-3.5 w-3.5" />,
    dot: "bg-red-500",
    text: "text-red-600",
  },
  CANCEL: {
    label: "Hủy",
    icon: <Ban className="h-3.5 w-3.5" />,
    dot: "bg-red-500",
    text: "text-red-600",
  },
  PAYMENT_ALLOCATE: {
    label: "Phân bổ TT",
    icon: <CircleDollarSign className="h-3.5 w-3.5" />,
    dot: "bg-purple-500",
    text: "text-purple-600",
  },
};

const getAuditCfg = (action?: string): AuditCfg =>
  AUDIT_CFG[action ?? ""] ?? {
    label: action ?? "---",
    icon: <Activity className="h-3.5 w-3.5" />,
    dot: "bg-slate-400",
    text: "text-slate-600",
  };

const fmtRelative = (v?: string | null): string => {
  if (!v) return "---";
  const diff = Date.now() - new Date(v).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  return `${days} ngày trước`;
};

const renderAuditLogSentence = (log: AuditLogResponse) => {
  const userName = log.changedBy ? (
    log.changedByName ? (
      <strong className="font-semibold text-foreground/90">
        {log.changedByName}
      </strong>
    ) : (
      <span className="font-mono text-muted-foreground">
        {String(log.changedBy).slice(0, 8)}…
      </span>
    )
  ) : (
    <strong className="font-semibold text-foreground/90">Hệ thống</strong>
  );

  const recordPart = log.recordId ? (
    <span className="font-mono text-muted-foreground/80 font-medium">
      #{String(log.recordId).slice(0, 8)}
    </span>
  ) : null;

  const tableLabel = log.tableName
    ? TABLE_LABELS[log.tableName] || log.tableName
    : "";

  let actionText = "đã thực hiện thao tác trên";
  switch (log.action) {
    case "INSERT":
      actionText = "tạo mới";
      break;
    case "UPDATE":
      actionText = "cập nhật";
      break;
    case "DELETE":
      actionText = "xóa";
      break;
    case "CONFIRM":
      actionText = "xác nhận";
      break;
    case "APPROVE":
      actionText = "phê duyệt";
      break;
    case "REJECT":
      actionText = "từ chối";
      break;
    case "CANCEL":
      actionText = "hủy";
      break;
    case "PAYMENT_POST":
    case "POST":
      actionText = "ghi sổ cái";
      break;
    case "PAYMENT_ALLOCATE":
      actionText = "phân bổ thanh toán cho";
      break;
  }

  return (
    <span className="text-sm text-muted-foreground">
      {userName} {actionText} {tableLabel.toLowerCase()} {recordPart}
    </span>
  );
};

// ── Role pie chart colors ─────────────────────────────────────────────────────

const ROLE_COLORS = [
  "#3b82f6",
  "#f97316",
  "#8b5cf6",
  "#10b981",
  "#f43f5e",
  "#06b6d4",
  "#eab308",
];

// ── AdminDashboard Component ──────────────────────────────────────────────────

const AdminDashboard: React.FC<{
  companyName?: string;
  currency?: string;
  onRefreshAudit: () => void;
  auditLogs: AuditLogResponse[];
  auditLoading: boolean;
}> = ({ companyName, currency, onRefreshAudit, auditLogs, auditLoading }) => {
  const navigate = useNavigate();
  const { error: toastError } = useToastApp();

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const fetchAdminData = useCallback(async () => {
    setUsersLoading(true);
    try {
      const [usersRes, rolesRes] = await Promise.all([
        identityUserControllerApi.getUsersByMyCompany() as any,
        identityRoleControllerApi.getAllRoles(),
      ]);
      const content =
        usersRes.data.data?.content || usersRes.data.data || [];
      setUsers(content);
      setRoles(rolesRes.data.data || []);
    } catch (err) {
      logApiError("Admin dashboard fetch failed", err);
      toastError(
        formatApiErrorForUser(err, "Không thể tải dữ liệu quản trị.")
      );
    } finally {
      setUsersLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const activeUsers = useMemo(
    () => users.filter((u) => u.isActive).length,
    [users]
  );

  // Build pie chart data: group users by role
  const roleDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    users.forEach((u) => {
      const roleName = u.role?.name || "Không có role";
      map[roleName] = (map[roleName] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [users]);

  // Recent users: last 8 by createdAt desc
  const recentUsers = useMemo(
    () =>
      [...users]
        .sort((a, b) =>
          (b.createdAt || "").localeCompare(a.createdAt || "")
        )
        .slice(0, 8),
    [users]
  );

  const kpiCards = [
    {
      label: "Tổng người dùng",
      value: usersLoading ? "..." : String(users.length),
      icon: <Users className="w-5 h-5 text-blue-400" />,
      bg: "bg-blue-500/10",
    },
    {
      label: "Đang hoạt động",
      value: usersLoading ? "..." : String(activeUsers),
      icon: <UserCheck className="w-5 h-5 text-green-400" />,
      bg: "bg-green-500/10",
    },
    {
      label: "Tổng số Role",
      value: usersLoading ? "..." : String(roles.length),
      icon: <Shield className="w-5 h-5 text-purple-400" />,
      bg: "bg-purple-500/10",
    },
    {
      label: "Công ty",
      value: companyName || "—",
      sub: currency,
      icon: <Building2 className="w-5 h-5 text-orange-400" />,
      bg: "bg-orange-500/10",
    },
  ];

  const quickActions = [
    {
      label: "Quản lý người dùng",
      description: "Thêm, sửa, phân quyền user",
      icon: <UserPlus className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-500/10",
      path: "/admin/users",
    },
    {
      label: "Roles & Permissions",
      description: "Cấu hình vai trò và quyền hạn",
      icon: <Key className="w-5 h-5 text-purple-500" />,
      bg: "bg-purple-500/10",
      path: "/admin/roles-permissions",
    },
    {
      label: "Cài đặt công ty",
      description: "Thông tin và cấu hình công ty",
      icon: <Settings className="w-5 h-5 text-orange-500" />,
      bg: "bg-orange-500/10",
      path: "/settings/company",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Tổng quan quản trị
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Thông tin hệ thống và người dùng trong công ty
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAdminData}
          disabled={usersLoading}
          className="gap-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${usersLoading ? "animate-spin" : ""}`} />
          Làm mới
        </Button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bg}`}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <p className="text-xl tabular-nums truncate" title={stat.value}>
                {stat.value}
              </p>
              {stat.sub && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {stat.sub}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Charts + Quick Actions Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pie Chart: user by role */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Phân bổ người dùng</CardTitle>
            <CardDescription>Số lượng user theo vai trò</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {usersLoading ? (
              <div className="flex items-center justify-center h-[240px] text-sm text-muted-foreground gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" /> Đang tải...
              </div>
            ) : roleDistribution.length === 0 ? (
              <div className="flex items-center justify-center h-[240px] text-sm text-muted-foreground">
                Chưa có người dùng nào
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {roleDistribution.map((_, index) => (
                      <Cell
                        key={index}
                        fill={ROLE_COLORS[index % ROLE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [`${val} người`, name]}
                  />
                  <Legend
                    iconSize={10}
                    formatter={(val) => (
                      <span className="text-xs text-muted-foreground">
                        {val}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Thao tác nhanh</CardTitle>
            <CardDescription>
              Các chức năng quản trị thường dùng
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {quickActions.map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left w-full"
              >
                <div className={`rounded-full p-2.5 ${action.bg} shrink-0`}>
                  {action.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto shrink-0" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Recent Users ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base">Người dùng gần đây</CardTitle>
            <CardDescription>
              Danh sách user được tạo/cập nhật gần nhất
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/users")}
            className="gap-1 text-muted-foreground"
          >
            Xem tất cả <ArrowRight className="w-3 h-3" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {usersLoading ? (
            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Đang tải...</span>
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-muted-foreground">
              Chưa có người dùng nào
            </div>
          ) : (
            recentUsers.map((user, i) => (
              <React.Fragment key={user.id}>
                {i > 0 && <Separator />}
                <div className="flex items-center justify-between px-6 py-3 hover:bg-muted/40 transition-colors">
                  {/* Avatar placeholder */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-primary">
                        {(user.name || user.email || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.name || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <Badge variant="outline" className="text-xs hidden sm:flex">
                      {user.role?.name || "No role"}
                    </Badge>
                    <Badge
                      variant={user.isActive ? "default" : "secondary"}
                      className={`text-xs ${user.isActive
                        ? "bg-green-600"
                        : "text-muted-foreground"
                        }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden md:block">
                      {formatDate(user.createdAt)}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            ))
          )}
        </CardContent>
      </Card>

      {/* ── Audit Log ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Hoạt động gần đây
            </CardTitle>
            <CardDescription>
              Các hành động của người dùng trong hệ thống
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefreshAudit}
            disabled={auditLoading}
            className="gap-1 text-muted-foreground"
          >
            <RefreshCw
              className={`w-3 h-3 ${auditLoading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {auditLoading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Đang tải...</span>
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Chưa có hoạt động nào
            </div>
          ) : (
            <ScrollArea className="h-[320px]">
              <ul className="px-6 py-4 space-y-4">
                {auditLogs.map((log, idx) => {
                  const cfg = getAuditCfg(log.action);
                  return (
                    <li
                      key={log.id ?? idx}
                      className="pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={cfg.text}>{cfg.icon}</span>
                          {renderAuditLogSentence(log)}
                        </div>
                        <time className="text-xs text-muted-foreground shrink-0">
                          {fmtRelative(log.changedAt)}
                        </time>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ── FinanceDashboard Component ────────────────────────────────────────────────

const FinanceDashboard: React.FC<{
  data: DashboardSummaryResponse | null;
  auditLogs: AuditLogResponse[];
  auditLoading: boolean;
  onRefresh: () => void;
  onRefreshAudit: () => void;
}> = ({ data, auditLogs, auditLoading, onRefresh, onRefreshAudit }) => {
  const navigate = useNavigate();

  const kpi = data?.kpi;
  const monthlyData = data?.monthlyFlow || [];
  const statusData = data?.invoiceStatusStats || [];
  const pendingInvoices = data?.pendingInvoices || [];
  const recentPayments = data?.recentPayments || [];

  const kpiCards = [
    {
      label: "Tổng Phải Thu (AR)",
      value: formatCurrency(kpi?.totalAr),
      icon: <TrendingUp className="w-5 h-5 text-blue-400" />,
      bg: "bg-blue-500/10",
    },
    {
      label: "Tổng Phải Trả (AP)",
      value: formatCurrency(kpi?.totalAp),
      icon: <Receipt className="w-5 h-5 text-orange-400" />,
      bg: "bg-orange-500/10",
    },
    {
      label: "Thanh toán tháng này",
      value: formatCurrency(kpi?.paymentsThisMonth),
      icon: <CreditCard className="w-5 h-5 text-purple-400" />,
      bg: "bg-purple-500/10",
    },
    {
      label: "Hóa đơn AP chờ duyệt",
      value:
        kpi?.pendingApprovalCount !== undefined
          ? String(kpi.pendingApprovalCount)
          : "0",
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Tổng quan hệ thống
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Dữ liệu thời gian thực được tổng hợp từ Core Service
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onRefresh();
            onRefreshAudit();
          }}
          className="gap-1"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới
        </Button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bg}`}>{stat.icon}</div>
            </CardHeader>
            <CardContent>
              <p className="text-xl tabular-nums">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Doanh thu & Chi phí</CardTitle>
            <CardDescription>Tổng hợp theo tháng (triệu VND)</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyData.length === 0 ? (
              <div className="flex items-center justify-center h-[240px] text-sm text-muted-foreground">
                Không có dữ liệu thu chi
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyData} barCategoryGap="30%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="revenue"
                    name="Doanh thu"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    name="Chi phí"
                    fill="#f97316"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Trạng thái Hóa đơn</CardTitle>
            <CardDescription>Phân bổ tổng số lượng hóa đơn</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {statusData.length === 0 ? (
              <div className="flex items-center justify-center h-[240px] text-sm text-muted-foreground">
                Không có hóa đơn nào
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.color || "#cbd5e1"}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val} hóa đơn`]} />
                  <Legend
                    iconSize={10}
                    formatter={(val) => (
                      <span className="text-xs text-muted-foreground">
                        {val}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending Invoices */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Hóa đơn chờ xử lý</CardTitle>
              <CardDescription>
                Các hóa đơn cần phê duyệt hoặc xử lý
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/invoices")}
              className="gap-1 text-muted-foreground"
            >
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {pendingInvoices.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                Không có hóa đơn nào cần xử lý
              </div>
            ) : (
              pendingInvoices.map((inv, i) => (
                <React.Fragment key={inv.id}>
                  {i > 0 && <Separator />}
                  <div
                    className="flex items-center justify-between px-6 py-3 hover:bg-muted/40 cursor-pointer transition-colors"
                    onClick={() => navigate(`/invoices/${inv.id}`)}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium">
                        {inv.partnerName}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {inv.invoiceNumber || inv.id?.slice(0, 8)} ·{" "}
                        {formatDate(inv.invoiceDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          inv.invoiceType === "AP" ? "outline" : "secondary"
                        }
                        className="text-xs"
                      >
                        {inv.invoiceType}
                      </Badge>
                      <span className="text-sm tabular-nums">
                        {formatCurrency(inv.totalAmount)}
                      </span>
                      <StatusBadge
                        status={inv.status}
                        approvalStatus={inv.approvalStatus}
                      />
                    </div>
                  </div>
                </React.Fragment>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Thanh toán gần đây</CardTitle>
              <CardDescription>
                Các giao dịch thanh toán mới nhất
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/payments")}
              className="gap-1 text-muted-foreground"
            >
              Xem tất cả <ArrowRight className="w-3 h-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPayments.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Không có giao dịch thanh toán nào gần đây
              </div>
            ) : (
              recentPayments.map((pay) => (
                <div key={pay.id} className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 rounded-full p-1.5 ${pay.posted ? "bg-green-500/10" : "bg-amber-500/10"
                      }`}
                  >
                    {pay.posted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {pay.partnerName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {pay.id?.slice(0, 8)} · {formatDate(pay.paymentDate)}
                    </p>
                  </div>
                  <div className="text-sm tabular-nums text-right shrink-0">
                    {formatCurrency(pay.amount)}
                  </div>
                </div>
              ))
            )}

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

      {/* ── Recent Activity (Audit Log) ── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Hoạt động gần đây
            </CardTitle>
            <CardDescription>
              Các hành động của người dùng trong hệ thống
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefreshAudit}
            disabled={auditLoading}
            className="gap-1 text-muted-foreground"
          >
            <RefreshCw
              className={`w-3 h-3 ${auditLoading ? "animate-spin" : ""}`}
            />
            Làm mới
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {auditLoading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Đang tải...</span>
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Chưa có hoạt động nào
            </div>
          ) : (
            <ScrollArea className="h-[320px]">
              <ul className="px-6 py-4 space-y-4">
                {auditLogs.map((log, idx) => {
                  const cfg = getAuditCfg(log.action);
                  return (
                    <li
                      key={log.id ?? idx}
                      className="pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className={cfg.text}>{cfg.icon}</span>
                          {renderAuditLogSentence(log)}
                        </div>
                        <time className="text-xs text-muted-foreground shrink-0">
                          {fmtRelative(log.changedAt)}
                        </time>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ── HomePage (root component) ─────────────────────────────────────────────────

const HomePage: React.FC = () => {
  const { error: toastError } = useToastApp();
  const { companyId, user, isLoading: authLoading } = useAuth();

  // Detect admin by role name
  const isAdmin = useMemo(
    () =>
      !!user?.role?.name?.toLowerCase().includes("admin"),
    [user]
  );

  // ── Finance data (only loaded for non-admin) ──
  const [financeData, setFinanceData] =
    useState<DashboardSummaryResponse | null>(null);
  const [financeLoading, setFinanceLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── Audit log (shared) ──
  const [auditLogs, setAuditLogs] = useState<AuditLogResponse[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const fetchFinanceData = useCallback(async () => {
    if (!companyId) return;
    setFinanceLoading(true);
    setErrorMsg(null);
    try {
      const response = await coreDashboardApi.getDashboardSummary({
        companyId,
      });
      if (response.data && response.data.data) {
        setFinanceData(response.data.data);
      } else {
        setErrorMsg("Không thể phân tích dữ liệu tổng hợp.");
      }
    } catch (err) {
      const errMsg = formatApiErrorForUser(err, "Lỗi kết nối tới máy chủ.");
      setErrorMsg(errMsg);
      toastError(errMsg);
    } finally {
      setFinanceLoading(false);
    }
  }, [companyId, toastError]);

  const fetchAuditLogs = useCallback(async () => {
    setAuditLoading(true);
    try {
      const res = await coreAuditLogsApi.listAuditLogs({
        xCompanyId: companyId ?? undefined,
        page: 0,
        size: 15,
      });
      setAuditLogs(res.data.data?.content ?? []);
    } catch (err) {
      logApiError("Fetch dashboard audit logs failed", err);
    } finally {
      setAuditLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin && companyId) {
      fetchFinanceData();
    } else if (isAdmin) {
      setFinanceLoading(false);
    } else {
      setFinanceLoading(false);
    }
  }, [authLoading, isAdmin, companyId, fetchFinanceData]);

  useEffect(() => {
    if (!authLoading) {
      fetchAuditLogs();
    }
  }, [authLoading, fetchAuditLogs]);

  // ── Loading state ──
  if (authLoading || (!isAdmin && financeLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          Đang tải dữ liệu tổng quan...
        </p>
      </div>
    );
  }

  // ── No company selected (non-admin) ──
  if (!isAdmin && !companyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
        <AlertCircle className="w-8 h-8 text-amber-500" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Chưa chọn công ty
          </h3>
          <p className="text-muted-foreground text-sm mt-1">
            Vui lòng chọn hoặc thiết lập công ty để xem dữ liệu báo cáo tổng
            quan.
          </p>
        </div>
      </div>
    );
  }

  // ── Finance error ──
  if (!isAdmin && errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 max-w-md mx-auto text-center">
        <div className="rounded-full bg-red-500/10 p-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Không thể tải dữ liệu
          </h3>
          <p className="text-muted-foreground text-sm mt-1">{errorMsg}</p>
        </div>
        <Button onClick={fetchFinanceData} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Tải lại
        </Button>
      </div>
    );
  }

  // ── Render by role ──
  if (isAdmin) {
    return (
      <AdminDashboard
        companyName={user?.company?.name}
        currency={user?.company?.currency ?? undefined}
        onRefreshAudit={fetchAuditLogs}
        auditLogs={auditLogs}
        auditLoading={auditLoading}
      />
    );
  }

  return (
    <FinanceDashboard
      data={financeData}
      auditLogs={auditLogs}
      auditLoading={auditLoading}
      onRefresh={fetchFinanceData}
      onRefreshAudit={fetchAuditLogs}
    />
  );
};

export default HomePage;
