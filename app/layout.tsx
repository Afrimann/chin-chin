import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import LayoutWrapper from "@/components/LayoutWrapper";
import PaystackProvider from "@/components/paystack/PaystackProvider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "Chin-Chin | Premium Nigerian Snacks",
  description: "Crunchy, sweet, and irresistible Chin-Chin delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
          <Script
            src="https://js.paystack.co/v1/inline.js"
            strategy="afterInteractive"
          />
          <LayoutWrapper>
            {children}
            <Toaster />
          </LayoutWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
