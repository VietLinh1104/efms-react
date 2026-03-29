// src/api/index.ts
import axiosInstance from "@/lib/axios";
import { apiConfig } from "./config";

import {
    AccountsApi,
    BankAccountsApi,
    BankTransactionsApi,
    JournalEntriesApi,
    PartnersApi,
    FiscalPeriodsApi,
    TrialBalanceApi,
    InvoicesApi,
    PaymentsApi,
    BankReconciliationApi,
    ReportsApi,
} from "@/api/generated/core/api";

export const coreAccountsApi = new AccountsApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const corePaymentsApi = new PaymentsApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const coreInvoicesApi = new InvoicesApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const coreTrialBalanceApi = new TrialBalanceApi(
    apiConfig,
    undefined,
    axiosInstance
);
export const coreBankAccountsApi = new BankAccountsApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const coreBankTransactionsApi = new BankTransactionsApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const coreJournalEntriesApi = new JournalEntriesApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const corePartnersApi = new PartnersApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const coreFiscalPeriodsApi = new FiscalPeriodsApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const coreBankReconciliationApi = new BankReconciliationApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const coreReportsApi = new ReportsApi(
    apiConfig,
    undefined,
    axiosInstance
);

import {
    AuditLogControllerApi,
    AuthControllerApi,
    CompanyControllerApi,
    PermissionControllerApi,
    RoleControllerApi,
    UserControllerApi,
} from "@/api/generated/identity/api";

export const identityAuditLogControllerApi = new AuditLogControllerApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const identityAuthControllerApi = new AuthControllerApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const identityCompanyControllerApi = new CompanyControllerApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const identityPermissionControllerApi = new PermissionControllerApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const identityRoleControllerApi = new RoleControllerApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const identityUserControllerApi = new UserControllerApi(
    apiConfig,
    undefined,
    axiosInstance
);
