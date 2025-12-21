"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock Role Detection logic
    if (email.includes("admin")) {
        router.push("/admin");
    } else {
        router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-cream">
       {/* Background Elements */}
       <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-deep-teal/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-mint-green/30 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
       </div>

       {/* Floating 3D Elements (Simulated with CSS) */}
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
                    <CardTitle className="text-2xl font-bold text-deep-teal">Welcome back</CardTitle>
                    <CardDescription>Enter your credential to access your account</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="name@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link href="#" className="text-xs text-deep-teal font-medium hover:underline">Forgot password?</Link>
                        </div>
                        <Input 
                            id="password" 
                            type="password" 
                            required 
                            className="bg-white/50 border-gray-200 focus:bg-white transition-all h-11"
                        />
                    </div>
                    <Button type="submit" className="w-full h-11 bg-deep-teal hover:bg-deep-teal/90 shadow-lg shadow-deep-teal/25 text-base" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                </form>
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
