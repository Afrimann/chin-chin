import { Button } from "@/components/ui/button"

export function CallToAction() {
    return (
        <section className="py-24 bg-stone-900 text-white text-center">
            <div className="container px-4 md:px-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Ready to taste the crunch?
                    </h2>
                    <p className="text-stone-400 text-lg">
                        Join thousands of happy customers enjoying the best Chin-Chin in town.
                        Perfect for sharing, gifting, or solo snacking.
                    </p>
                    <Button size="lg" className="rounded-full px-8 h-14 text-lg bg-orange-600 hover:bg-orange-700 text-white border-none">
                        Shop Now - Get 10% Off
                    </Button>
                </div>
            </div>
        </section>
    )
}
