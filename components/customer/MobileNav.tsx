"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
    { href: "/app", label: "Home", icon: Home },
    { href: "/app/products", label: "Shop", icon: ShoppingBag },
    { href: "/app/cart", label: "Cart", icon: ShoppingCart },
    { href: "/app/orders", label: "Orders", icon: Clock },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border/40 pb-safe md:hidden">
            <div className="flex justify-around items-center h-16">
                {links.map((link) => {
                    const Icon = link.icon;
                    // Exact match for home, startsWith for others
                    const isActive = link.href === "/app"
                        ? pathname === "/app"
                        : pathname.startsWith(link.href);

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
