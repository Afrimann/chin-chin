"use client"

import { Truck, ShieldCheck, Leaf, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const features = [
    {
        icon: Leaf,
        title: "Freshly Made Daily",
        description: "We don't do stale. Experience the crunch of premium flour and fresh ingredients, prepared every single morning.",
        className: "md:col-span-2",
        color: "bg-green-50 text-green-700 border-green-100",
    },
    {
        icon: ShieldCheck,
        title: "Hygienic Seal",
        description: "Tamper-proof, airtight packaging that locks in the signature crunch for weeks.",
        className: "md:col-span-1",
        color: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
        icon: Truck,
        title: "Express Delivery",
        description: "From our kitchen to your doorstep in 24 hours. Hot, fresh, and ready to devour.",
        className: "md:col-span-1",
        color: "bg-orange-50 text-orange-700 border-orange-100",
    },
    {
        icon: Sparkles,
        title: "Premium Ingredients",
        description: "Zero preservatives. just pure, authentic joy in every bite.",
        className: "md:col-span-2",
        color: "bg-stone-50 text-stone-700 border-stone-100",
    },
]

export function Features() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl opacity-60" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-stone-50/80 rounded-full blur-3xl opacity-60" />
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="text-center mb-20 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Badge variant="outline" className="mb-4 px-4 py-1 text-sm border-orange-200 text-orange-700 bg-orange-50/50 backdrop-blur">
                            Our Promise
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-foreground">
                            Not Just a Snack. <br className="hidden md:block" />
                            <span className="text-orange-600">An Experience.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                            Crafted for the connoisseur who appreciates the perfect balance of crunch, sweetness, and nostalgia.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className={`relative group overflow-hidden rounded-3xl border p-8 transition-all duration-300 hover:shadow-xl ${feature.className} ${feature.color} bg-opacity-40 backdrop-blur-sm`}
                            >
                                <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm ring-1 ring-black/5`}>
                                        <Icon className="h-7 w-7" />
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-bold mb-3 tracking-tight">{feature.title}</h3>
                                        <p className="text-muted-foreground/90 text-lg leading-relaxed font-medium">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Hover Abstract Shape */}
                                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

