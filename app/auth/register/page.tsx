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

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-cream py-10">
       {/* Background Elements */}
       <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-sage/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-deep-teal/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2" />
       </div>

       {/* Floating 3D Elements */}
       <motion.div 
         initial={{ y: 0 }}
         animate={{ y: [0, -15, 0] }}
         transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
         className="absolute top-20 right-20 w-16 h-16 bg-gradient-to-br from-mint-green/40 to-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl hidden lg:block z-0 -rotate-12"
       />

       {/* Register Card */}
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.5 }}
         className="w-full max-w-lg px-4 relative z-10"
       >
         <Card className="border-white/40 bg-white/60 backdrop-blur-xl shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-2">
                <div className="w-12 h-12 relative mx-auto bg-white/50 rounded-xl p-2 shadow-sm">
                    <Image src="/assets/logo/Icon - Deep Teal.svg" alt="Logo" fill className="object-contain p-1" />
                </div>
                <div className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-deep-teal">Create an account</CardTitle>
                    <CardDescription>Start your journey with LevPay today</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input id="firstName" placeholder="John" required className="bg-white/50" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" placeholder="Doe" required className="bg-white/50" />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="name@example.com" required className="bg-white/50" />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required className="bg-white/50" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input id="confirmPassword" type="password" required className="bg-white/50" />
                    </div>

                    <Button type="submit" className="w-full h-11 bg-deep-teal hover:bg-deep-teal/90 shadow-lg shadow-deep-teal/25 mt-2" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Account
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
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
