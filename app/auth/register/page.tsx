"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PersonalInfoStep } from "@/components/auth/registration-steps/personal-info";
import { AccountDetailsStep } from "@/components/auth/registration-steps/account-details";
import { VerificationStep } from "@/components/auth/registration-steps/verification";
import { GoogleOAuthButton } from "@/components/auth/oauth-buttons";
import { authAPI } from "@/lib/api/endpoints/auth";
import { useAuthStore } from "@/lib/store/auth-store";
import { PersonalInfoData, AccountDetailsData, VerificationData } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PersonalInfoData & AccountDetailsData & VerificationData>>({});

  const handlePersonalInfo = (data: PersonalInfoData) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleAccountDetails = (data: AccountDetailsData) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleVerification = async (data: VerificationData) => {
    setIsLoading(true);
    try {
      const completeData = { ...formData, ...data };
      const response = await authAPI.register(completeData as any);

      // Store auth data
      setTokens(response.access_token, response.refresh_token);
      setUser(response.user);

      // Redirect based on role
      if (response.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, label: "Personal" },
    { number: 2, label: "Security" },
    { number: 3, label: "Verify" },
  ];

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

      {/* Registration Card */}
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
              <CardTitle className="text-2xl font-bold text-deep-teal">Create your account</CardTitle>
              <p className="text-sm text-gray-600">Step {currentStep} of 3</p>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center gap-2 pt-2">
              {steps.map((step) => (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                      currentStep >= step.number
                        ? "bg-deep-teal text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {step.number}
                  </div>
                  {step.number < 3 && (
                    <div
                      className={`w-12 h-1 mx-1 rounded transition-all ${
                        currentStep > step.number ? "bg-deep-teal" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentStep === 1 && (
                  <PersonalInfoStep
                    onNext={handlePersonalInfo}
                    defaultValues={formData as PersonalInfoData}
                  />
                )}
                {currentStep === 2 && (
                  <AccountDetailsStep
                    onNext={handleAccountDetails}
                    onBack={() => setCurrentStep(1)}
                    defaultValues={formData as AccountDetailsData}
                  />
                )}
                {currentStep === 3 && (
                  <VerificationStep
                    onSubmit={handleVerification}
                    onBack={() => setCurrentStep(2)}
                    isLoading={isLoading}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {currentStep === 1 && (
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
            )}
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
