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
import { Loader2, MapPin, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  role: UserRole;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  phone: z.string().regex(/^\d{10}$/, "Please enter a valid 10-digit phone number."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  profilePicture: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function UserAuthForm({ className, role, ...props }: UserAuthFormProps) {
  const { login } = useApp();
  const { toast } = useToast();
  const { getTranslation } = useLanguage();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLocating, setIsLocating] = React.useState<boolean>(false);
  const [location, setLocation] = React.useState<{ lat: number; lon: number } | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
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
            title: getTranslation('toast-location-captured-title'),
            description: getTranslation('toast-location-captured-description'),
          });
        },
        (error) => {
          console.error("Error getting location", error);
          toast({
            variant: "destructive",
            title: getTranslation('toast-location-error-title'),
            description: getTranslation('toast-location-error-description'),
          });
          setIsLocating(false);
        }
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: 'destructive',
          title: 'Image too large',
          description: 'Please upload an image smaller than 2MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setValue("profilePicture", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  async function onSubmit(data: FormData) {
    setIsLoading(true);
    if (!location) {
        toast({
            variant: "destructive",
            title: getTranslation('toast-location-required-title'),
            description: getTranslation('toast-location-required-description'),
        });
        setIsLoading(false);
        return;
    }
    
    setTimeout(() => {
      login({ ...data, role, location, profilePicture: imagePreview || undefined });
      setIsLoading(false);
    }, 1000);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{getTranslation('form-label-full-name')}</Label>
            <Input
              id="name"
              placeholder={getTranslation('form-placeholder-full-name')}
              type="text"
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
              {...register("name")}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

           {role === 'farmer' && (
            <div className="grid gap-2">
                <Label htmlFor="picture">Profile Picture</Label>
                 <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={imagePreview || undefined} alt="Profile preview" />
                        <AvatarFallback>
                            <Upload />
                        </AvatarFallback>
                    </Avatar>
                    <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} className="w-full" disabled={isLoading} />
                 </div>
            </div>
           )}

          <div className="grid gap-2">
            <Label htmlFor="phone">{getTranslation('form-label-phone-number')}</Label>
            <Input
              id="phone"
              placeholder={getTranslation('form-placeholder-phone-number')}
              type="tel"
              autoComplete="tel"
              disabled={isLoading}
              {...register("phone")}
            />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">{getTranslation('form-label-full-address')}</Label>
            <Input
              id="address"
              placeholder={getTranslation('form-placeholder-full-address')}
              type="text"
              autoComplete="street-address"
              disabled={isLoading}
              {...register("address")}
            />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>
           <div className="grid gap-2">
              <Label>{getTranslation('form-label-location')}</Label>
              <Button type="button" variant="outline" onClick={handleGetLocation} disabled={isLocating || isLoading}>
                  {isLocating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                  {location ? getTranslation('form-button-location-captured') : getTranslation('form-button-get-my-location')}
              </Button>
               {location && <p className="text-xs text-muted-foreground">Lat: {location.lat.toFixed(4)}, Lon: {location.lon.toFixed(4)}</p>}
           </div>
          <Button disabled={isLoading} className="mt-2">
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {getTranslation('form-button-enter-dashboard')}
          </Button>
        </div>
      </form>
    </div>
  );
}
