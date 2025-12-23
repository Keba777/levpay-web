"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonalInfoData, personalInfoSchema } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PersonalInfoStepProps {
  onNext: (data: PersonalInfoData) => void;
  defaultValues?: PersonalInfoData;
}

export function PersonalInfoStep({ onNext, defaultValues }: PersonalInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-deep-teal mb-2">Let's get started</h2>
        <p className="text-gray-600">Tell us a bit about yourself</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First name</Label>
          <Input
            id="first_name"
            {...register("first_name")}
            className="bg-white/50"
            placeholder="John"
          />
          {errors.first_name && (
            <p className="text-sm text-red-500">{errors.first_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Last name</Label>
          <Input
            id="last_name"
            {...register("last_name")}
            className="bg-white/50"
            placeholder="Doe"
          />
          {errors.last_name && (
            <p className="text-sm text-red-500">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="bg-white/50"
          placeholder="john@example.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full h-12 bg-deep-teal hover:bg-deep-teal/90">
        Continue
      </Button>
    </form>
  );
}
