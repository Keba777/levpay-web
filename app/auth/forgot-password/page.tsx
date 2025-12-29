"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { authAPI } from "@/lib/api/endpoints/auth";
import { forgotPasswordSchema, ForgotPasswordFormData } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setError(null);
        try {
            await authAPI.forgotPassword(data.email);
            setIsSuccess(true);
        } catch (err: any) {
            console.error("Forgot password error:", err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

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
                className="w-full max-w-md px-4 relative z-10"
            >
                <Card className="border-white/40 bg-white/60 backdrop-blur-xl shadow-2xl">
                    <CardHeader className="text-center space-y-4 pb-2">
                        <Link href="/auth/login" className="absolute left-6 top-8 text-gray-500 hover:text-deep-teal transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div className="w-16 h-16 relative mx-auto bg-white/50 rounded-2xl p-3 shadow-inner">
                            <Image src="/assets/logo/Icon - Deep Teal.svg" alt="Logo" fill className="object-contain p-2" />
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold text-deep-teal">Forgot Password?</CardTitle>
                            <CardDescription>
                                Enter your email address and we'll send you a link to reset your password.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {!isSuccess ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                                        {error}
                                    </div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            {...register("email")}
                                            className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11 pl-10"
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-red-500">{errors.email.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-deep-teal hover:bg-deep-teal/90 shadow-lg shadow-deep-teal/25 text-base"
                                    disabled={isLoading}
                                >
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Reset Link
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center py-4 space-y-6">
                                <div className="w-16 h-16 bg-mint-green/20 rounded-full flex items-center justify-center mx-auto">
                                    <Mail className="w-8 h-8 text-deep-teal" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-semibold text-deep-teal">Check your email</h3>
                                    <p className="text-gray-600">
                                        We've sent a password reset link to your email address. Please check your inbox.
                                    </p>
                                </div>
                                <Button asChild variant="outline" className="w-full h-11 border-gray-200">
                                    <Link href="/auth/login">Return to Login</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
                        <p className="text-sm text-muted-foreground">
                            Remember your password?{" "}
                            <Link href="/auth/login" className="text-deep-teal font-semibold hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
