import { Configuration as CoreConfiguration } from "@/api/generated/core/configuration";
import { Configuration as IdentityConfiguration } from "@/api/generated/identity/configuration";


export const apiConfigCore = new CoreConfiguration({
    basePath: import.meta.env.VITE_API_URL_CORE,
});

export const apiConfigIdentity = new IdentityConfiguration({
    basePath: import.meta.env.VITE_API_URL_IDENTITY,
});
