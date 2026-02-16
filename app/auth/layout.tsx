import Link from "next/link";
import { Cookie } from "lucide-react";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full font-sans">
            {/* Left Hero Panel (Desktop Only) */}
            <div className="hidden md:flex w-1/2 relative bg-amber-900 text-white overflow-hidden">
                {/* Background Image Placeholder */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{
                        backgroundImage: `url("https://images.unsplash.com/photo-1623091411244-972c417aaa3e?q=80&w=2574&auto=format&fit=crop")`
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-amber-900/40 to-black/80" />

                {/* Content Overlay */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
                    <div>
                        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white/90 hover:text-white transition-colors">
                            <Cookie className="w-8 h-8" />
                            <span>Chin-Chin.</span>
                        </Link> 
                    </div>

                    <div className="space-y-6">
                        <blockquote className="text-3xl font-playfair font-medium leading-tight">
                            &ldquo;The crunchiest happiness you'll ever taste. Authentic, sweet, and made with love.&rdquo;
                        </blockquote>
                        <div className="flex items-center gap-2 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-amber-900 bg-amber-100 flex items-center justify-center text-amber-900 text-xs font-bold">
                                        U{i}
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-white/80 pl-2">
                                Join 5,000+ snack lovers
                            </p>
                        </div>
                    </div>

                    <div className="text-xs text-white/40">
                        &copy; {new Date().getFullYear()} Chin-Chin Co. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex-1 w-full flex flex-col items-center justify-center bg-white p-6 relative">
                {/* Mobile Header (Visible only on small screens) */}
                <div className="md:hidden w-full max-w-sm mb-8 flex flex-col items-center text-center">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-orange-600 mb-2">
                        <Cookie className="w-8 h-8" />
                        <span>Chin-Chin.</span>
                    </Link>
                    <p className="text-sm text-gray-500">Sign in to get your crunch on</p>
                </div>

                {/* Auth Card Container */}
                <div className="w-full max-w-sm">
                    {children}
                </div>

                {/* Mobile specific footer links could go here */}
                <div className="md:hidden mt-8 text-center text-xs text-gray-400">
                    Terms &bull; Privacy
                </div>
            </div>
        </div>
    );
}
