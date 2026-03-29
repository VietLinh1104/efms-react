import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import * as React from "react"

export interface ButtonSpinProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> {
    variant: "outline" | "secondary" | "default";
    isLoading?: boolean;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    loadingText?: string;
}

export function ButtonSpin({ variant, isLoading = false, icon, children, className, loadingText, ...props }: ButtonSpinProps) {
    return (
        <Button variant={variant} disabled={isLoading || props.disabled} className={`${className}`} {...props}>
            {isLoading ? <Spinner data-icon="inline-start" /> : icon}
            {isLoading ? loadingText || children : children}
        </Button>
    )
}
