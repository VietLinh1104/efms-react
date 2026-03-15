import {
    Alert,
    AlertDescription,
    AlertTitle
} from "@/components/ui/alert"
import { InfoIcon, CheckCircle2Icon, AlertTriangleIcon, XCircleIcon, X } from "lucide-react"

export interface AlertAppProps {
    title: string;
    description: string;
    variant: "default" | "destructive";
    type: "info" | "success" | "warning" | "error";
    onClose?: () => void;
}

export function AlertApp({ title, description, variant, type, onClose }: AlertAppProps) {
    return (
        <Alert variant={variant} className="relative pr-8">
            {type === "info" && <InfoIcon className="h-4 w-4" />}
            {type === "success" && <CheckCircle2Icon className="h-4 w-4" />}
            {type === "warning" && <AlertTriangleIcon className="h-4 w-4" />}
            {type === "error" && <XCircleIcon className="h-4 w-4" />}
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                {description}
            </AlertDescription>
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
                    aria-label="Close"
                >
                    <X className="h-3 w-3 opacity-30 hover:opacity-70" />
                </button>
            )}
        </Alert>
    )
}
