import { Facebook, Instagram, Twitter, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-stone-900 text-stone-200 py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-orange-500">Chin-Chin</h3>
                        <p className="text-stone-400 text-sm leading-relaxed">
                            Premium Nigerian snacks made with love and traditional recipes. Crunchy, sweet, and irresistible.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-stone-400">
                            <li><a href="#" className="hover:text-orange-500 transition-colors">Home</a></li>
                            <li><a href="#products" className="hover:text-orange-500 transition-colors">Products</a></li>
                            <li><a href="#about" className="hover:text-orange-500 transition-colors">About Us</a></li>
                            <li><a href="#contact" className="hover:text-orange-500 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm text-stone-400">
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>hello@chinchin.com</span>
                            </li>
                            <li>+234 800 CHIN CHIN</li>
                            <li>Lagos, Nigeria</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-4">Follow Us</h4>
                        <div className="flex gap-4">
                            <a href="#" className="bg-stone-800 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-all">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="bg-stone-800 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-all">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="bg-stone-800 p-2 rounded-full hover:bg-orange-600 hover:text-white transition-all">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-stone-800 text-center text-sm text-stone-500">
                    <p>&copy; {new Date().getFullYear()} Chin-Chin Brand. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
