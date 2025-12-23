"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccountDetailsData, accountDetailsSchema } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";

interface AccountDetailsStepProps {
  onNext: (data: AccountDetailsData) => void;
  onBack: () => void;
  defaultValues?: AccountDetailsData;
}

export function AccountDetailsStep({ onNext, onBack, defaultValues }: AccountDetailsStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AccountDetailsData>({
    resolver: zodResolver(accountDetailsSchema),
    defaultValues,
  });

  const password = watch("password");

  const requirements = [
    { label: "At least 8 characters", met: password?.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password || "") },
    { label: "One lowercase letter", met: /[a-z]/.test(password || "") },
    { label: "One number", met: /[0-9]/.test(password || "") },
  ];

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-deep-teal mb-2">Secure your account</h2>
        <p className="text-gray-600">Create a strong password</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          className="bg-white/50"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirm password</Label>
        <Input
          id="confirm_password"
          type="password"
          {...register("confirm_password")}
          className="bg-white/50"
        />
        {errors.confirm_password && (
          <p className="text-sm text-red-500">{errors.confirm_password.message}</p>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-gray-700">Password requirements:</p>
        {requirements.map((req, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            {req.met ? (
              <CheckCircle2 className="w-4 h-4 text-mint-green" />
            ) : (
              <Circle className="w-4 h-4 text-gray-300" />
            )}
            <span className={req.met ? "text-gray-700" : "text-gray-400"}>
              {req.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12"
        >
          Back
        </Button>
        <Button type="submit" className="flex-1 h-12 bg-deep-teal hover:bg-deep-teal/90">
          Continue
        </Button>
      </div>
    </form>
  );
}
