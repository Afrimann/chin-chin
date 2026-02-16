import { Hero } from "./components/hero"
import { Features } from "./components/features"
import { FeaturedProducts } from "./components/products"
import { Testimonials } from "./components/testimonials"
import { CallToAction } from "./components/cta"

export default function MarketingPage() {
    return (
        <>
            <Hero />
            <Features />
            <FeaturedProducts />
            <Testimonials />
            <CallToAction />
        </>
    )
}
