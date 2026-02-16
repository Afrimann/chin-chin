import { Navbar } from "./components/navbar"
import { Footer } from "./components/footer"

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col bg-stone-50/50">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
