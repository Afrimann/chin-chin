'use client'
import { OrderCard } from "@/components/customer/OrderCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, ShoppingBag } from "lucide-react";
import { useOrders } from "@/app/hooks/useOrders";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
    const { orders, isLoading, isAuthenticated } = useOrders()
    const router = useRouter()

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <div className="animate-pulse flex flex-col items-center text-center">
                    <div className="h-24 w-24 bg-secondary/30 rounded-full mb-4"></div>
                    <div className="h-6 w-48 bg-secondary/30 rounded mb-2"></div>
                    <p className="text-muted-foreground">Loading your cravings...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        router.replace('/auth/sign-in')
    }
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 pb-24 space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Your Orders</h1>
                <p className="text-muted-foreground mt-1">
                    Track the status of your current and past cravings.
                </p>
            </div>

            {orders && orders.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order: any) => (
                        <OrderCard key={order._id} order={{
                            id: order._id.slice(-6).toUpperCase(),
                            date: new Date(order.createdAt).toISOString(),
                            status: order.status as any,
                            total: order.totalAmount / 100,
                            items: order.items.map((item: any) => ({
                                name: item.productName,
                                quantity: item.quantity
                            })),
                            address: `${order.deliveryAddress.street}, ${order.deliveryAddress.city}`
                        }} />
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
                        <Link href="/dashboard/products">
                            <ShoppingBag className="mr-2 h-4 w-4" /> Start Shopping
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
