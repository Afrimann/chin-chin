import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

export async function POST(req: Request) {
    const convex = new ConvexHttpClient(process.env.CONVEX_URL!)
    const secretKey = process.env.PAYSTACK_SECRET_KEY?.trim();

  try {
    const { reference, orderId } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { error: "No reference supplied" },
        { status: 400 }
      );
    }

    if (!orderId) {
        return NextResponse.json(
          { error: "No orderId supplied" },
          { status: 400 }
        );
      }

    if (!secretKey) {
        console.error("PAYSTACK_SECRET_KEY is missing from environment variables");
        return NextResponse.json(
            { error: "Payment verification configuration error" },
            { status: 500 }
        );
    }


    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    // Handle Paystack error responses (like invalid key)
    if (!data.status) {
        console.error("Paystack verification error:", data);
        return NextResponse.json(
            { 
                success: false, 
                error: data.message || "Paystack verification failed",
                code: data.code 
            },
            { status: 400 }
        );
    }

    // Paystack success, now check transaction status
    if (data.data.status !== "success") {
      return NextResponse.json(
        { error: "Payment not successful: " + data.data.gateway_response },
        { status: 400 }
      );
    }

    // VERY IMPORTANT VALUES
    const amountPaid = data.data.amount; // in kobo
    const paystackRef = data.data.reference;

    // Save to Convex
    await convex.mutation(api.orders.confirmPayment, {
        orderId,
        reference: paystackRef,
        amount: amountPaid,
    });

    return NextResponse.json({
      success: true,
      amountPaid,
      paystackRef,
    });
  } catch (err) {
    console.error("Payment verification internal error:", err);
    return NextResponse.json(
      { error: "Internal verification failed" },
      { status: 500 }
    );
  }
}