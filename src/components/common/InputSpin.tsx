import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import * as React from "react";

export interface InputSpinProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "children" | "placeholder" | "className"> {
    isLoading?: boolean;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    loadingText?: string;
    placeholder?: string;
}

export function InputSpin({ isLoading = false, icon, children, className, loadingText, placeholder, ...props }: InputSpinProps) {
    return (
        <InputGroup className={className} >
            <InputGroupInput placeholder={placeholder} disabled={isLoading} {...props} />
            {(isLoading || icon) && (
                <InputGroupAddon >
                    {isLoading ? <Spinner data-icon="inline-start" /> : icon}
                </InputGroupAddon>
            )}
            {(isLoading && (loadingText || children)) || children ? (
                <InputGroupAddon align="inline-end">
                    {isLoading ? loadingText || children : children}
                </InputGroupAddon>
            ) : null}
        </InputGroup>
    )
}
