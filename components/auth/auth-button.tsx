import { Button, ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface AuthButtonProps extends ButtonProps {
    isLoading?: boolean;
}

export const AuthButton = ({ children, isLoading, className, disabled, ...props }: AuthButtonProps) => {
    return (
        <Button
            className={cn(
                "w-full h-12 text-base font-semibold rounded-xl bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20 transition-all active:scale-[0.98]",
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? <Spinner className="w-5 h-5" /> : children}
        </Button>
    );
};
