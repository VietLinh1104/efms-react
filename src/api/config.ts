import { Configuration } from "@/api/generated/configuration";

export const apiConfig = new Configuration({
    basePath: import.meta.env.VITE_API_URL,
});
