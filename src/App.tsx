// src/App.tsx
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@components/layout/dashboard/DashboardLayout";
import HomePage from "@pages/dashboard/HomePage";
import AuthLayout from "./components/layout/dashboard/AuthLayout";
import AuthPage from "./pages/auth/AuthPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ActivatePage from "./pages/auth/ActivatePage";
import { ThemeProvider } from "@components/provider/ThemeProvider";
import { ToastProvider } from "@components/provider/ToastProvider";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import PublicRoute from "@/components/common/PublicRoute";

// Accounting
import AccountListing from "@pages/dashboard/accounting/account/AccountListing";
import JournalListing from "@pages/dashboard/accounting/journal/JournalListing";

// Invoices
import PartnersListing from "@pages/dashboard/invoices/partners/PartnersListing.tsx";
import InvoicesListing from "@pages/dashboard/invoices/invoices-details/InvoicesListing.tsx";
import InvoiceFormPage from "@pages/dashboard/invoices/invoices-details/InvoiceFormPage.tsx";
import PaymentsListing from "@pages/dashboard/invoices/payments/PaymentsListing";
import PaymentFormPage from "@pages/dashboard/invoices/payments/PaymentFormPage";

// Finance
import BankAccountsListing from "@pages/dashboard/finance/accounts/BankAccountsListing";

// Settings
import UserSettingsPage from "@pages/dashboard/settings/user/UserSettingsPage";
import CompanySettingsPage from "@pages/dashboard/settings/company/CompanySettingsPage";
import McpSettingsPage from "@pages/dashboard/settings/mcp/McpSettingsPage";

// Admin
import UserManagementPage from "@pages/admin/users/UserManagementPage";
import RolesPermissionsPage from "@pages/admin/roles-permissions/RolesPermissionsPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* ── Public routes ── */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<AuthLayout />}>
                <Route index element={<AuthPage />} />
              </Route>
              <Route path="/register" element={<AuthLayout />}>
                <Route index element={<RegisterPage />} />
              </Route>
              <Route path="/auth/activate" element={<AuthLayout />}>
                <Route index element={<ActivatePage />} />
              </Route>
            </Route>

            {/* ── Protected routes ── */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<HomePage />} />

                {/* Kế toán */}
                <Route path="/accounting/accounts" element={<AccountListing />} />
                <Route path="/accounting/journals" element={<JournalListing />} />

                {/* Chứng từ */}
                <Route path="/partners" element={<PartnersListing />} />
                <Route path="/invoices" element={<InvoicesListing />} />
                <Route path="/invoices/create" element={<InvoiceFormPage />} />
                <Route path="/invoices/:id" element={<InvoiceFormPage />} />
                <Route path="/invoices/:id/edit" element={<InvoiceFormPage />} />
                <Route path="/payments" element={<PaymentsListing />} />
                <Route path="/payments/new" element={<PaymentFormPage />} />
                <Route path="/payments/:id/edit" element={<PaymentFormPage />} />

                {/* Tiền mặt & Ngân hàng */}
                <Route path="/finance/accounts" element={<BankAccountsListing />} />

                {/* Cấu hình */}
                <Route path="/settings/user" element={<UserSettingsPage />} />
                <Route path="/settings/company" element={<CompanySettingsPage />} />
                <Route path="/settings/mcp" element={<McpSettingsPage />} />

                {/* Quản trị hệ thống */}
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/roles-permissions" element={<RolesPermissionsPage />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;