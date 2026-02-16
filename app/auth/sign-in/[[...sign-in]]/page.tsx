"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/auth/auth-button";

export default function SignInPage() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    // Handle the submission of the sign-in form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);
        setError("");

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            } else {
                // Use the proper type for console.log or handling
                console.error("Sign in failed", result);
                setError("Something went wrong. Please try again.");
            }
        } catch (err: any) {
            console.error("error", err.errors[0].longMessage);
            setError(err.errors[0]?.longMessage || "Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center w-full">
            <AuthCard
                title="Welcome Back"
                subtitle="Sign in to your account to continue"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <AuthInput
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />

                    <div className="space-y-2">
                        <AuthInput
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                        <div className="flex justify-end">
                            <Link
                                href="/auth/forgot-password"
                                className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <AuthButton type="submit" isLoading={isLoading}>
                        Sign In
                    </AuthButton>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-amber-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-amber-900/40">
                                Or
                            </span>
                        </div>
                    </div>

                    <div className="text-center text-sm text-amber-900/70">
                        Don&apos;t have an account?{" "}
                        <Link href="/auth/sign-up" className="font-semibold text-orange-600 hover:text-orange-700 hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </AuthCard>
        </div>
    );
}
