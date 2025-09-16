"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { ShoppingCart, User } from "lucide-react";
import { useApp } from "@/hooks/use-app";
import { useToast } from "@/hooks/use-toast";
import { FarmerProfileDialog } from "./farmer-profile-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, getFarmerById } = useApp();
  const { toast } = useToast();
  const [isFarmerProfileOpen, setFarmerProfileOpen] = useState(false);
  const farmer = getFarmerById(product.farmerId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`
    })
  }

  const handleCardClick = () => {
    setFarmerProfileOpen(true);
  }

  return (
    <>
      <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg cursor-pointer" onClick={handleCardClick}>
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3] bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={product.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-1">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          {farmer && (
             <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Avatar className="h-6 w-6">
                    <AvatarImage src={farmer.profilePicture} alt={farmer.name} />
                    <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{farmer.name}</span>
            </div>
          )}
          <CardDescription className="mt-1 h-10 text-sm overflow-hidden text-ellipsis">
              {product.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="text-lg font-bold text-primary">
              {formatCurrency(product.price)}
              <span className="text-sm font-normal text-muted-foreground"> /kg</span>
          </div>
          <Button size="sm" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </CardFooter>
      </Card>
      <FarmerProfileDialog 
        isOpen={isFarmerProfileOpen}
        onOpenChange={setFarmerProfileOpen}
        farmerId={product.farmerId}
      />
    </>
  );
}
