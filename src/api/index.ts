// src/api/index.ts
import axiosInstance from "@/lib/axios";
import { apiConfigCommon, apiConfigCore, apiConfigIdentity } from "./config";

import {
    AccountsApi,
    BankAccountsApi,
    JournalEntriesApi,
    PartnersApi,
    InvoicesApi,
    PaymentsApi,
    InvoiceApprovalApi,
} from "@/api/generated/core/api";

export const coreInvoiceApprovalApi = new InvoiceApprovalApi(
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

export const coreBankAccountsApi = new BankAccountsApi(
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


import {
    CommentApi,
    AttachmentApi
} from "@/api/generated/common/api";

export const commonCommentApi = new CommentApi(
    apiConfigCommon,
    undefined,
    axiosInstance
);

export const commonAttachmentApi = new AttachmentApi(
    apiConfigCommon,
    undefined,
    axiosInstance
);