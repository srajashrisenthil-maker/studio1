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
import { Loader2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  role: UserRole;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
  address: z.string().min(5, "Address must be at least 5 characters."),
});

type FormData = z.infer<typeof formSchema>;

export function UserAuthForm({ className, role, ...props }: UserAuthFormProps) {
  const { login } = useApp();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLocating, setIsLocating] = React.useState<boolean>(false);
  const [location, setLocation] = React.useState<{ lat: number; lon: number } | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleGetLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          setIsLocating(false);
          toast({
            title: "Location Captured",
            description: "Your location has been successfully recorded.",
          });
        },
        (error) => {
          console.error("Error getting location", error);
          toast({
            variant: "destructive",
            title: "Location Error",
            description: "Could not get your location. Please check your browser settings.",
          });
          setIsLocating(false);
        }
      );
    }
  };

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    if (!location) {
        toast({
            variant: "destructive",
            title: "Location Required",
            description: "Please provide your location before proceeding.",
        });
        setIsLoading(false);
        return;
    }
    
    setTimeout(() => {
      login({ ...data, role, location });
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="e.g. Ram Singh"
              type="text"
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              {...register("name")}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
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
            <Label htmlFor="address">Full Address</Label>
            <Input
              id="address"
              placeholder="Your full address"
              type="text"
              autoComplete="street-address"
              disabled={isLoading}
              {...register("address")}
            />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>
           <div className="grid gap-2">
              <Label>Location</Label>
              <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating || isLoading}>
                  {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                  {location ? 'Location Captured!' : 'Get My Location'}
              </Button>
               {location && <p className="text-xs text-muted-foreground">Lat: {location.lat.toFixed(4)}, Lon: {location.lon.toFixed(4)}</p>}
           </div>
          <Button disabled={isLoading} className="mt-2">
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Enter Dashboard
          </Button>
        </div>
      </form>
    </div>
  );
}
