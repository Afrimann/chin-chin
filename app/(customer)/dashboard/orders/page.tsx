"use client";

import { Clock, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/customer/OrderCard";
import { ORDERS } from "@/lib/mock-data";
import Link from "next/link";

export default function OrdersPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 pb-24 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
                <p className="text-muted-foreground mt-1">
                    Track the status of your current and past cravings.
                </p>
            </div>

            {ORDERS.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {ORDERS.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-secondary/30 p-6 rounded-full mb-4">
                        <Clock className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                    <p className="text-muted-foreground mb-6">You haven't placed any orders yet. Time to change that?</p>
                    <Button asChild>
                        <Link href="/app/products">
                            <ShoppingBag className="mr-2 h-4 w-4" /> Start Shopping
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
