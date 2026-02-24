"use client";

import { useState, useRef, useEffect } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    MessageCircle,
    X,
    Send,
    Loader2,
    Bot,
    User,
    ChevronDown,
    Sparkles,
    ShoppingBag,
    Compass,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export function AIChatbot() {
    const router = useRouter();
    const { userId, isSignedIn } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content: "Hi! I'm your Chin-Chin assistant. Ask me anything about our snacks, ingredients, or your orders!"
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const chatAction = useAction(api.chat.sendMessage);
    const addToCartMutation = useMutation(api.carts.addItem);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const seen = localStorage.getItem("chinchin_ai_onboarding_seen");
        if (!seen && isOpen) {
            setShowOnboarding(true);
        }
    }, [isOpen]);

    const handleStartChat = () => {
        setShowOnboarding(false);
        localStorage.setItem("chinchin_ai_onboarding_seen", "true");
    };

    useEffect(() => {
        if (scrollRef.current && !showOnboarding) {
            const scrollContainer = scrollRef.current;
            // Use setTimeout to ensure the DOM has updated and animations have started/finished
            const timeoutId = setTimeout(() => {
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: "smooth"
                });
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [messages, isLoading, showOnboarding]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await chatAction({
                message: userMessage,
                history: messages.map(m => ({
                    role: m.role,
                    content: m.content || ""
                }))
            });

            const assistantReply = response.content || "I couldn't think of a reply right now 😅";
            setMessages(prev => [...prev, { role: "assistant", content: assistantReply }]);

            // Handle actions
            if (response.action?.type === "navigate") {
                const targetUrl = response.action.url;
                setTimeout(() => {
                    setIsOpen(false);
                    router.push(targetUrl);
                }, 1500);
            } else if (response.action?.type === "add_to_cart") {
                if (!isSignedIn) {
                    setMessages(prev => [...prev, {
                        role: "assistant",
                        content: "I'd love to add that to your cart, but you'll need to sign in first! Would you like me to take you to the login page?"
                    }]);
                    return;
                }

                try {
                    await addToCartMutation({
                        userId: userId!,
                        productId: response.action.productId as any,
                        quantity: response.action.quantity || 1
                    });
                    toast.success("Added to cart by AI");
                } catch (err) {
                    console.error("Mutation error:", err);
                    setMessages(prev => [...prev, {
                        role: "assistant",
                        content: "I tried to add the item to your cart but ran into a technical snag. Please try adding it manually!"
                    }]);
                }
            }
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: "I'm having a bit of trouble connecting right now. Please try again in a moment!"
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // For iOS/Mobile: prevent touch move events from bubbling to body
            const preventDefault = (e: TouchEvent) => {
                if (scrollRef.current && !scrollRef.current.contains(e.target as Node)) {
                    // e.preventDefault();
                }
            };
            document.addEventListener("touchmove", preventDefault, { passive: false });
            return () => {
                document.body.style.overflow = "";
                document.removeEventListener("touchmove", preventDefault);
            };
        }
    }, [isOpen]);

    return (
        <>
            {/* Chat Toggle Button */}
            <Button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-100 transition-all hover:scale-110",
                    isOpen && "scale-0 opacity-0"
                )}
            >
                <MessageCircle className="h-6 w-6" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop to capture outside clicks and prevent background scroll */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-90 md:bg-transparent md:backdrop-blur-0"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            onWheel={(e) => e.stopPropagation()}
                            className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[400px] h-full md:h-[600px] bg-card border shadow-2xl rounded-t-3xl md:rounded-3xl z-100 flex flex-col overflow-hidden touch-none"
                        >
                            {/* Header */}
                            <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="bg-white/20 p-2 rounded-xl">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Chin-Chin Guide</h3>
                                        <p className="text-[10px] opacity-80">AI Assistant • Online</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="hover:bg-white/20 text-primary-foreground"
                                >
                                    <ChevronDown className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-hidden relative flex flex-col bg-background">
                                <AnimatePresence mode="wait">
                                    {showOnboarding ? (
                                        <motion.div
                                            key="onboarding"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex-1 flex flex-col p-6 items-center text-center space-y-6 overflow-y-auto touch-pan-y"
                                        >
                                            <div className="relative pt-4">
                                                <div className="absolute -inset-4 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                                                <div className="relative bg-primary/10 p-5 rounded-3xl text-primary">
                                                    <Sparkles className="h-10 w-10" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h2 className="text-2xl font-bold tracking-tight">Meet Your Snack Sidekick</h2>
                                                <p className="text-muted-foreground text-sm px-4">
                                                    I'm the Chin-Chin Guide, here to make your experience as smooth as our snacks are crunchy.
                                                </p>
                                            </div>

                                            <div className="w-full space-y-3 pt-2">
                                                {[
                                                    {
                                                        icon: <Compass className="h-5 w-5" />,
                                                        title: "Find Your Flavor",
                                                        desc: "Ask about ingredients or get recommendations."
                                                    },
                                                    {
                                                        icon: <ShoppingBag className="h-5 w-5" />,
                                                        title: "Quick Navigation",
                                                        desc: "I can take you to your cart, orders, or shop instantly."
                                                    },
                                                    {
                                                        icon: <Zap className="h-5 w-5" />,
                                                        title: "Smart Commands",
                                                        desc: "Just type what you need and I'll handle the rest."
                                                    }
                                                ].map((feature, i) => (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.1 + 0.2 }}
                                                        key={i}
                                                        className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/20 text-left border border-transparent hover:border-primary/20 transition-colors"
                                                    >
                                                        <div className="bg-white p-2 rounded-xl shadow-sm text-primary shrink-0">
                                                            {feature.icon}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-xs">{feature.title}</h4>
                                                            <p className="text-[10px] text-muted-foreground leading-tight">{feature.desc}</p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <div className="pt-2 w-full mt-auto">
                                                <Button
                                                    onClick={handleStartChat}
                                                    className="w-full h-11 rounded-2xl group relative overflow-hidden"
                                                >
                                                    <span className="relative z-10 flex items-center gap-2">
                                                        Get Started
                                                        <ChevronDown className="h-4 w-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
                                                    </span>
                                                    <div className="absolute inset-0 bg-primary opacity-90 group-hover:opacity-100 transition-opacity" />
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="chat"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex-1 flex flex-col overflow-hidden"
                                        >
                                            {/* Messages Area */}
                                            <div
                                                ref={scrollRef}
                                                className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/5 scroll-smooth overscroll-contain touch-pan-y"
                                                onWheel={(e) => e.stopPropagation()}
                                            >
                                                {messages.map((m, i) => (
                                                    <div
                                                        key={i}
                                                        className={cn(
                                                            "flex gap-3 max-w-[88%]",
                                                            m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                                        )}
                                                    >
                                                        <div className={cn(
                                                            "h-8 w-8 rounded-full flex items-center justify-center shrink-0 border",
                                                            m.role === "assistant" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-transparent"
                                                        )}>
                                                            {m.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                                                        </div>
                                                        <div className={cn(
                                                            "p-3 rounded-2xl text-sm leading-relaxed",
                                                            m.role === "user"
                                                                ? "bg-primary text-primary-foreground rounded-tr-none shadow-md"
                                                                : "bg-white border rounded-tl-none text-card-foreground shadow-sm"
                                                        )}>
                                                            {m.content}
                                                        </div>
                                                    </div>
                                                ))}
                                                {isLoading && (
                                                    <div className="flex gap-3 mr-auto animate-pulse">
                                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                                            <Bot className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div className="bg-white border p-3 rounded-2xl rounded-tl-none shadow-sm">
                                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Input Area */}
                                            <div className="p-4 bg-background border-t shrink-0">
                                                <form
                                                    autoComplete="off"
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        handleSend();
                                                    }}
                                                    className="relative flex gap-2"
                                                >
                                                    <Input
                                                        value={input}
                                                        onChange={(e) => setInput(e.target.value)}
                                                        placeholder="Ask about flavors..."
                                                        className="pr-12 rounded-full bg-secondary/20 border-none focus-visible:ring-1 focus-visible:ring-primary h-10"
                                                    />
                                                    <Button
                                                        size="icon"
                                                        disabled={!input.trim() || isLoading}
                                                        className="shrink-0 rounded-full h-10 w-10 shadow-lg"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                                <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-widest font-medium opacity-50">
                                                    Powered by Chin-Chin AI
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
