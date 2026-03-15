import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export interface ButtonSpinProps {
    variant: "outline" | "secondary" | "default";
    isLoading?: boolean;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    loadingText?: string;
}

export function ButtonSpin({ variant, isLoading = false, icon, children, onClick, className, loadingText }: ButtonSpinProps) {
    return (
        <Button variant={variant} disabled={isLoading} onClick={onClick} className={`${className}`}>
            {isLoading ? <Spinner data-icon="inline-start" /> : icon}
            {isLoading ? loadingText || children : children}
        </Button>
    )
}
