import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"

const products = [
    {
        id: 1,
        name: "Classic Original",
        price: "₦1,500",
        image: "/placeholder-classic.jpg",
        tag: "Best Seller",
    },
    {
        id: 2,
        name: "Spicy Pepper",
        price: "₦1,600",
        image: "/placeholder-spicy.jpg",
        tag: "Hot 🔥",
    },
    {
        id: 3,
        name: "Coconut Crunch",
        price: "₦1,800",
        image: "/placeholder-coconut.jpg",
        tag: "New",
    },
    {
        id: 4,
        name: "Nutmeg Delight",
        price: "₦1,500",
        image: "/placeholder-nutmeg.jpg",
        tag: null,
    },
]

export function FeaturedProducts() {
    return (
        <section id="products" className="py-24 bg-stone-50">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Our Flavours</h2>
                        <p className="text-muted-foreground text-lg">Hand-picked varieties for every taste bud.</p>
                    </div>
                    <Button variant="link" className="text-orange-600">View All Products &rarr;</Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="aspect-square relative bg-orange-100 flex items-center justify-center overflow-hidden">
                                {product.tag && (
                                    <Badge className="absolute top-3 left-3 z-10 bg-white/90 text-orange-700 hover:bg-white">{product.tag}</Badge>
                                )}
                                <div className="w-full h-full bg-stone-200 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center text-stone-400 font-medium">
                                    {/* Placeholder for Product Image */}
                                    Product Image
                                </div>
                            </div>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-lg">{product.name}</h3>
                                </div>
                                <p className="text-2xl font-bold text-orange-600">{product.price}</p>
                            </CardContent>
                            <CardFooter className="pt-0 pb-6">
                                <Button className="w-full rounded-full group-hover:bg-orange-600 group-hover:text-white transition-colors" variant="outline">
                                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
