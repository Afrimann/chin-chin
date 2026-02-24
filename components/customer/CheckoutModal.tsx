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
import {  ShoppingBag, MapPin } from "lucide-react";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import PaystackButton from "../paystack/PaystackButton";
import { CheckCircle } from "lucide-react";

interface CheckoutModalProps {
    children: React.ReactNode;
    hasAddress?: boolean;
    userId: string;
    selectedAddressId: string | null;
    totalAmount: number; // in Naira
    email: string | undefined
    customerName: string
}

export function CheckoutModal({ children, hasAddress = true, userId, selectedAddressId, totalAmount, email, customerName }: CheckoutModalProps) {
    const [open, setOpen] = useState(false);
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const createOrderMutation = useMutation(api.orders.create);

    // Fetch address details for snapshot
    const addresses = useQuery(api.addresses.get, { userId });
    const selectedAddress = addresses?.find(a => a._id === selectedAddressId);

    // Fallbacks to prevent null issues in Paystack
    const safeEmail = email || "";
    const safeName = customerName || "Customer";

    const handleCreateOrder = async () => {
        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        const deliveryFee = 1500; // Match CartPage.tsx

        setIsCreatingOrder(true);
        try {
            console.log("Creating order for user:", userId);
            const id = await createOrderMutation({
                userId,
                deliveryFee,
                deliveryAddress: {
                    name: selectedAddress.name,
                    street: selectedAddress.street,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    phone: selectedAddress.phone,
                },
            });
            setOrderId(id);
            toast.success("Order initiated! Click below to pay.");
        } catch (error) {
            console.error("Failed to create order:", error);
            toast.error("Failed to initiate order. Please try again.");
        } finally {
            setIsCreatingOrder(false);
        }
    };

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
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val);
            if (!val) {
                // Reset order creation state when modal closes
                setOrderId(null);
            }
        }}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {orderId ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            <ShoppingBag className="h-5 w-5 text-primary" />
                        )}
                        {orderId ? "Order Created!" : "Confirm Your Order"}
                    </DialogTitle>
                    <DialogDescription>
                        {orderId
                            ? "Your order has been initiated. Click below to complete your payment securely."
                            : "Review your order details before confirming."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Order Total:</span>
                            <span className="font-bold">₦{totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Payment Method:</span>
                            <span className="font-medium">Paystack (Secure Online Payment)</span>
                        </div>
                    </div>

                    {selectedAddress && !orderId && (
                        <div className="space-y-1">
                            <h4 className="text-sm font-semibold">Delivery Address</h4>
                            <p className="text-xs text-muted-foreground">
                                {selectedAddress.name}<br />
                                {selectedAddress.street}, {selectedAddress.city}<br />
                                {selectedAddress.state}<br />
                                {selectedAddress.phone}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    {!orderId ? (
                        <Button
                            className="w-full rounded-full"
                            size="lg"
                            onClick={handleCreateOrder}
                            disabled={isCreatingOrder}
                        >
                            {isCreatingOrder ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating Order...
                                </>
                            ) : (
                                "Place Order and Pay"
                            )}
                        </Button>
                    ) : (
                        <div onClick={() => setOpen(false)}>
                            <PaystackButton
                                amount={totalAmount * 100} // Convert to kobo
                                email={safeEmail}
                                name={safeName}
                                orderId={orderId}
                            />
                        </div>
                    )}

                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="w-full rounded-full"
                    >
                        {orderId ? "Close and Pay Later" : "Cancel"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

