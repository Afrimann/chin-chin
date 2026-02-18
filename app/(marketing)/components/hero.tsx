import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-16 pb-32 md:pt-24 md:pb-32">
            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col gap-8 items-center text-center">
                    <div className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-800 backdrop-blur-sm">
                        🎉 New Flavours Available!
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl text-foreground">
                        The Crispiest <span className="text-orange-600">Chin-Chin</span> You've Ever Tasted.
                    </h1>
                    <p className="max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                        Authentic Nigerian crunchy snacks made fresh daily. Perfect for parties, movie nights, or your daily craving.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 justify-center">
                        <Button size="lg" className="rounded-full px-8 text-lg h-14 bg-orange-600 hover:bg-orange-700 shadow-xl shadow-orange-200">
                            Order Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full px-8 text-lg h-14">
                            View Flavours
                        </Button>
                    </div>
                </div>
            </div>

            {/* Background Graphic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] bg-orange-100/50 rounded-full blur-3xl opacity-50" />

            {/* Product Placeholder Circle */}
            <div className="mt-16 relative w-72 h-72 md:w-96 md:h-96 mx-auto bg-stone-100 rounded-full flex items-center justify-center border-4 border-white shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700">
                <Image src="/shrimp-ball.jpg" alt="Chin-Chin" width={300} height={300} />
            </div>
        </section>
    )
}
