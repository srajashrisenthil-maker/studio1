"use client";

import { Suspense, useState } from 'react';
import { UserAuthForm } from "@/components/auth/user-auth-form";
import { useSearchParams } from "next/navigation";
import { Leaf, Store } from "lucide-react";
import { useLanguage } from '@/hooks/use-language';
import { PinAuthForm } from '@/components/auth/pin-auth-form';
import { Button } from '@/components/ui/button';

function Login() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role') === 'marketman' ? 'marketman' : 'farmer';
  const { getTranslation } = useLanguage();
  const [isReturningUser, setIsReturningUser] = useState(false);

  const marketmanQuote = {
    text: getTranslation('login-marketman-quote'),
    author: getTranslation('login-marketman-author')
  };

  return (
    <>
      <div className="lg:p-8 flex items-center h-screen">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
             <div className="mx-auto bg-primary text-primary-foreground rounded-full p-4 w-fit mb-4">
                {role === 'farmer' ? <Leaf className="h-10 w-10" /> : <Store className="h-10 w-10" />}
              </div>
            <h1 className="text-2xl font-semibold tracking-tight font-headline">
              {isReturningUser 
                ? `Welcome Back ${role === 'farmer' ? 'Farmer' : 'Marketman'}`
                : role === 'farmer' ? getTranslation('login-farmer-portal') : getTranslation('login-marketman-portal')
              }
            </h1>
            <p className="text-sm text-muted-foreground">
              {isReturningUser 
                ? "Enter your phone and 4-digit PIN to login."
                : getTranslation('login-enter-details-prompt')
              }
            </p>
          </div>
          
          {isReturningUser ? <PinAuthForm role={role} /> : <UserAuthForm role={role} />}

          <Button variant="link" onClick={() => setIsReturningUser(!isReturningUser)}>
            {isReturningUser ? "New user? Register here." : "Already have an account? Login with PIN."}
          </Button>

           {role === 'marketman' && !isReturningUser && (
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
  return (
    <div className={`container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0`}>
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
