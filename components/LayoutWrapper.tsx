"use client";

import { ReactNode, useState } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

export default function LayoutWrapper({ children }: { children: ReactNode }) {
    const [convex] = useState(() => new ConvexReactClient(convexUrl || "https://placeholder-url.convex.cloud"));
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithClerk>
        </QueryClientProvider>
    );
}