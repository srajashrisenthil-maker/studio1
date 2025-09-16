"use client";
import { useEffect, useState } from "react";
import { ProductRecommendationsOutput, getProductRecommendations } from "@/ai/flows/product-recommendations-for-marketmen";
import { useApp } from "@/hooks/use-app";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Lightbulb, Loader2 } from "lucide-react";
import { ProductCard } from "./product-card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Skeleton } from "../ui/skeleton";

// Mock order history
const mockOrderHistory = [
    { productId: 'prod_1', quantity: 10, orderDate: '2024-05-01' },
    { productId: 'prod_2', quantity: 20, orderDate: '2024-05-03' },
    { productId: 'prod_1', quantity: 15, orderDate: '2024-05-10' },
];

export function Recommendations() {
    const { products } = useApp();
    const [recommendations, setRecommendations] = useState<ProductRecommendationsOutput | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (products.length === 0) {
            setIsLoading(false);
            return;
        }
        const fetchRecommendations = async () => {
            setIsLoading(true);
            try {
                const result = await getProductRecommendations({ 
                    orderHistory: mockOrderHistory,
                    availableProducts: products 
                });
                setRecommendations(result);
            } catch (error) {
                console.error("Failed to get recommendations:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecommendations();
    }, [products]);

    const recommendedProducts = recommendations?.recommendations.map(rec => {
        const product = products.find(p => p.id === rec.productId);
        return product ? { ...product, reason: rec.reason } : null;
    }).filter(Boolean);

    return (
        <div>
            <h2 className="font-headline text-2xl font-bold tracking-tight">
                For You
            </h2>
            <p className="text-muted-foreground mb-4">AI-powered recommendations based on your order history.</p>

            {isLoading && (
                 <div className="relative">
                    <Carousel opts={{ align: "start" }}>
                        <CarouselContent>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                        <Card>
                                            <CardContent className="flex flex-col aspect-square items-center justify-center p-6">
                                                <Skeleton className="w-full h-[150px] mb-4" />
                                                <Skeleton className="w-[80%] h-6 mb-2" />
                                                <Skeleton className="w-full h-4" />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            )}

            {!isLoading && recommendedProducts && recommendedProducts.length > 0 && (
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {recommendedProducts.map((p) => p && (
                            <CarouselItem key={p.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                <div className="p-1 h-full">
                                    <div className="flex flex-col h-full">
                                        <Alert className="mb-2 border-accent/50 bg-accent/10">
                                            <Lightbulb className="h-4 w-4 text-accent" />
                                            <AlertDescription className="text-accent-foreground text-xs">
                                                {p.reason}
                                            </AlertDescription>
                                        </Alert>
                                        <div className="flex-grow">
                                          <ProductCard product={p} />
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
            )}

            {!isLoading && (!recommendedProducts || recommendedProducts.length === 0) && (
                <Card>
                    <CardContent className="p-6">
                        <p className="text-muted-foreground">No recommendations available for you right now.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
