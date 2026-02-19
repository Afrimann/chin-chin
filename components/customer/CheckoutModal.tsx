"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, ShoppingBag, MapPin } from "lucide-react";
import Link from "next/link";

interface CheckoutModalProps {
    children: React.ReactNode;
    hasAddress?: boolean;
}

export function CheckoutModal({ children, hasAddress = true }: CheckoutModalProps) {
    if (!hasAddress) {
        return (
            <Dialog>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <MapPin className="h-5 w-5" />
                            Address Required
                        </DialogTitle>
                        <DialogDescription>
                            Please create and select an address so that your order is delivered to the right location.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="default" onClick={() => document.getElementById("address-section")?.scrollIntoView({ behavior: "smooth" })} asChild>
                            <DialogTrigger>
                                Select Address
                            </DialogTrigger>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        Checkout Coming Soon
                    </DialogTitle>
                    <DialogDescription>
                        We are currently setting up our secure payment gateway to serve you better.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center space-y-4 py-4 text-center">
                    <div className="bg-secondary/20 p-4 rounded-full">
                        <Mail className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-2">
                        <p className="font-medium text-foreground">
                            Ready to order?
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Please reach out to us directly to place your order manually.
                        </p>
                        <a
                            href="mailto:orders@chinchin.com"
                            className="inline-flex items-center gap-2 text-primary font-bold hover:underline mt-2 p-2 bg-primary/5 rounded-md"
                        >
                            orders@chinchin.com
                        </a>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/dashboard/products">
                            Explore More Products
                        </Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
