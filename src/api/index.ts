// src/api/index.ts
import axiosInstance from "@/lib/axios";
import { apiConfigCore, apiConfigIdentity } from "./config";

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
    InvoiceApprovalControllerApi,
} from "@/api/generated/core/api";

export const coreInvoiceApprovalControllerApi = new InvoiceApprovalControllerApi(
    apiConfigCore,
    undefined,
    axiosInstance
);

export const coreAccountsApi = new AccountsApi(
    apiConfigCore,
    undefined,
    axiosInstance
);

export const corePaymentsApi = new PaymentsApi(
    apiConfigCore,
    undefined,
    axiosInstance
);

export const coreInvoicesApi = new InvoicesApi(
    apiConfigCore,
    undefined,
    axiosInstance
);

export const coreTrialBalanceApi = new TrialBalanceApi(
    apiConfigCore,
    undefined,
    axiosInstance
);
export const coreBankAccountsApi = new BankAccountsApi(
    apiConfigCore,
    undefined,
    axiosInstance
);

export const coreBankTransactionsApi = new BankTransactionsApi(
    apiConfigCore,
    undefined,
    axiosInstance
);

export const coreJournalEntriesApi = new JournalEntriesApi(
    apiConfigCore,
    undefined,
    axiosInstance
);

export const corePartnersApi = new PartnersApi(
    apiConfigCore,
    undefined,
    axiosInstance
);

export const coreFiscalPeriodsApi = new FiscalPeriodsApi(
    apiConfigCore,
    undefined,
    axiosInstance
);

export const coreBankReconciliationApi = new BankReconciliationApi(
    apiConfigCore,
    undefined,
    axiosInstance
);

export const coreReportsApi = new ReportsApi(
    apiConfigCore,
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
    apiConfigIdentity,
    undefined,
    axiosInstance
);

export const identityAuthControllerApi = new AuthControllerApi(
    apiConfigIdentity,
    undefined,
    axiosInstance
);

export const identityCompanyControllerApi = new CompanyControllerApi(
    apiConfigIdentity,
    undefined,
    axiosInstance
);

export const identityPermissionControllerApi = new PermissionControllerApi(
    apiConfigIdentity,
    undefined,
    axiosInstance
);

export const identityRoleControllerApi = new RoleControllerApi(
    apiConfigIdentity,
    undefined,
    axiosInstance
);

export const identityUserControllerApi = new UserControllerApi(
    apiConfigIdentity,
    undefined,
    axiosInstance
);
