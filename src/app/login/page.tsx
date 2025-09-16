"use client";

import { Suspense } from 'react';
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { useSearchParams } from "next/navigation";
import { Leaf, Store } from "lucide-react";
import { useLanguage } from '@/hooks/use-language';

function Login() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') === 'marketman' ? 'marketman' : 'farmer';
  const { getTranslation } = useLanguage();

  const farmerQuote = {
    text: getTranslation('login-farmer-quote'),
    author: getTranslation('login-farmer-author')
  };

  const marketmanQuote = {
    text: getTranslation('login-marketman-quote'),
    author: getTranslation('login-marketman-author')
  };

  return (
    <>
      {role === 'farmer' && (
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
           <div className="relative z-20 flex items-center text-lg font-medium">
             <Leaf className="mr-2 h-8 w-8" />
             <span className="font-headline text-3xl">AGROW</span>
           </div>
           <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2 bg-black/50 p-4 rounded-lg">
              <p className="text-lg">
                &ldquo;{farmerQuote.text}&rdquo;
              </p>
              <footer className="text-sm">{farmerQuote.author}</footer>
            </blockquote>
          </div>
       </div>
      )}

      <div className="lg:p-8 flex items-center h-screen">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
             <div className="mx-auto bg-primary text-primary-foreground rounded-full p-4 w-fit mb-4">
                {role === 'farmer' ? <Leaf className="h-10 w-10" /> : <Store className="h-10 w-10" />}
              </div>
            <h1 className="text-2xl font-semibold tracking-tight font-headline">
              {role === 'farmer' ? getTranslation('login-farmer-portal') : getTranslation('login-marketman-portal')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {getTranslation('login-enter-details-prompt')}
            </p>
          </div>
          <UserAuthForm role={role} />
           {role === 'marketman' && (
            <blockquote className="space-y-2 text-center text-sm mt-8">
                <p className="text-lg">
                  &ldquo;{marketmanQuote.text}&rdquo;
                </p>
                <footer className="text-sm text-muted-foreground">{marketmanQuote.author}</footer>
              </blockquote>
           )}
        </div>
      </div>
    </>
  );
}


function LoginPageContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') === 'marketman' ? 'marketman' : 'farmer';
  const gridColsClass = role === 'farmer' ? 'lg:grid-cols-2' : 'lg:grid-cols-1';

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
