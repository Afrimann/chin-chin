"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
    value: number;
    onIncrease: () => void;
    onDecrease: () => void;
    min?: number;
    max?: number;
    className?: string;
}

export function QuantityStepper({
    value,
    onIncrease,
    onDecrease,
    min = 1,
    max = 99,
    className,
}: QuantityStepperProps) {
    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onDecrease}
                disabled={value <= min}
            >
                <Minus className="h-3 w-3" />
                <span className="sr-only">Decrease quantity</span>
            </Button>
            <span className="w-8 text-center text-sm font-medium">{value}</span>
            <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={onIncrease}
                disabled={value >= max}
            >
                <Plus className="h-3 w-3" />
                <span className="sr-only">Increase quantity</span>
            </Button>
        </div>
    );
}
