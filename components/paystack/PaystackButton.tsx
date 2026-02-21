"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

declare global {
    interface Window {
        PaystackPop: any;
    }
}

type Props = {
    email: string;
    amount: number; // in kobo
    name: string;
    orderId: string;
};

export default function PaystackButton({ email, amount, name, orderId }: Props) {
    const [isProcessing, setIsProcessing] = useState(false);

    // Reliable script check
    const isReady =
        typeof window !== "undefined" &&
        typeof window.PaystackPop !== "undefined";

    const handlePayment = () => {
        if (!window.PaystackPop) {
            toast.error("Payment system is still loading. Please wait a few seconds.");
            return;
        }

        const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim();

        if (!publicKey) {
            toast.error("Payment configuration error: Public key is missing.");
            console.error("NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is not defined in environment.");
            return;
        }

        if (!email) {
            toast.error("Your email is required for payment.");
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            toast.error("Invalid payment amount. Please refresh and try again.");
            console.error("PaystackButton received invalid amount:", amount);
            return;
        }

        setIsProcessing(true);

        try {
            console.log("Initializing Paystack payment for order:", orderId, "Amount:", amount);

            const handler = window.PaystackPop.setup({
                key: publicKey,
                email: email.trim(),
                amount: Math.max(1, Math.round(amount)), // Ensure at least 1 kobo to prevent static crash
                currency: "NGN",
                ref: `order_${orderId}_${Date.now()}`, // Unique reference per attempt
                metadata: {
                    order_id: orderId,
                    custom_fields: [
                        {
                            display_name: "Customer Name",
                            variable_name: "customer_name",
                            value: name || "Customer"
                        }
                    ]
                },
                callback: (response: any) => {
                    console.log("Payment successful, terminal reference:", response.reference);
                    setIsProcessing(true); // Keep processing until redirect

                    fetch("/api/verify-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            reference: response.reference,
                            orderId: orderId
                        }),
                    })
                        .then(res => res.json())
                        .then(result => {
                            if (result.success) {
                                toast.success("Payment verified! Redirecting...");
                                window.location.href = "/order-success";
                            } else {
                                toast.error(result.error || "Payment verification failed.");
                                setIsProcessing(false);
                            }
                        })
                        .catch(err => {
                            console.error("Verification error:", err);
                            toast.error("Network error during verification. Please contact support.");
                            setIsProcessing(false);
                        });
                },
                onClose: () => {
                    setIsProcessing(false);
                    console.log("Payment window closed");
                }
            });

            // Small delay to allow Dialog to close and focus trap to release
            setTimeout(() => {
                handler.openIframe();
            }, 200);
        } catch (error) {
            console.error("Paystack setup error:", error);
            toast.error("Error launching payment window.");
            setIsProcessing(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={!isReady || isProcessing}
            className={`w-full py-4 px-6 rounded-full font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-2 ${!isReady || isProcessing
                ? "bg-muted cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 shadow-lg"
                }`}
        >
            {isProcessing ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                </>
            ) : !isReady ? (
                "Loading Payment..."
            ) : (
                "Confirm and Pay Now"
            )}
        </button>
    );
}
