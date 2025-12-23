"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerificationData, verificationSchema } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useState } from "react";

interface VerificationStepProps {
  onSubmit: (data: VerificationData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function VerificationStep({ onSubmit, onBack, isLoading }: VerificationStepProps) {
  const [enable2FA, setEnable2FA] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationData>({
    resolver: zodResolver(verificationSchema),
  });

  const onFormSubmit = (data: VerificationData) => {
    onSubmit({ ...data, enable_2fa: enable2FA });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-deep-teal mb-2">Almost there!</h2>
        <p className="text-gray-600">Optional: Add extra security</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone number (optional)</Label>
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          className="bg-white/50"
          placeholder="+1 (555) 000-0000"
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      <div
        className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
          enable2FA
            ? "border-deep-teal bg-deep-teal/5"
            : "border-gray-200 hover:border-gray-300"
        }`}
        onClick={() => setEnable2FA(!enable2FA)}
      >
        <div className="flex items-start gap-3">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
            enable2FA ? "border-deep-teal bg-deep-teal" : "border-gray-300"
          }`}>
            {enable2FA && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-deep-teal" />
              <span className="font-semibold text-gray-900">Enable Two-Factor Authentication</span>
            </div>
            <p className="text-sm text-gray-600">
              Add an extra layer of security to your account. You'll receive a code via SMS when logging in.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12"
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 h-12 bg-deep-teal hover:bg-deep-teal/90"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </div>
    </form>
  );
}
