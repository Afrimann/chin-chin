import { forwardRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ label, error, type, className, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";

        return (
            <div className="space-y-2">
                <Label className="text-sm font-medium text-amber-900">{label}</Label>
                <div className="relative">
                    <Input
                        ref={ref}
                        type={isPassword ? (showPassword ? "text" : "password") : type}
                        className={cn(
                            "h-12 border-amber-200 bg-orange-50/30 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all rounded-xl",
                            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                            className
                        )}
                        {...props}
                    />
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-900/40 hover:text-orange-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    )}
                </div>
                {error && <p className="text-xs text-red-500 font-medium ml-1">{error}</p>}
            </div>
        );
    }
);
AuthInput.displayName = "AuthInput";
