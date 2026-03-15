import { createContext, useContext } from "react"
import type { AlertAppProps } from "@/components/common/AlertApp"

export interface Toast extends AlertAppProps {
    id: string;
    duration?: number;
    isExiting?: boolean;
}

export type ToastOptions = Omit<Toast, "id" | "type" | "variant"> & {
    title?: string;
    variant?: "default" | "destructive";
};

export type ToastProviderState = {
    toasts: Toast[]
    toast: (toast: Omit<Toast, "id">) => void
    success: (description: string, options?: ToastOptions) => void
    error: (description: string, options?: ToastOptions) => void
    info: (description: string, options?: ToastOptions) => void
    warning: (description: string, options?: ToastOptions) => void
    dismiss: (id: string) => void
}

const initialState: ToastProviderState = {
    toasts: [],
    toast: () => null,
    success: () => null,
    error: () => null,
    info: () => null,
    warning: () => null,
    dismiss: () => null,
}

export const ToastContext = createContext<ToastProviderState>(initialState)

export const useToastApp = () => {
    const context = useContext(ToastContext)

    if (context === undefined)
        throw new Error("useToastApp must be used within a ToastProvider")

    return context
}
