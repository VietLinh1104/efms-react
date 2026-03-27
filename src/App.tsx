// src/App.tsx
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@components/layout/dashboard/DashboardLayout";
import HomePage from "@pages/dashboard/HomePage";
import AuthLayout from "./components/layout/dashboard/AuthLayout";
import AuthPage from "./pages/dashboard/AuthPage";
import { ThemeProvider } from "@components/provider/ThemeProvider";
import { ToastProvider } from "@components/provider/ToastProvider";
import AccountListing from "@pages/dashboard/accounting/account/AccountListing";
import JournalEntryPage from "@pages/dashboard/accounting/journal/JournalEntryPage";
import JournalListing from "@pages/dashboard/accounting/journal/JournalListing";
import TrialBalanceListing from "@/pages/dashboard/accounting/trial-balance/TrialBalanceListing";
import PartnersListing from "@pages/dashboard/invoices/partners/PartnersListing.tsx";
import InvoicesListing from "@pages/dashboard/invoices/invoices-details/InvoicesListing.tsx";
import InvoiceFormPage from "@pages/dashboard/invoices/invoices-details/InvoiceFormPage.tsx";
import PaymentsListing from "./pages/dashboard/invoices/payments/PaymentsListing";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ToastProvider>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />

            <Route path="/accounting/accounts" element={<AccountListing />} />
            <Route path="/accounting/journals" element={<JournalListing />} />
            <Route path="/accounting/journal/new" element={<JournalEntryPage />} />
            <Route path="/accounting/trial-balance" element={<TrialBalanceListing />} />

            <Route path="/partners" element={<PartnersListing />} />
            {/*<Route path="/partners/new" element={< />} />*/}
            <Route path="/invoices" element={<InvoicesListing />} />
            <Route path="/invoices/create" element={<InvoiceFormPage />} />
            <Route path="/payments" element={<PaymentsListing />} />
            {/*<Route path="/payments/new" element={< />} />*/}

            {/*<Route path="/finance/accounts" element={< />} />*/}
            {/*<Route path="/finance/accounts/new" element={< />} />*/}
            {/*<Route path="/finance/transactions" element={< />} />*/}
            {/*<Route path="/finance/reconciliation" element={< />} />*/}

            {/*<Route path="/reports/balance-sheet" element={< />} />*/}
            {/*<Route path="/reports/profit-loss" element={< />} />*/}
            {/*<Route path="/reports/cash-flow" element={< />} />*/}
            {/*<Route path="/reports/aging" element={< />} />*/}

            {/*<Route path="/settings/company" element={< />} />*/}
            {/*<Route path="/settings/users" element={< />} />*/}
            {/*<Route path="/settings/periods" element={< />} />*/}
          </Route>

          <Route path="/login" element={<AuthLayout />}>
            <Route index element={<AuthPage />} />
          </Route>
        </Routes>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;