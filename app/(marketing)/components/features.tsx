import { Truck, ShieldCheck, Leaf } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
    {
        icon: Leaf,
        title: "Freshly Made",
        description: "Prepared daily with premium flour and fresh ingredients. No preservatives.",
        color: "bg-green-100 text-green-700",
    },
    {
        icon: ShieldCheck,
        title: "Hygienically Packaged",
        description: "Sealed in airtight, tamper-proof packaging to maintain maximum crunch.",
        color: "bg-blue-100 text-blue-700",
    },
    {
        icon: Truck,
        title: "Fast Delivery",
        description: "Order today and get it delivered to your doorstep within 24 hours.",
        color: "bg-orange-100 text-orange-700",
    },
]

export function Features() {
    return (
        <section className="py-24 bg-white">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose Us?</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        We don't just sell snacks; we deliver happiness in every crunch.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <Card key={index} className="border-none shadow-none text-center bg-transparent group cursor-default">
                                <CardContent className="pt-6">
                                    <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300 ${feature.color}`}>
                                        <Icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
