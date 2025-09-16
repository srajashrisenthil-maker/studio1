"use client";

import { Header } from "@/components/shared/header";
import { useApp } from "@/hooks/use-app";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Order } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

export default function OrderHistoryPage() {
    const { user, orders, getFarmerById } = useApp();
    const router = useRouter();
    const [userOrders, setUserOrders] = useState<Order[]>([]);
    const [userSales, setUserSales] = useState<any[]>([]);

    useEffect(() => {
        if (!user) {
            router.push("/");
            return;
        }

        if (user.role === 'marketman') {
            const marketmanOrders = orders
                .filter(order => order.marketmanId === user.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setUserOrders(marketmanOrders);
        } else if (user.role === 'farmer') {
            const sales = orders
                .flatMap(order => 
                    order.items
                        .filter(item => item.farmerId === user.id)
                        .map(item => ({
                            orderId: order.id,
                            orderDate: order.date,
                            marketmanName: order.marketmanName,
                            ...item
                        }))
                )
                .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
            setUserSales(sales);
        }

    }, [user, orders, router]);


    if (!user) return null;

    const renderMarketmanHistory = () => (
        <Accordion type="single" collapsible className="w-full">
            {userOrders.map(order => (
                <AccordionItem value={order.id} key={order.id}>
                    <AccordionTrigger>
                        <div className="flex justify-between w-full pr-4">
                            <div className="text-left">
                                <p className="font-semibold">Order #{order.id.slice(-6)}</p>
                                <p className="text-sm text-muted-foreground">{format(new Date(order.date), 'PPP')}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{formatCurrency(order.total)}</p>
                                <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[80px]">Item</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead className="text-center">Quantity</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Subtotal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map(item => (
                                    <TableRow key={item.productId}>
                                        <TableCell>
                                             <div className="relative aspect-square w-12 h-12 rounded-md overflow-hidden">
                                                <Image src={item.productImage} alt={item.productName} fill className="object-cover" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium">{item.productName}</p>
                                            <p className="text-xs text-muted-foreground">Sold by: {getFarmerById(item.farmerId)?.name || 'N/A'}</p>
                                        </TableCell>
                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );

    const renderFarmerHistory = () => (
         <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {userSales.map(sale => (
                    <TableRow key={`${sale.orderId}-${sale.productId}`}>
                        <TableCell className="font-medium">{sale.productName}</TableCell>
                        <TableCell>{format(new Date(sale.orderDate), 'PP')}</TableCell>
                        <TableCell>{sale.marketmanName}</TableCell>
                        <TableCell className="text-center">{sale.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(sale.price * sale.quantity)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    const hasHistory = user.role === 'marketman' ? userOrders.length > 0 : userSales.length > 0;

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="font-headline text-3xl font-bold tracking-tight">Order History</h1>
                    <p className="text-muted-foreground">
                        {user.role === 'marketman' ? 'View your past purchases.' : 'View your sales history.'}
                    </p>
                </div>
                
                <Card>
                    <CardContent className="p-6">
                        {hasHistory ? (
                            user.role === 'marketman' ? renderMarketmanHistory() : renderFarmerHistory()
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-muted-foreground">You have no order history yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}