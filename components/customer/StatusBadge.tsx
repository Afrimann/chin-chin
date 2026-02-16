import { cn } from "@/lib/utils";

interface StatusBadgeProps {
    status: "Pending" | "Confirmed" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
    className?: string;
}

const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    Preparing: "bg-orange-100 text-orange-800 border-orange-200",
    "Out for Delivery": "bg-purple-100 text-purple-800 border-purple-200",
    Delivered: "bg-green-100 text-green-800 border-green-200",
    Cancelled: "bg-red-100 text-red-800 border-red-200",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                statusStyles[status] || "bg-gray-100 text-gray-800",
                className
            )}
        >
            {status}
        </span>
    );
}
