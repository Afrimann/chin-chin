"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { useAddressStore } from "@/store/use-address-store";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function AddressForm() {
    const { addAddress } = useAddressStore();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        label: "",
        name: "",
        street: "",
        city: "",
        state: "",
        phone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 500));

            const newAddress = {
                id: crypto.randomUUID(),
                ...form,
            };

            addAddress(newAddress);
            toast.success("Delivery address added successfully");
            setOpen(false);
            setForm({
                label: "",
                name: "",
                street: "",
                city: "",
                state: "",
                phone: "",
            });
        } catch (error) {
            toast.error("Failed to add address");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" /> Add New Address
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Delivery Address</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="label">Label (e.g. Home)</Label>
                            <Input
                                id="label"
                                placeholder="Home"
                                required
                                value={form.label}
                                onChange={(e) => setForm({ ...form, label: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Recipient Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                required
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="08012345678"
                            required
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input
                            id="street"
                            placeholder="123 Main St"
                            required
                            value={form.street}
                            onChange={(e) => setForm({ ...form, street: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                placeholder="Lagos"
                                required
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input
                                id="state"
                                placeholder="Lagos"
                                required
                                value={form.state}
                                onChange={(e) => setForm({ ...form, state: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Address"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
