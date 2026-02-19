"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { QuantityStepper } from "@/components/customer/QuantityStepper";
import { PRODUCTS } from "@/lib/mock-data";
import { useCartStore } from "@/store/use-cart-store";
import { AddressSelector } from "@/components/customer/AddressSelector";
import { CheckoutModal } from "@/components/customer/CheckoutModal";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useAddressStore } from "@/store/use-address-store";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function CartPage() {
    const { items: localCart, updateQuantity: updateLocalQuantity, removeItem: removeLocalItem } = useCartStore();
    const { user } = useUser();
    const { selectedAddressId } = useAddressStore(); // Get selected address state

    // Convex Cart Logic
    const cartQuery = useQuery(api.carts.get, user ? { userId: user.id } : "skip");
    const deleteCartItem = useMutation(api.carts.removeItem);
    const updateCartItemQuantity = useMutation(api.carts.updateQuantity);

    const isLoading = user && cartQuery === undefined;

    const cartItems = user && cartQuery
        ? cartQuery.items.map(item => ({
            id: item._id, // Cart Item ID (for deletions/updates)
            productId: item.productId,
            name: item.product?.name || "Unknown Product",
            price: item.product?.price || 0,
            image: item.product?.imageUrl || "/cracker-cookies.jpg", // Fallback image
            category: item.product?.category || "Uncategorized",
            quantity: item.quantity,
            imageurl: item.product?.imageUrl || "/cracker-cookies.jpg",
        }))
        : localCart;

    // Subtotal and Total calculations
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 1500;
    const total = subtotal + deliveryFee;

    const handleDeleteCart = async (id: string) => {
        if (user) {
            try {
                await deleteCartItem({ userId: user.id, itemId: id as Id<"cartItems"> });
                toast.success("Item removed from cart");
            } catch (error) {
                console.error("Failed to remove item:", error);
                toast.error("Failed to remove item");
            }
        } else {
            removeLocalItem(id);
            toast.success("Item removed from cart");
        }
    };

    const handleUpdateQuantity = async (id: string, delta: number) => {
        const item = cartItems.find(i => i.id === id);
        if (!item) return;

        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return;

        if (user) {
            try {
                await updateCartItemQuantity({ itemId: id as Id<"cartItems">, quantity: newQuantity });
            } catch (error) {
                console.error("Failed to update quantity:", error);
                toast.error("Failed to update quantity");
            }
        } else {
            updateLocalQuantity(id, delta);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-20 flex justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-24 w-24 bg-secondary/30 rounded-full mb-4"></div>
                    <div className="h-6 w-48 bg-secondary/30 rounded mb-2"></div>
                </div>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
                <div className="h-24 w-24 rounded-full bg-secondary/30 flex items-center justify-center mb-6">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Your crunch box is empty...</h2>
                <p className="text-muted-foreground mb-8 max-w-sm">
                    Let's fix that! Add some delicious chin-chin to your cart and get crunching.
                </p>
                <Button size="lg" className="rounded-full px-8" asChild>
                    <Link href="/dashboard/products">Start Shopping</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 pb-32 md:pb-10">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild className="pl-0 hover:bg-transparent hover:text-primary">
                    <Link href="/dashboard/products">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight mt-2">Your Cart</h1>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-border/50">
                            <CardContent className="p-4 flex gap-4">
                                <div className="h-24 w-24 bg-secondary/20 rounded-md relative shrink-0">
                                    <Image
                                        src={item.image || "/cracker-cookies.jpg"}
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded-md"
                                        unoptimized
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-lg">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">{item.category}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive -mr-2 -mt-2"
                                            onClick={() => handleDeleteCart(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <QuantityStepper
                                            value={item.quantity}
                                            onIncrease={() => handleUpdateQuantity(item.id, 1)}
                                            onDecrease={() => handleUpdateQuantity(item.id, -1)}
                                        />
                                        <div className="font-bold text-lg">
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Delivery Address */}
                <div className="lg:col-span-2" id="address-section">
                    <AddressSelector />
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <Card className="border-border/50 bg-secondary/10 shadow-sm">
                            <CardContent className="p-6">
                                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>₦{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Delivery Fee</span>
                                        <span>₦{deliveryFee.toLocaleString()}</span>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>₦{total.toLocaleString()}</span>
                                    </div>
                                </div>
                                <CheckoutModal hasAddress={!!selectedAddressId}>
                                    <Button className="w-full mt-6 rounded-full" size="lg">
                                        Proceed to Checkout
                                    </Button>
                                </CheckoutModal>
                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    Checkout is currently disabled for this demo.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Checkout */}
            <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t border-border/50 md:hidden z-30">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Total</span>
                    <span className="font-bold text-lg">₦{total.toLocaleString()}</span>
                </div>
                <CheckoutModal hasAddress={!!selectedAddressId}>
                    <Button className="w-full rounded-full" size="lg">
                        Checkout
                    </Button>
                </CheckoutModal>
            </div>
        </div>
    );
}
