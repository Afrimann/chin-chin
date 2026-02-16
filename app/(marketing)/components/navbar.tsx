"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navLinks = [
    { href: "/", label: "Home" },
    { href: "#products", label: "Products" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold text-orange-600 tracking-tight">
                    Chin-Chin<span className="text-foreground">.</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <ul className="flex gap-6">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    className="text-sm font-medium text-muted-foreground hover:text-orange-600 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-orange-600">
                            <ShoppingBag className="h-5 w-5" />
                            <span className="absolute top-1 right-1 h-2 w-2 bg-orange-600 rounded-full" />
                        </Button>
                        <Button size="sm" className="rounded-full">
                            Order Now
                        </Button>
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                        <ShoppingBag className="h-5 w-5" />
                    </Button>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-foreground p-2 focus:outline-none"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b shadow-lg animate-in slide-in-from-top-5 fade-in-0 duration-200">
                    <ul className="flex flex-col p-4 gap-4">
                        {navLinks.map((link) => (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    className="block text-lg font-medium py-2 px-4 hover:bg-orange-50 rounded-md text-foreground/80 hover:text-orange-600 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                        <li className="pt-2">
                            <Button className="w-full text-lg h-12 rounded-xl">
                                Order Now
                            </Button>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    )
}
