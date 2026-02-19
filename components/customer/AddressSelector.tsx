"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAddressStore } from "@/store/use-address-store";
import { MapPin, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressForm } from "./AddressForm";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export function AddressSelector() {
    const { selectedAddressId, selectAddress } = useAddressStore(); // Keep selection state local for now
    const [mounted, setMounted] = useState(false);
    const { user } = useUser();

    const addresses = useQuery(api.addresses.get, user ? { userId: user.id } : "skip") || [];
    const removeAddress = useMutation(api.addresses.remove);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRemove = async (addressId: string) => {
        if (!user) return;
        try {
            await removeAddress({ userId: user.id, addressId: addressId as Id<"addresses"> });
            toast.success("Address removed");
            // If the removed address was selected, clear selection (optional/logic dependent)
            if (selectedAddressId === addressId) {
                selectAddress('');
            }
        } catch (error) {
            toast.error("Failed to remove address");
        }
    };

    if (!mounted) return null;

    return (
        <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg font-semibold">Delivery Address</CardTitle>
                <AddressForm />
            </CardHeader>
            <CardContent>
                {/* Show loader if user is logged in but addresses not loaded yet? 
                    For now, treating undefined as empty array from useQuery default above handles basic case 
                */}
                {addresses.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                        <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No addresses saved yet.</p>
                        <p>Add an address to proceed with checkout.</p>
                    </div>
                ) : (
                    <RadioGroup
                        value={selectedAddressId || ""}
                        onValueChange={selectAddress}
                        className="grid gap-4"
                    >
                        {addresses.map((address) => (
                            <div
                                key={address._id}
                                className={cn(
                                    "relative flex items-start space-x-3 rounded-lg border p-4 transition-all hover:bg-secondary/10",
                                    selectedAddressId === address._id
                                        ? "border-primary bg-secondary/20 shadow-sm"
                                        : "border-border/50"
                                )}
                            >
                                <RadioGroupItem value={address._id} id={address._id} className="mt-1" />
                                <div className="flex-1 space-y-1">
                                    <Label
                                        htmlFor={address._id}
                                        className="font-medium cursor-pointer flex items-center gap-2"
                                    >
                                        {address.label}
                                        {selectedAddressId === address._id && (
                                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                                Selected
                                            </span>
                                        )}
                                    </Label>
                                    <div className="text-sm text-muted-foreground grid gap-0.5 cursor-pointer" onClick={() => selectAddress(address._id)}>
                                        <p className="font-medium text-foreground">{address.name}</p>
                                        <p>{address.street}</p>
                                        <p>
                                            {address.city}, {address.state}
                                        </p>
                                        <p>{address.phone}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive absolute top-2 right-2 h-8 w-8"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleRemove(address._id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </RadioGroup>
                )}
            </CardContent>
        </Card>
    );
}
