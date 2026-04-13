// src/App.tsx
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@components/layout/dashboard/DashboardLayout";
import HomePage from "@pages/dashboard/HomePage";
import AuthLayout from "./components/layout/dashboard/AuthLayout";
import AuthPage from "./pages/dashboard/AuthPage";
import { ThemeProvider } from "@components/provider/ThemeProvider";
import { ToastProvider } from "@components/provider/ToastProvider";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import PublicRoute from "@/components/common/PublicRoute";
import AccountListing from "@pages/dashboard/accounting/account/AccountListing";
import JournalEntryPage from "@pages/dashboard/accounting/journal/JournalEntryPage";
import JournalListing from "@pages/dashboard/accounting/journal/JournalListing";
import TrialBalanceListing from "@/pages/dashboard/accounting/trial-balance/TrialBalanceListing";
import PartnersListing from "@pages/dashboard/invoices/partners/PartnersListing.tsx";
import InvoicesListing from "@pages/dashboard/invoices/invoices-details/InvoicesListing.tsx";
import InvoiceFormPage from "@pages/dashboard/invoices/invoices-details/InvoiceFormPage.tsx";
import InvoiceDetailsPage from "@pages/dashboard/invoices/invoices-details/InvoiceDetailsPage.tsx";
import PaymentsListing from "@pages/dashboard/invoices/payments/PaymentsListing";
import PaymentFormPage from "@pages/dashboard/invoices/payments/PaymentFormPage";
import BankAccountsListing from "@pages/dashboard/finance/accounts/BankAccountsListing";
import TransactionsListing from "@pages/dashboard/finance/transactions/TransactionsListing";
import ReconciliationListing from "@pages/dashboard/finance/reconciliation/ReconciliationListing";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* ── Public routes (redirect to / if already logged in) ── */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<AuthLayout />}>
                <Route index element={<AuthPage />} />
              </Route>
            </Route>

            {/* ── Protected routes (require authentication) ── */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<DashboardLayout />}>
                <Route index element={<HomePage />} />

                <Route path="/accounting/accounts" element={<AccountListing />} />
                <Route path="/accounting/journals" element={<JournalListing />} />
                <Route path="/accounting/journal/new" element={<JournalEntryPage />} />
                <Route path="/accounting/trial-balance" element={<TrialBalanceListing />} />

                <Route path="/partners" element={<PartnersListing />} />
                <Route path="/invoices" element={<InvoicesListing />} />
                <Route path="/invoices/create" element={<InvoiceFormPage />} />
                <Route path="/invoices/:id" element={<InvoiceDetailsPage />} />
                <Route path="/payments" element={<PaymentsListing />} />
                <Route path="/payments/new" element={<PaymentFormPage />} />
                <Route path="/payments/:id/edit" element={<PaymentFormPage />} />

                <Route path="/finance/accounts" element={<BankAccountsListing />} />
                <Route path="/finance/transactions" element={<TransactionsListing />} />
                <Route path="/finance/reconciliation" element={<ReconciliationListing />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;