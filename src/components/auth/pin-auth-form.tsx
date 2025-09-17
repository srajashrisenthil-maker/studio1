"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/hooks/use-app";
import { UserRole } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PinAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  role: UserRole;
}

const formSchema = z.object({
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
  pin: z.string().regex(/^\d{4}$/, "PIN must be 4 digits."),
});

type FormData = z.infer<typeof formSchema>;

export function PinAuthForm({ className, role, ...props }: PinAuthFormProps) {
  const { loginWithPin } = useApp();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    
    setTimeout(() => {
      const success = loginWithPin(data.phone, data.pin);
      if (!success) {
        toast({
            variant: "destructive",
            title: "Login Failed",
            description: "Invalid phone number or PIN. Please try again.",
        });
      }
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="10-digit mobile number"
              type="tel"
              autoComplete="tel"
              disabled={isLoading}
              {...register("phone")}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="pin">4-Digit PIN</Label>
            <Input
              id="pin"
              placeholder="e.g. 1234"
              type="password"
              maxLength={4}
              autoComplete="current-password"
              disabled={isLoading}
              {...register("pin")}
            />
            {errors.pin && <p className="text-sm text-destructive">{errors.pin.message}</p>}
          </div>
          
          <Button disabled={isLoading} className="mt-2">
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </div>
      </form>
    </div>
  );
}
