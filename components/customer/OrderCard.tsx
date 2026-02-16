"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Package } from "lucide-react";

interface OrderItem {
    name: string;
    quantity: number;
}

interface Order {
    id: string;
    date: string;
    status: "Pending" | "Confirmed" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled";
    total: number;
    items: OrderItem[];
    address: string;
}

interface OrderCardProps {
    order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
    return (
        <Card className="hover:border-primary/50 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Order #{order.id}
                    </CardTitle>
                    <CardDescription className="text-xs">
                        {new Date(order.date).toLocaleDateString()}
                    </CardDescription>
                </div>
                <StatusBadge status={order.status} />
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4 py-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Package className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {order.items.length} items
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {order.items.map(i => `${i.quantity}x ${i.name}`).join(", ").slice(0, 50)}...
                        </p>
                    </div>
                    <div className="font-bold">
                        ₦{order.total.toLocaleString()}
                    </div>
                </div>
                <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {order.address}
                    </p>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
