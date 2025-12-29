"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { GoogleOAuthButton } from "@/components/auth/oauth-buttons";
import { authAPI } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { loginSchema, LoginFormData, twoFactorSchema, TwoFactorData } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser, setTokens } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: register2FA,
    handleSubmit: handleSubmit2FA,
    formState: { errors: errors2FA },
  } = useForm<TwoFactorData>({
    resolver: zodResolver(twoFactorSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(data);

      if (response.requires_2fa) {
        setRequires2FA(true);
        setUserEmail(data.email);
      } else {
        // Store auth data
        setTokens(response.access_token, response.refresh_token);
        setUser(response.user);

        // Redirect based on role
        const callbackUrl = searchParams.get("callbackUrl");
        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (response.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FAVerification = async (data: TwoFactorData) => {
    setIsLoading(true);
    try {
      const response = await authAPI.verify2FA({ ...data, email: userEmail });

      // Store auth data
      setTokens(response.access_token, response.refresh_token);
      setUser(response.user);

      // Redirect based on role
      const callbackUrl = searchParams.get("callbackUrl");
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (response.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("2FA verification error:", error);
      alert(error.response?.data?.message || "Invalid 2FA code. Please try again.");
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

      {/* Floating 3D Elements */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-24 h-24 bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl hidden lg:block z-0 rotate-12"
      />
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-deep-teal/40 to-deep-teal/10 backdrop-blur-md rounded-full border border-white/20 shadow-xl hidden lg:block z-0"
      />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4 relative z-10"
      >
        <Card className="border-white/40 bg-white/60 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-2">
            <motion.div
              initial={{ rotateY: 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-16 h-16 relative mx-auto bg-white/50 rounded-2xl p-3 shadow-inner"
            >
              <Image src="/assets/logo/Icon - Deep Teal.svg" alt="Logo" fill className="object-contain p-2" />
            </motion.div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold text-deep-teal">
                {requires2FA ? "Two-Factor Authentication" : "Welcome back"}
              </CardTitle>
              <CardDescription>
                {requires2FA
                  ? "Enter the 6-digit code sent to your device"
                  : "Enter your credentials to access your account"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {!requires2FA ? (
              <>
                <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      {...register("email")}
                      className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/auth/forgot-password" className="text-xs text-deep-teal font-medium hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember_me"
                      {...register("remember_me")}
                      className="w-4 h-4 rounded border-gray-300 text-deep-teal focus:ring-deep-teal"
                    />
                    <label htmlFor="remember_me" className="text-sm text-gray-700">
                      Remember me for 30 days
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-deep-teal hover:bg-deep-teal/90 shadow-lg shadow-deep-teal/25 text-base"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white/60 text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <GoogleOAuthButton />
                  </div>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit2FA(handle2FAVerification)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    {...register2FA("code")}
                    className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11 text-center text-2xl tracking-widest"
                  />
                  {errors2FA.code && (
                    <p className="text-sm text-red-500">{errors2FA.code.message}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRequires2FA(false)}
                    className="flex-1 h-11"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-deep-teal hover:bg-deep-teal/90"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Verify
                  </Button>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-deep-teal font-semibold hover:underline">
                Create account
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
