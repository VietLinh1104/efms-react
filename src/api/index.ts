// src/api/index.ts
import axiosInstance from "@/lib/axios";
import { apiConfig } from "./config";

import {
    AccountsApi,
    BankAccountsApi
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

