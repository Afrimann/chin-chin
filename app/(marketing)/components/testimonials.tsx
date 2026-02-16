import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
    {
        name: "Tunde A.",
        quote: "I've tried many chin-chin brands in Lagos, but this is hands down the crunchiest. The delivery was super fast too!",
        role: "Lagos",
    },
    {
        name: "Chioma K.",
        quote: "Perfect balance of sweetness and crunch. My kids absolutely love the Coconut flavour. Will definitely order again.",
        role: "Abuja",
    },
    {
        name: "David O.",
        quote: "The packaging is premium and keeps it fresh for weeks. Great gift idea for friends abroad.",
        role: "Port Harcourt",
    },
]

export function Testimonials() {
    return (
        <section className="py-24 bg-white">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Customers Say</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <Card key={i} className="bg-orange-50/50 border-orange-100">
                            <CardContent className="pt-8">
                                <div className="flex gap-1 mb-4 text-orange-500">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-lg leading-relaxed mb-6 font-medium text-foreground/80">
                                    "{t.quote}"
                                </blockquote>
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center font-bold text-orange-700">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <div className="font-semibold">{t.name}</div>
                                        <div className="text-xs text-muted-foreground">{t.role}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
