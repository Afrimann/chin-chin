"use client";

import Script from "next/script";

export default function PaystackProvider() {
    return (
        <Script
            src="https://js.paystack.co/v1/inline.js"
            strategy="afterInteractive"
        />
    );
}