
"use client";

import { useApp } from "@/hooks/use-app";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/shared/header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Product } from "@/lib/types";
import { ProductCard } from "@/components/marketman/product-card";
import { Separator } from "@/components/ui/separator";
import { Users, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MyFarmersPage() {
    const { user, farmers, products } = useApp();
    const router = useRouter();
    const [selectedFarmer, setSelectedFarmer] = useState<User | null>(null);

    useEffect(() => {
        if (!user) {
            router.push('/login?role=marketman');
        } else if (user.role !== 'marketman') {
            router.push('/');
        }
    }, [user, router]);
    
    if (!user || user.role !== 'marketman') {
        return null;
    }

    const followedFarmers = farmers.filter(farmer => user.following?.includes(farmer.id));
    const productsFromSelectedFarmer = selectedFarmer ? products.filter(p => p.farmerId === selectedFarmer.id) : [];

    const handleFarmerClick = (farmer: User) => {
        if (selectedFarmer?.id === farmer.id) {
            setSelectedFarmer(null);
        } else {
            setSelectedFarmer(farmer);
        }
    };


    const renderFarmerList = () => (
        <div className="space-y-2">
            {followedFarmers.map(farmer => (
                 <Card key={farmer.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleFarmerClick(farmer)}>
                    <CardContent className="p-4 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={farmer.profilePicture} alt={farmer.name} />
                                <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{farmer.name}</p>
                                <p className="text-sm text-muted-foreground">{farmer.address}</p>
                            </div>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${selectedFarmer?.id === farmer.id ? 'transform rotate-90' : ''}`} />
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderSelectedFarmerProducts = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedFarmer!.profilePicture} alt={selectedFarmer!.name} />
                        <AvatarFallback>{selectedFarmer!.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-2xl font-bold font-headline">{selectedFarmer!.name}</h2>
                        <p className="text-muted-foreground">Showing {productsFromSelectedFarmer.length} products</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedFarmer(null)}>
                    <X className="h-5 w-5" />
                </Button>
            </div>
            <Separator />
            {productsFromSelectedFarmer.length > 0 ? (
                <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {productsFromSelectedFarmer.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-8">This farmer has no products listed.</p>
            )}
        </div>
    );

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8">
                {selectedFarmer ? (
                    renderSelectedFarmerProducts()
                ) : (
                    <>
                        <h1 className="font-headline text-3xl font-bold tracking-tight mb-4">My Followed Farmers</h1>
                        {followedFarmers.length > 0 ? (
                           renderFarmerList()
                        ) : (
                             <Card className="flex flex-col items-center justify-center py-20 text-center">
                                <Users className="h-16 w-16 text-muted-foreground" />
                                <h3 className="mt-4 text-xl font-semibold">You're not following any farmers yet</h3>
                                <p className="text-muted-foreground mt-2 max-w-sm">
                                    Follow farmers to see their profiles and products listed here. You can follow a farmer from their profile page.
                                </p>
                                <Button asChild className="mt-6" onClick={() => router.push('/marketman/dashboard')}>
                                   Browse Products
                                </Button>
                            </Card>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

