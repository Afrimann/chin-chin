"use client";

import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="flex justify-center"
                >
                    <div className="rounded-full bg-primary/10 p-6">
                        <CheckCircle className="h-16 w-16 text-primary" />
                    </div>
                </motion.div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Order Successful!</h1>
                    <p className="text-muted-foreground">
                        Thank you for your purchase. Your delicious snacks are being prepared and will be with you soon.
                    </p>
                </div>

                <div className="bg-secondary/20 p-6 rounded-2xl border border-border/50">
                    <p className="text-sm font-medium mb-4">What's next?</p>
                    <div className="space-y-3 text-left">
                        <div className="flex gap-3 text-sm">
                            <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-[10px]">1</div>
                            <span>We'll confirm your payment and start preparing your order.</span>
                        </div>
                        <div className="flex gap-3 text-sm">
                            <div className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-[10px]">2</div>
                            <span>You'll receive an email notification when your order is out for delivery.</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button asChild size="lg" className="rounded-full w-full">
                        <Link href="/dashboard/orders">
                            View My Orders <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="outline" asChild size="lg" className="rounded-full w-full">
                        <Link href="/dashboard/products">
                            Continue Shopping
                        </Link>
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground pt-4">
                    Having issues? <Link href="/dashboard/support" className="underline hover:text-primary">Contact support</Link>
                </p>
            </div>
        </div>
    );
}
