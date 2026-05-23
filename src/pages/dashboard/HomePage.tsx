// src/pages/dashboard/HomePage.tsx
import React, { useEffect, useState, useCallback } from "react";
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
import { coreDashboardApi, coreAuditLogsApi } from "@/api";
import { useToastApp } from "@hooks/use-toast-app.ts";
import type { DashboardSummaryResponse, AuditLogResponse } from "@/api/generated/core/api";

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatCurrency = (val: number | undefined | null) => {
  if (val === undefined || val === null) return "0 ₫";
  return val.toLocaleString("vi-VN") + " ₫";
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
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
};

const StatusBadge = ({ status, approvalStatus }: { status?: string; approvalStatus?: string }) => {
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
          {p.name}: <strong>{(p.value * 1_000_000).toLocaleString("vi-VN")} ₫</strong>
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

type AuditCfg = { label: string; icon: React.ReactNode; dot: string; text: string };

const AUDIT_CFG: Record<string, AuditCfg> = {
  INSERT: { label: "Tạo mới", icon: <PlusCircle className="h-3.5 w-3.5" />, dot: "bg-blue-500", text: "text-blue-600" },
  UPDATE: { label: "Cập nhật", icon: <Pencil className="h-3.5 w-3.5" />, dot: "bg-amber-500", text: "text-amber-600" },
  DELETE: { label: "Xóa", icon: <Trash2 className="h-3.5 w-3.5" />, dot: "bg-red-500", text: "text-red-600" },
  CONFIRM: { label: "Xác nhận", icon: <CheckCircle2 className="h-3.5 w-3.5" />, dot: "bg-blue-500", text: "text-blue-600" },
  APPROVE: { label: "Phê duyệt", icon: <ShieldCheck className="h-3.5 w-3.5" />, dot: "bg-green-500", text: "text-green-600" },
  REJECT: { label: "Từ chối", icon: <ShieldX className="h-3.5 w-3.5" />, dot: "bg-red-500", text: "text-red-600" },
  CANCEL: { label: "Hủy", icon: <Ban className="h-3.5 w-3.5" />, dot: "bg-red-500", text: "text-red-600" },
  PAYMENT_ALLOCATE: { label: "Phân bổ TT", icon: <CircleDollarSign className="h-3.5 w-3.5" />, dot: "bg-purple-500", text: "text-purple-600" },
};

const getAuditCfg = (action?: string): AuditCfg =>
  AUDIT_CFG[action ?? ""] ?? { label: action ?? "---", icon: <Activity className="h-3.5 w-3.5" />, dot: "bg-slate-400", text: "text-slate-600" };

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
      <strong className="font-semibold text-foreground/90">{log.changedByName}</strong>
    ) : (
      <span className="font-mono text-muted-foreground">{String(log.changedBy).slice(0, 8)}…</span>
    )
  ) : (
    <strong className="font-semibold text-foreground/90">Hệ thống</strong>
  );

  const recordPart = log.recordId ? (
    <span className="font-mono text-muted-foreground/80 font-medium">#{String(log.recordId).slice(0, 8)}</span>
  ) : null;

  const tableLabel = log.tableName ? (
    TABLE_LABELS[log.tableName] || log.tableName
  ) : "";

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

// ── Component ─────────────────────────────────────────────────────────────────

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { error: toastError } = useToastApp();
  const { companyId, isLoading: authLoading } = useAuth();

  const [data, setData] = useState<DashboardSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [auditLogs, setAuditLogs] = useState<AuditLogResponse[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const response = await coreDashboardApi.getDashboardSummary({ companyId });
      if (response.data && response.data.data) {
        setData(response.data.data);
      } else {
        setErrorMsg("Không thể phân tích dữ liệu tổng hợp.");
      }
    } catch (err: any) {
      console.error("Lỗi khi tải dữ liệu dashboard:", err);
      const errMsg = err.response?.data?.message || err.message || "Lỗi kết nối tới máy chủ.";
      setErrorMsg(errMsg);
      toastError(errMsg);
    } finally {
      setLoading(false);
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
      console.error("Lỗi khi tải audit logs:", err);
    } finally {
      setAuditLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (!authLoading) {
      if (companyId) {
        fetchData();
      } else {
        setLoading(false);
      }
    }
  }, [authLoading, companyId, fetchData]);

  useEffect(() => {
    if (!authLoading) {
      fetchAuditLogs();
    }
  }, [authLoading, fetchAuditLogs]);

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          Đang tải dữ liệu tổng quan...
        </p>
      </div>
    );
  }

  if (!companyId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
        <AlertCircle className="w-8 h-8 text-amber-500" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">Chưa chọn công ty</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Vui lòng chọn hoặc thiết lập công ty để xem dữ liệu báo cáo tổng quan.
          </p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 max-w-md mx-auto text-center">
        <div className="rounded-full bg-red-500/10 p-3">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Không thể tải dữ liệu</h3>
          <p className="text-muted-foreground text-sm mt-1">{errorMsg}</p>
        </div>
        <Button onClick={fetchData} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Tải lại
        </Button>
      </div>
    );
  }

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
      value: kpi?.pendingApprovalCount !== undefined ? String(kpi.pendingApprovalCount) : "0",
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tổng quan hệ thống</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Dữ liệu thời gian thực được tổng hợp từ Core Service
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => { fetchData(); fetchAuditLogs(); }} className="gap-1">
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
              <p className="text-xl font-bold tabular-nums">{stat.value}</p>
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
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Doanh thu" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" name="Chi phí" fill="#f97316" radius={[4, 4, 0, 0]} />
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
                      <Cell key={index} fill={entry.color || "#cbd5e1"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val} hóa đơn`]} />
                  <Legend
                    iconSize={10}
                    formatter={(val) => <span className="text-xs text-muted-foreground">{val}</span>}
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
              <CardDescription>Các hóa đơn cần phê duyệt hoặc xử lý</CardDescription>
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
                      <span className="text-sm font-medium">{inv.partnerName}</span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {inv.invoiceNumber || inv.id?.slice(0, 8)} · {formatDate(inv.invoiceDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={inv.invoiceType === "AP" ? "outline" : "secondary"}
                        className="text-xs"
                      >
                        {inv.invoiceType}
                      </Badge>
                      <span className="text-sm font-semibold tabular-nums">
                        {formatCurrency(inv.totalAmount)}
                      </span>
                      <StatusBadge status={inv.status} approvalStatus={inv.approvalStatus} />
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
              <CardDescription>Các giao dịch thanh toán mới nhất</CardDescription>
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
                    <p className="text-sm font-medium truncate">{pay.partnerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {pay.id?.slice(0, 8)} · {formatDate(pay.paymentDate)}
                    </p>
                  </div>
                  <div className="text-sm font-semibold tabular-nums text-right shrink-0">
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
            <CardDescription>Các hành động của người dùng trong hệ thống</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchAuditLogs}
            disabled={auditLoading}
            className="gap-1 text-muted-foreground"
          >
            <RefreshCw className={`w-3 h-3 ${auditLoading ? "animate-spin" : ""}`} />
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
                    <li key={log.id ?? idx} className="pb-4 border-b border-border last:border-0 last:pb-0">
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

export default HomePage;