"use client";

import { Suspense } from 'react';
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { useSearchParams } from "next/navigation";
import { Leaf, Store } from "lucide-react";

function Login() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') === 'marketman' ? 'marketman' : 'farmer';

  const farmerImage = "https://i.ibb.co/yYyVz3D/pexels-greta-hoffman-7722731.jpg";
  
  const farmerQuote = {
    text: "This platform has revolutionized the way I sell my produce. Direct access to marketmen and fair pricing is a game changer.",
    author: "A Happy Farmer"
  };

  const marketmanQuote = {
    text: "Sourcing fresh produce has never been easier. The quality is top-notch, and the direct connection with farmers is invaluable.",
    author: "A Satisfied Marketman"
  };

  const currentQuote = role === 'marketman' ? marketmanQuote : farmerQuote;


  return (
    <>
      {role === 'farmer' ? (
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
                backgroundImage: `url(${farmerImage})`,
            }}
          />
           <div className="relative z-20 flex items-center text-lg font-medium">
             <Leaf className="mr-2 h-8 w-8" />
             <span className="font-headline text-3xl">AGROW</span>
           </div>
           <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2 bg-black/50 p-4 rounded-lg">
              <p className="text-lg">
                &ldquo;{currentQuote.text}&rdquo;
              </p>
              <footer className="text-sm">{currentQuote.author}</footer>
            </blockquote>
          </div>
       </div>
      ) : (
         <div className="hidden lg:flex items-center justify-center p-10 bg-muted">
            <div className="relative z-20 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg">
                  &ldquo;{currentQuote.text}&rdquo;
                </p>
                <footer className="text-sm">{currentQuote.author}</footer>
              </blockquote>
            </div>
         </div>
      )}

      <div className="lg:p-8 flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
             <div className="mx-auto bg-primary text-primary-foreground rounded-full p-4 w-fit mb-4">
                {role === 'farmer' ? <Leaf className="h-10 w-10" /> : <Store className="h-10 w-10" />}
              </div>
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
    </>
  );
}


function LoginPageContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') === 'marketman' ? 'marketman' : 'farmer';
  const gridColsClass = role === 'farmer' ? 'lg:grid-cols-2' : 'lg:grid-cols-2';

  return (
    <div className={`container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none ${gridColsClass} lg:px-0`}>
        <Login />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
