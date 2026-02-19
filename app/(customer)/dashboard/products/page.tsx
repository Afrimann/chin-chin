"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/customer/ProductCard";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORIES = ["All", "Classic", "Sweet", "Special", "Savory"];

export default function ProductsPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const products = useQuery(api.products.get);

    const isLoading = products === undefined;

    const filteredProducts = products?.filter((product) => {
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    }) || [];

    const mappedProducts = filteredProducts.map(p => ({
        ...p,
        id: p._id,
        // Ensure image is a string, fallback if technically missing but covered by type
        image: p.imageUrl || "/cracker-cookies.jpg"
    }));

    console.log(products);
    
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 pb-24 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Our Collection</h1>
                    <p className="text-muted-foreground mt-1">
                        Browse our delicious range of handcrafted chin-chin.
                    </p>
                </div>

                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search flavors..."
                        className="pl-9 rounded-full bg-secondary/30 border-none focus-visible:ring-1"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
                {CATEGORIES.map((category) => (
                    <Button
                        key={category}
                        variant={activeCategory === category ? "default" : "outline"}
                        className={cn(
                            "rounded-full whitespace-nowrap",
                            activeCategory === category ? "shadow-md" : "border-border/50 bg-background"
                        )}
                        onClick={() => setActiveCategory(category)}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {/* Product Grid */}
            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-[200px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : mappedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                    {mappedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-muted-foreground text-lg">No treats found matching your cravings. 🍪</p>
                    <Button variant="link" onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}>
                        Clear filters
                    </Button>
                </div>
            )}
        </div>
    );
}
