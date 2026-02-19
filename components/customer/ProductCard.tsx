"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Id } from "@/convex/_generated/dataModel";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    imageUrl?: string | null
}

interface ProductCardProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    const { user } = useUser();
    const addItem = useMutation(api.carts.addItem);
    const { addItem: addToLocalCart } = useCartStore();
    const cart = useQuery(api.carts.get, user ? { userId: user.id } : "skip");
    const localCartItems = useCartStore((state) => state.items);

    const isInCart = user
        ? cart?.items.some((item) => item.productId === product.id)
        : localCartItems.some((item) => item.id === product.id);

    const handleAddToCart = async () => {
        if (!user) {
            toast.error("Please log in to add items to cart");
            return;
        }

        try {
            // Add to backend cart
            await addItem({
                userId: user.id,
                productId: product.id as Id<"products">,
                quantity: 1
            });

            // Keep local state in sync for UI (optimistic/hybrid)
            addToLocalCart(product);
            toast.success(`${product.name} added to cart`);
        } catch (error) {
            console.error("Failed to add to cart:", error);
            toast.error("Failed to add item to cart");
        }
    };

    return (
        <Card className={cn("overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-300", className)}>
            <div className="aspect-square relative bg-secondary/20">
                <Image
                    src={product.imageUrl || "/cracker-cookies.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-semibold text-lg leading-tight text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
                    </div>
                </div>
                <div className="mt-2 font-bold text-primary">
                    ₦{product.price.toLocaleString()}
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                {isInCart ? (
                    <Button
                        className="w-full rounded-full transition-all active:scale-95 bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        size="sm"
                        asChild
                    >
                        <Link href="/dashboard/cart">
                            View in Cart
                        </Link>
                    </Button>
                ) : (
                    <Button
                        className="w-full rounded-full transition-all active:scale-95"
                        size="sm"
                        onClick={handleAddToCart}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add to Cart
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
