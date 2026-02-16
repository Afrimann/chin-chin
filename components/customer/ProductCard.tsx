"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
}

interface ProductCardProps {
    product: Product;
    className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
    return (
        <Card className={cn("overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-300", className)}>
            <div className="aspect-square relative bg-secondary/20">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
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
                <Button className="w-full rounded-full transition-all active:scale-95" size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
