"use client";

import { Header } from "@/components/shared/header";
import { useApp } from "@/hooks/use-app";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ProductGrid } from "@/components/marketman/product-grid";
import { Recommendations } from "@/components/marketman/recommendations";
import { Separator } from "@/components/ui/separator";

export default function MarketmanDashboard() {
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login?role=marketman");
    } else if (user.role !== 'marketman') {
        router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="flex items-center">
            <div>
              <h1 className="font-headline text-3xl font-bold tracking-tight">
                Welcome, {user.name}!
              </h1>
              <p className="text-muted-foreground">
                Browse fresh produce from local farmers.
              </p>
            </div>
        </div>

        <Recommendations />
        
        <Separator className="my-4" />

        <div>
            <h2 className="font-headline text-2xl font-bold tracking-tight mb-4">
                Available Products
            </h2>
            <ProductGrid />
        </div>

      </main>
    </div>
  );
}
