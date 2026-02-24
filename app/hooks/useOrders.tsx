'use client'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import { useUser } from '@clerk/nextjs'

export const useOrders = () => {
    const { user, isLoaded, isSignedIn } = useUser();

    const orders = useQuery(
        api.orders.getWithItems,
        user ? { userId: user.id } : "skip"
    );

    return {
        orders,
        isLoading: !isLoaded || orders === undefined,
        isAuthenticated: isLoaded && isSignedIn
    };
};