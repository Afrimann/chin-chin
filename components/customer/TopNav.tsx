"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";

export function TopNav() {
    const pathname = usePathname();
    const cartItemCount = useCartStore((state) => state.getTotalItems());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const routes = [
        {
            href: "/dashboard",
            label: "Home",
            active: pathname === "/dashboard",
        },
        {
            href: "/dashboard/products",
            label: "Products",
            active: pathname === "/dashboard/products",
        },
        {
            href: "/dashboard/orders",
            label: "Orders",
            active: pathname === "/dashboard/orders",
        },
        {
            href: "/dashboard/support",
            label: "Support",
            active: pathname === "/dashboard/support",
        },
    ];

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/dashboard" className="font-bold text-xl tracking-tight text-primary">
                    Chin-Chin
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={cn(
                                "transition-colors hover:text-primary",
                                route.active ? "text-foreground font-semibold" : "text-muted-foreground"
                            )}
                        >
                            {route.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="relative">
                        <Link href="/dashboard/cart">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">Cart</span>
                            {mounted && cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    </Button>
                    <UserButton afterSignOutUrl="/auth/sign-in"
                        appearance={{
                            elements: {
                                avatarBox: "h-9 w-9"
                            }
                        }}
                    />
                </div>
            </div>
        </header>
    );
}
