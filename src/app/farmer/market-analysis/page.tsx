
"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Header } from '@/components/shared/header';
import { useApp } from '@/hooks/use-app';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getMarketTrends, MarketTrendsOutput } from '@/ai/flows/market-trends';
import { Loader2, TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';


const chartConfig = {
  price: {
    label: "Price (INR)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

function MarketAnalysis() {
  const { user, products } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productIdFromUrl = searchParams.get('productId');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<MarketTrendsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login?role=farmer');
    } else if (user.role !== 'farmer') {
      router.push('/');
    }
  }, [user, router]);

  const farmerProducts = useMemo(() => products.filter(p => p.farmerId === user?.id), [products, user]);

  useEffect(() => {
    if (productIdFromUrl) {
      setSelectedProductId(productIdFromUrl);
    } else if (farmerProducts.length > 0 && !selectedProductId) {
      setSelectedProductId(farmerProducts[0].id);
    }
  }, [farmerProducts, selectedProductId, productIdFromUrl]);

  useEffect(() => {
    if (!selectedProductId) return;

    const fetchMarketData = async () => {
      const product = farmerProducts.find(p => p.id === selectedProductId);
      if (!product) return;

      setIsLoading(true);
      setMarketData(null);
      try {
        const data = await getMarketTrends({ productName: product.name });
        setMarketData(data);
      } catch (error) {
        console.error("Error fetching market trends:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, [selectedProductId, farmerProducts]);
  
  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    // Update URL without reloading the page
    router.replace(`/farmer/market-analysis?productId=${productId}`);
  }

  if (!user || user.role !== 'farmer') {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 p-4 md:p-8">
        <div className="mb-8">
          <h1 className="font-headline text-3xl font-bold tracking-tight">Market Analysis</h1>
          <p className="text-muted-foreground">
            AI-powered insights into price trends for your products.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Product Selection</CardTitle>
              <Select
                value={selectedProductId || ""}
                onValueChange={handleProductChange}
                disabled={farmerProducts.length === 0}
              >
                <SelectTrigger className="w-full sm:w-[250px]">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {farmerProducts.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="aspect-video w-full" />
              </div>
            )}
            {!isLoading && marketData && (
              <div className='space-y-6'>
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        Trend Summary
                    </h3>
                    <p className="text-muted-foreground">{marketData.trendSummary}</p>
                </div>
                <div>
                     <h3 className="font-semibold text-lg mb-2">Historical Price Chart (Avg. Price/Kg)</h3>
                     <div className="w-full aspect-video">
                        <ChartContainer config={chartConfig}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={marketData.priceHistory} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                    />
                                    <YAxis 
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent indicator="dot" />}
                                    />
                                    <Bar dataKey="price" fill="var(--color-price)" radius={4} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </div>
              </div>
            )}
             {!isLoading && !marketData && selectedProductId && (
                <div className="text-center py-16 text-muted-foreground">
                    <p>Could not load market data. Please try again later.</p>
                </div>
             )}
             {farmerProducts.length === 0 && (
                 <div className="text-center py-16 text-muted-foreground">
                    <p>You have no products to analyze. Add a product from your dashboard.</p>
                </div>
             )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function MarketAnalysisPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MarketAnalysis />
        </Suspense>
    )
}
