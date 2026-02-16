import { cn } from "@/lib/utils";

interface AuthCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    subtitle?: string;
}

export const AuthCard = ({ children, className, title, subtitle }: AuthCardProps) => {
    return (
        <div className={cn("w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-orange-100/50 border border-orange-50", className)}>
            {(title || subtitle) && (
                <div className="mb-8 text-center space-y-2">
                    {title && <h1 className="text-3xl font-bold font-playfair text-amber-950">{title}</h1>}
                    {subtitle && <p className="text-amber-800/60">{subtitle}</p>}
                </div>
            )}
            {children}
        </div>
    );
};
