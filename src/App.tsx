// src/App.tsx
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "@components/layout/dashboard/DashboardLayout";
import HomePage from "@pages/dashboard/HomePage";
import AuthLayout from "./components/layout/dashboard/AuthLayout";
import AuthPage from "./pages/dashboard/AuthPage";
import { ThemeProvider } from "@components/provider/ThemeProvider";
import { ToastProvider } from "@components/provider/ToastProvider";
import DataTablePage from "@pages/dashboard/data-table/DataTablePage";
import AccountListing from "@/pages/dashboard/account/AccountListing";
import JournalEntryPage from "@/pages/dashboard/journal/JournalEntryPage";
import JournalListing from "@/pages/dashboard/journal/JournalListing";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ToastProvider>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<HomePage />} />
            <Route path="data-table" element={<DataTablePage />} />
            <Route path="/accounting/accounts" element={<AccountListing />} />
            <Route path="/accounting/journals" element={<JournalListing />} />
            <Route path="/accounting/journal/new" element={<JournalEntryPage />} />
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