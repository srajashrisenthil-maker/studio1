"use client";

import { Header } from "@/components/shared/header";
import { useApp } from "@/hooks/use-app";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ProductUploadDialog } from "@/components/farmer/product-upload-dialog";
import { MyProducts } from "@/components/farmer/my-products";

export default function FarmerDashboard() {
  const { user } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login?role=farmer");
    } else if (user.role !== 'farmer') {
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Welcome, {user.name}!
            </h1>
            <p className="text-muted-foreground">
              Manage your products and view sales.
            </p>
          </div>
           <ProductUploadDialog>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-4 w-4" />
                Add Product
              </Button>
            </ProductUploadDialog>
        </div>
        <MyProducts />
      </main>
    </div>
  );
}
