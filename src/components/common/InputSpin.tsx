import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

export interface InputSpinProps {
    isLoading?: boolean;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    loadingText?: string;
    placeholder?: string;
}

export function InputSpin({ isLoading = false, icon, children, className, loadingText, placeholder }: InputSpinProps) {
    return (
        <InputGroup className={`max-w-xs ${className}`} >
            <InputGroupInput placeholder={placeholder} disabled={isLoading} />
            <InputGroupAddon>
                {isLoading ? <Spinner data-icon="inline-start" /> : icon}
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">{isLoading ? loadingText || children : children}</InputGroupAddon>
        </InputGroup>
    )
}
