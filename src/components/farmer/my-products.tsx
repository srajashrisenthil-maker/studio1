"use client";

import { useApp } from "@/hooks/use-app";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "../ui/badge";

export function MyProducts() {
    const { user, products } = useApp();
    const myProducts = products.filter(p => p.farmerId === user?.id);

    if (myProducts.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm mt-8">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        You have no products yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Click "Add Product" to get started.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {myProducts.map(product => (
                <Card key={product.id} className="overflow-hidden">
                    <CardHeader className="p-0">
                        <div className="relative aspect-[4/3]">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                data-ai-hint={product.imageHint}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription className="mt-1 h-10 text-sm overflow-hidden text-ellipsis">
                            {product.description}
                        </CardDescription>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                        <Badge variant="outline" className="text-base">
                            {formatCurrency(product.price)}
                        </Badge>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
