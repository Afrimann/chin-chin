"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopNav() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/app" className="font-bold text-xl tracking-tight text-primary">
                    Chin-Chin
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="/dashboard/" className="transition-colors hover:text-primary">
                        Home
                    </Link>
                    <Link href="/dashboard/products" className="transition-colors hover:text-primary">
                        Products
                    </Link>
                    <Link href="/dashboard/orders" className="transition-colors hover:text-primary">
                        Orders
                    </Link>
                    <Link href="/dashboard/support" className="transition-colors hover:text-primary">
                        Support
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="relative">
                        <Link href="/dashboard/cart">
                            <ShoppingCart className="h-5 w-5" />
                            <span className="sr-only">Cart</span>
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
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
