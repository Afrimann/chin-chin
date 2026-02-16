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

// Mock initial cart state
const INITIAL_CART = [
    { ...PRODUCTS[0], quantity: 2 },
    { ...PRODUCTS[2], quantity: 1 },
];

export default function CartPage() {
    const [cart, setCart] = useState(INITIAL_CART);

    const updateQuantity = (id: string, delta: number) => {
        setCart(items =>
            items.map(item => {
                if (item.id === id) {
                    const newQuantity = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            })
        );
    };

    const removeItem = (id: string) => {
        setCart(items => items.filter(item => item.id !== id));
    };

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 1500;
    const total = subtotal + deliveryFee;

    if (cart.length === 0) {
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
                    <Link href="/app/products">Start Shopping</Link>
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
                    {cart.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-border/50">
                            <CardContent className="p-4 flex gap-4">
                                <div className="h-24 w-24 bg-secondary/20 rounded-md relative shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover rounded-md"
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
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex justify-between items-end mt-2">
                                        <QuantityStepper
                                            value={item.quantity}
                                            onIncrease={() => updateQuantity(item.id, 1)}
                                            onDecrease={() => updateQuantity(item.id, -1)}
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
                                <Button className="w-full mt-6 rounded-full" size="lg" disabled>
                                    Proceed to Checkout
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    Checkout is currently disabled for this demo.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Checkout (Optional - can be redundant with the sticky summary but good for UX) */}
            <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t border-border/50 md:hidden z-30">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground text-sm">Total</span>
                    <span className="font-bold text-lg">₦{total.toLocaleString()}</span>
                </div>
                <Button className="w-full rounded-full" size="lg" disabled>
                    Checkout
                </Button>
            </div>
        </div>
    );
}
