

"use client";

import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthButton } from "@/components/auth/auth-button";
import { ArrowLeft, Timer } from "lucide-react";
import { toast } from "sonner";

export default function SignInPage() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const router = useRouter();

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");

    // UI State
    const [stage, setStage] = useState<"credentials" | "verify">("credentials");

    const [isLoading, setIsLoading] = useState(false);

    // Resend Timer State
    const [resendCooldown, setResendCooldown] = useState(0);
    const cooldownRef = useRef<NodeJS.Timeout | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input on stage change
    useEffect(() => {
        if (stage === "verify") {
            inputRef.current?.focus();
            startCooldown(30); // Auto-start cooldown on entering verify stage
        }
    }, [stage]);

    // Timer logic
    useEffect(() => {
        if (resendCooldown > 0) {
            cooldownRef.current = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        }
        return () => {
            if (cooldownRef.current) clearTimeout(cooldownRef.current);
        };
    }, [resendCooldown]);

    const startCooldown = (seconds: number) => {
        setResendCooldown(seconds);
    };

    // Handle initial credentials submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        setIsLoading(true);

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
                return;
            }

            if (result.status === "needs_second_factor") {
                await signIn.prepareSecondFactor({
                    strategy: "email_code",
                });
                setStage("verify");
                toast.success("Verification code sent to your email.");
            } else {
                toast.error("Unexpected authentication status. Please try again.");
            }

        } catch (err: any) {
            console.error("Sign in error:", err);
            // Translate common Clerk errors to user-friendly messages
            const errorCode = err.errors?.[0]?.code;
            const errorMessage = err.errors?.[0]?.longMessage;

            if (errorCode === "form_password_incorrect") {
                toast.error("Incorrect password. Please try again.");
            } else if (errorCode === "form_identifier_not_found") {
                toast.error("No account found with this email address.");
            } else {
                toast.error(errorMessage || "Unable to sign in. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle verification code submission
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;

        if (code.length !== 6) {
            toast.error("Please enter a valid 6-digit code.");
            return;
        }

        setIsLoading(true);

        try {
            const result = await signIn.attemptSecondFactor({
                strategy: "email_code",
                code,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            } else {
                toast.error("Verification incomplete. Please try again.");
            }
        } catch (err: any) {
            const errorCode = err.errors?.[0]?.code;
            if (errorCode === "verification_code_invalid") {
                toast.error("Invalid verification code.");
            } else if (errorCode === "verification_code_expired") {
                toast.error("Verification code has expired. Please request a new one.");
            } else {
                toast.error("Verification failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!isLoaded || resendCooldown > 0) return;

        try {
            await signIn?.prepareSecondFactor({
                strategy: "email_code",
            });
            startCooldown(60);
            toast.success("Code sent to your email!");
            // Optional: Show success toast/message "Code resent!"
        } catch (err) {
            toast.error("Failed to resend code. Please try again later.");
        }
    };

    // Reset flow to change email
    const handleBack = () => {
        setStage("credentials");

        setPassword(""); // Security best practice
        setCode("");
    };

    return (
        <div className="flex justify-center w-full">
            <AuthCard
                title={stage === "credentials" ? "Welcome Back" : "Verify It's You"}
                subtitle={stage === "credentials"
                    ? "Sign in to your account to continue"
                    : `We sent a code to ${email}`}
            >
                <form onSubmit={stage === "credentials" ? handleSubmit : handleVerify} className="space-y-6">



                    {stage === "credentials" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <AuthInput
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                disabled={isLoading}
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
                                    disabled={isLoading}
                                />
                                <div className="flex justify-end">
                                    <Link
                                        href="/auth/forgot-password"
                                        className="text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>

                            <AuthButton type="submit" isLoading={isLoading} className="mt-2">
                                Sign In
                            </AuthButton>
                        </div>
                    )}

                    {stage === "verify" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-2">
                                <label htmlFor="code" className="sr-only">Verification Code</label>
                                <div className="relative">
                                    <input
                                        id="code"
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={6}
                                        value={code}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, '');
                                            setCode(val);
                                        }}
                                        className="w-full text-center tracking-[0.5em] text-3xl font-bold rounded-xl border-2 border-amber-200 py-4 focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-amber-950 placeholder:text-amber-900/10 bg-white"
                                        placeholder="000000"
                                        autoComplete="one-time-code"
                                        required
                                        disabled={isLoading}
                                        ref={inputRef}
                                    />
                                    {/* Visual helper for letter spacing */}
                                    <div className="absolute inset-0 pointer-events-none flex justify-center items-center gap-[0.52em] opacity-0">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="w-4 h-8 bg-red-500/20"></div>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-center text-muted-foreground">
                                    Enter the 6-digit code from your email.
                                </p>
                            </div>

                            <AuthButton type="submit" isLoading={isLoading}>
                                Verify & Continue
                            </AuthButton>

                            <div className="flex items-center justify-between text-sm pt-2">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                                    disabled={isLoading}
                                >
                                    <ArrowLeft className="mr-1 h-3 w-3" />
                                    Change Email
                                </button>

                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendCooldown > 0 || isLoading}
                                    className="font-medium text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                                >
                                    {resendCooldown > 0 ? (
                                        <>
                                            <Timer className="mr-1 h-3 w-3 animate-pulse" />
                                            Resend in {resendCooldown}s
                                        </>
                                    ) : (
                                        "Resend Code"
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {stage === "credentials" && (
                        <div className="relative mt-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-amber-100" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-amber-900/40 font-medium">
                                    Or
                                </span>
                            </div>
                        </div>
                    )}

                    {stage === "credentials" && (
                        <div className="text-center text-sm text-amber-900/70 mt-6">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/sign-up" className="font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-colors">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </form>
            </AuthCard>
        </div>
    );
}
