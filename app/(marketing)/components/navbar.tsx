"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, ShoppingBag, LayoutDashboard, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser, useClerk } from "@clerk/nextjs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#products", label: "Products" },
    { href: "/#about", label: "About" },
    { href: "/#contact", label: "Contact" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { user, isLoaded } = useUser()
    const { signOut } = useClerk()
    const router = useRouter()

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

                        {/* Auth Buttons */}
                        {!isLoaded ? (
                            <Spinner className="w-5 h-5 text-orange-600" />
                        ) : user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden border border-orange-100 p-0 hover:ring-2 hover:ring-orange-200 transition-all">
                                        <img
                                            src={user.imageUrl}
                                            alt="User"
                                            className="h-full w-full object-cover"
                                        />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border-orange-100 shadow-xl shadow-orange-100/50">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none text-amber-950">{user.fullName || "User"}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-orange-50" />
                                    <DropdownMenuItem onClick={() => router.push("/dashboard")} className="cursor-pointer focus:bg-orange-50 focus:text-orange-900 rounded-lg">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => signOut(() => router.push("/"))} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700 rounded-lg">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Sign out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                onClick={() => router.push("/auth/sign-in")}
                                size="sm"
                                className="rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg shadow-orange-600/20"
                            >
                                Sign In
                            </Button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    {!isLoaded ? (
                        <Spinner className="w-5 h-5" />
                    ) : !user ? (
                        <Button
                            onClick={() => router.push("/auth/sign-in")}
                            size="sm"
                            variant="ghost"
                            className="text-orange-600 font-medium"
                        >
                            Sign In
                        </Button>
                    ) : (
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-100">
                            <img src={user.imageUrl} alt="User" className="w-full h-full object-cover" />
                        </div>
                    )}

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

                        {user && (
                            <>
                                <li className="pt-2 border-t border-orange-50">
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center text-lg font-medium py-2 px-4 bg-orange-50 text-orange-700 rounded-md"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <LayoutDashboard className="w-5 h-5 mr-3" />
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        onClick={() => {
                                            signOut(() => router.push("/"))
                                            setIsOpen(false)
                                        }}
                                        className="flex items-center w-full text-lg font-medium py-2 px-4 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        Sign Out
                                    </button>
                                </li>
                            </>
                        )}

                        <li className="pt-2">
                            <Button className="w-full text-lg h-12 rounded-xl bg-orange-600 hover:bg-orange-700 text-white">
                                Order Now
                            </Button>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    )
}
