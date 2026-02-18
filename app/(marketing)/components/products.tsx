import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PRODUCTS } from "@/lib/mock-data"
import { ProductCard } from "@/components/customer/ProductCard"

export function FeaturedProducts() {
    return (
        <section id="products" className="py-24 bg-stone-50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Our Flavours</h2>
                        <p className="text-muted-foreground text-lg">Hand-picked varieties for every taste bud.</p>
                    </div>
                    <Button variant="link" className="text-orange-600" asChild>
                        <Link href="/dashboard/products">
                            View All Products &rarr;
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {PRODUCTS.slice(0, 8).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
