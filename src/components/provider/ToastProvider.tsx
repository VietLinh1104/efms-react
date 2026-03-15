import { useState, useCallback } from "react"
import type { Toast } from "@/hooks/use-toast-app"
import { ToastContext } from "@/hooks/use-toast-app"
import { AlertApp } from "@/components/common/AlertApp"

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.map((t) => t.id === id ? { ...t, isExiting: true } : t))
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id))
        }, 300) // Match animation duration
    }, [])

    const toast = useCallback(({ duration = 5000, ...rest }: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast = { id, duration, ...rest, isExiting: false }
        setToasts((prev) => [...prev, newToast])

        if (duration !== Infinity) {
            setTimeout(() => {
                dismiss(id)
            }, duration)
        }
    }, [dismiss])

    const success = useCallback((description: string, options?: any) => {
        toast({
            title: options?.title || "Success",
            description,
            variant: "default",
            type: "success",
            ...options
        })
    }, [toast])

    const error = useCallback((description: string, options?: any) => {
        toast({
            title: options?.title || "Error",
            description,
            variant: "destructive",
            type: "error",
            ...options
        })
    }, [toast])

    const info = useCallback((description: string, options?: any) => {
        toast({
            title: options?.title || "Info",
            description,
            variant: "default",
            type: "info",
            ...options
        })
    }, [toast])

    const warning = useCallback((description: string, options?: any) => {
        toast({
            title: options?.title || "Warning",
            description,
            variant: "default",
            type: "warning",
            ...options
        })
    }, [toast])

    return (
        <ToastContext.Provider value={{ toasts, toast, success, error, info, warning, dismiss }}>
            {children}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col-reverse w-full max-w-sm pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out
                            ${(t as any).isExiting
                                ? "grid-rows-[0fr] opacity-0"
                                : "grid-rows-[1fr] opacity-100"
                            }
                        `}
                    >
                        <div className="overflow-hidden">
                            <div className="pb-2">
                                <div
                                    className={`pointer-events-auto transition-all duration-300 ease-in-out transform transition-gpu
                                        ${(t as any).isExiting
                                            ? "translate-x-10 scale-95"
                                            : "translate-x-0 scale-100 animate-in slide-in-from-right-10 fade-in"
                                        }
                                    `}
                                >
                                    <AlertApp
                                        title={t.title}
                                        description={t.description}
                                        variant={t.variant}
                                        type={t.type}
                                        onClose={() => dismiss(t.id)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
