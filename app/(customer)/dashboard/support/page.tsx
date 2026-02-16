"use client";

import { Phone, Mail, MessageCircle, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FAQS = [
    {
        question: "How long does delivery take?",
        answer: "We typically deliver within 24-48 hours within Lagos. For other states, it may take 3-5 business days.",
    },
    {
        question: "Is there a minimum order quantity?",
        answer: "No, you can order as little as one pack! However, delivery fees apply regardless of order size.",
    },
    {
        question: "Do you offer bulk discounts for events?",
        answer: "Yes! For orders above 50 packs, please contact our support team directly for special pricing.",
    },
    {
        question: "Can I customize the sweetness level?",
        answer: "Currently, we offer standard sweetness levels. However, for bulk orders, we can discuss customization options.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept bank transfers and card payments via our secure payment partners.",
    },
];

export default function SupportPage() {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 pb-24 space-y-12">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold tracking-tight mb-4">How can we help?</h1>
                <p className="text-muted-foreground text-lg">
                    Have a question or need assistance with your order? We're here for you.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <Card className="hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-primary" /> Call Us
                        </CardTitle>
                        <CardDescription>Mon-Fri from 8am to 5pm</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold text-lg">+234 800 CHINCHIN</p>
                        <Button variant="link" className="px-0 h-auto mt-2" asChild>
                            <a href="tel:+23480024462446">Call now</a>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:border-green-500/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-green-500" /> WhatsApp
                        </CardTitle>
                        <CardDescription>Chat with our support team</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold text-lg">Online</p>
                        <Button variant="link" className="px-0 h-auto mt-2 text-green-600" asChild>
                            <a href="https://wa.me/23480024462446" target="_blank" rel="noreferrer">Open Chat</a>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:border-blue-500/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-blue-500" /> Email Us
                        </CardTitle>
                        <CardDescription>We'll respond within 24 hours</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold text-lg">hello@chinchin.com</p>
                        <Button variant="link" className="px-0 h-auto mt-2 text-blue-600" asChild>
                            <a href="mailto:hello@chinchin.com">Send Email</a>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-2 mb-6">
                    <HelpCircle className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {FAQS.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-medium text-lg">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
