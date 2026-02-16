"use client";

import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthButton } from "@/components/auth/auth-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [verifying, setVerifying] = useState(false);
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Handle the submission of the sign-up form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError("");

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress: email,
                password,
            });

            // Send the email.
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

            setVerifying(true);
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors[0]?.longMessage || "Sign up failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle the submission of the verification form
    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError("");

        try {
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            if (completeSignUp.status !== "complete") {
                console.log(JSON.stringify(completeSignUp, null, 2));
                setError("Verification failed. Please try again.");
            }

            if (completeSignUp.status === "complete") {
                await setActive({ session: completeSignUp.createdSessionId });
                router.push("/dashboard");
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2));
            setError(err.errors[0]?.longMessage || "Verification failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (verifying) {
        return (
            <div className="flex justify-center w-full">
                <AuthCard title="Verify Exception" subtitle={`Enter the code sent to ${email}`}>
                    <form onSubmit={handleVerification} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-amber-900">Verification Code</Label>
                            <Input
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="123456"
                                className="text-center text-2xl tracking-widest h-14 border-amber-200 bg-orange-50/30 focus:ring-orange-500/20 focus:border-orange-500 rounded-xl"
                            />
                        </div>
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                                {error}
                            </div>
                        )}
                        <AuthButton type="submit" isLoading={isLoading}>
                            Verify Account
                        </AuthButton>
                    </form>
                </AuthCard>
            </div>
        );
    }

    return (
        <div className="flex justify-center w-full">
            <AuthCard
                title="Create Account"
                subtitle="Join for exclusive offers and rewards"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <AuthInput
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="John"
                            required
                        />
                        <AuthInput
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Doe"
                            required
                        />
                    </div>

                    <AuthInput
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        required
                        autoComplete="email"
                    />

                    <AuthInput
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        required
                        autoComplete="new-password"
                        minLength={8}
                    />

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div id="clerk-captcha"></div>

                    <div className="pt-2">
                        <AuthButton type="submit" isLoading={isLoading}>
                            Create Account
                        </AuthButton>
                    </div>

                    <div className="text-center text-sm text-amber-900/70 pt-2">
                        Already have an account?{" "}
                        <Link href="/auth/sign-in" className="font-semibold text-orange-600 hover:text-orange-700 hover:underline">
                            Sign In
                        </Link>
                    </div>
                </form>
            </AuthCard>
        </div>
    );
}
