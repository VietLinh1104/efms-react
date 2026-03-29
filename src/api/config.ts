import { Configuration } from "@/api/generated/core/configuration";

export const apiConfig = new Configuration({
    basePath: import.meta.env.VITE_API_URL,
});
