"use client";

import { UserAuthForm } from "@/components/auth/user-auth-form";
import { useSearchParams } from "next/navigation";
import { Leaf } from "lucide-react";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') === 'marketman' ? 'marketman' : 'farmer';

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
       <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
                backgroundImage: `url(https://picsum.photos/seed/loginpage/1200/1600)`,
            }}
          />
           <div className="relative z-20 flex items-center text-lg font-medium">
             <Leaf className="mr-2 h-8 w-8" />
             <span className="font-headline text-3xl">AgriConnect</span>
           </div>
           <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2 bg-black/50 p-4 rounded-lg">
              <p className="text-lg">
                &ldquo;This platform has revolutionized the way I sell my produce. Direct access to marketmen and fair pricing is a game changer.&rdquo;
              </p>
              <footer className="text-sm">A Happy Farmer</footer>
            </blockquote>
          </div>
       </div>
       <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight font-headline">
              {role === 'farmer' ? "Farmer" : "Marketman"} Portal
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details to access your dashboard
            </p>
          </div>
          <UserAuthForm role={role} />
        </div>
      </div>
    </div>
  );
}
