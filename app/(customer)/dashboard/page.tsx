import { currentUser } from "@clerk/nextjs/server";
import { RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Clock, HelpCircle, Truck, ShieldCheck, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/customer/ProductCard";
import { PRODUCTS } from "@/lib/mock-data";

export default async function CustomerHomePage() {
    const user = await currentUser();
    if (!user) return <RedirectToSignIn />;
    const firstName = user?.firstName || "Friend";

    return (
        <div className="space-y-8 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-background pt-10 pb-16 md:pt-16 md:pb-24 px-4 md:px-6">
                <div className="container mx-auto relative z-10 max-w-5xl text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
                        Welcome back, {firstName} <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Ready for some crunchy goodness today? Freshly made chin-chin delivered to your doorstep.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button size="lg" className="rounded-full px-8 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-shadow" asChild>
                            <Link href="/dashboard/products">
                                Order Now <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl z-0" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl z-0" />
            </section>

            <div className="container mx-auto px-4 md:px-6 space-y-12">
                {/* Quick Actions */}
                <section>
                    <h2 className="text-lg font-semibold mb-4 px-1">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        <Link href="/dashboard/cart" className="block p-4 rounded-xl bg-card border shadow-sm hover:shadow-md hover:border-primary/50 transition-all group">
                            <ShoppingBag className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">View Cart</span>
                        </Link>
                        <Link href="/dashboard/orders" className="block p-4 rounded-xl bg-card border shadow-sm hover:shadow-md hover:border-primary/50 transition-all group">
                            <Clock className="h-6 w-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Track Orders</span>
                        </Link>
                        <Link href="/dashboard/support" className="col-span-2 md:col-span-1 block p-4 rounded-xl bg-card border shadow-sm hover:shadow-md hover:border-primary/50 transition-all group">
                            <HelpCircle className="h-6 w-6 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                            <span className="font-medium">Support</span>
                        </Link>
                    </div>
                </section>

                {/* Featured Products */}
                <section>
                    <div className="flex items-center justify-between mb-6 px-1">
                        <h2 className="text-2xl font-bold tracking-tight">Featured Cravings</h2>
                        <Link href="/dashboard/products" className="text-sm font-medium text-primary hover:underline">
                            View all
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
                        {PRODUCTS.slice(0, 8).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <div className="mt-8 text-center">
                        <Button variant="outline" size="lg" className="rounded-full md:hidden w-full" asChild>
                            <Link href="/dashboard/products">
                                View All Products
                            </Link>
                        </Button>
                    </div>
                </section>

                {/* Benefits */}
                <section className="bg-secondary/50 rounded-2xl p-6 md:p-10">
                    <h2 className="text-xl font-bold mb-6 text-center">Why Choost Us?</h2>
                    <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center mb-3 shadow-sm">
                                <Leaf className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Freshly Made Daily</h3>
                            <p className="text-sm text-muted-foreground">We bake our chin-chin fresh every single morning for maximum crunch.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center mb-3 shadow-sm">
                                <ShieldCheck className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Hygienically Packaged</h3>
                            <p className="text-sm text-muted-foreground">Sealed with care in food-safe packaging to ensure safety and quality.</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="h-12 w-12 rounded-full bg-background flex items-center justify-center mb-3 shadow-sm">
                                <Truck className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="font-semibold mb-2">Fast Doorstep Delivery</h3>
                            <p className="text-sm text-muted-foreground">Order now and get your crunch box delivered in record time.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
