// src/api/index.ts
import axiosInstance from "@/lib/axios";
import { apiConfig } from "./config";

import {
    AccountsApi,
    BankAccountsApi,
    JournalEntriesApi,
    PartnersApi,
    FiscalPeriodsApi
} from "@/api/generated/api";

export const accountsApi = new AccountsApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const bankAccountsApi = new BankAccountsApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const journalEntriesApi = new JournalEntriesApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const partnersApi = new PartnersApi(
    apiConfig,
    undefined,
    axiosInstance
);

export const fiscalPeriodsApi = new FiscalPeriodsApi(
    apiConfig,
    undefined,
    axiosInstance
);
