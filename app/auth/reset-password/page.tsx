"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { authAPI } from "@/lib/api/endpoints/auth";
import { resetPasswordSchema, ResetPasswordFormData } from "@/lib/validations/auth";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    useEffect(() => {
        if (!token) {
            setError("Reset token is missing. Please check your email link.");
        }
    }, [token]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) return;

        setIsLoading(true);
        setError(null);
        try {
            await authAPI.resetPassword(token, {
                new_password: data.new_password,
                confirm_password: data.confirm_password,
            });
            setIsSuccess(true);
            // Auto redirect after 3 seconds
            setTimeout(() => {
                router.push("/auth/login");
            }, 3000);
        } catch (err: any) {
            console.error("Reset password error:", err);
            setError(err.response?.data?.message || "Failed to reset password. The link may be expired.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="border-white/40 bg-white/60 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-2">
                <div className="w-16 h-16 relative mx-auto bg-white/50 rounded-2xl p-3 shadow-inner">
                    <Image src="/assets/logo/Icon - Deep Teal.svg" alt="Logo" fill className="object-contain p-2" />
                </div>
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-deep-teal">
                        {isSuccess ? "Password Updated" : "Set New Password"}
                    </CardTitle>
                    <CardDescription>
                        {isSuccess
                            ? "Your password has been changed successfully. Redirecting to login..."
                            : "Please enter your new password below to secure your account."}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent>
                {isSuccess ? (
                    <div className="text-center py-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                            className="w-16 h-16 bg-mint-green/20 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle2 className="w-10 h-10 text-deep-teal" />
                        </motion.div>
                        <Button asChild className="bg-deep-teal hover:bg-deep-teal/90 h-11 px-8">
                            <Link href="/auth/login">Go to Login Now</Link>
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new_password">New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="new_password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("new_password")}
                                        className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11 pl-10"
                                        disabled={!token}
                                    />
                                </div>
                                {errors.new_password && (
                                    <p className="text-sm text-red-500">{errors.new_password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm_password">Confirm New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="confirm_password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("confirm_password")}
                                        className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11 pl-10"
                                        disabled={!token}
                                    />
                                </div>
                                {errors.confirm_password && (
                                    <p className="text-sm text-red-500">{errors.confirm_password.message}</p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-deep-teal hover:bg-deep-teal/90 shadow-lg shadow-deep-teal/25 text-base"
                            disabled={isLoading || !token}
                        >
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Reset Password
                        </Button>
                    </form>
                )}
            </CardContent>

            <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
                <p className="text-sm text-muted-foreground">
                    Need help? <Link href="#" className="text-deep-teal font-medium hover:underline">Contact Support</Link>
                </p>
            </CardFooter>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-cream">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-deep-teal/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-mint-green/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg px-4 relative z-10"
            >
                <Suspense fallback={
                    <Card className="border-white/40 bg-white/60 backdrop-blur-xl shadow-2xl p-10 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-deep-teal" />
                    </Card>
                }>
                    <ResetPasswordForm />
                </Suspense>
            </motion.div>
        </div>
    );
}
