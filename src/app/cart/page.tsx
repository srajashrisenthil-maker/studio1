"use client";

import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/hooks/use-app";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CartPage() {
    const { user, cart, removeFromCart, updateCartQuantity, clearCart } = useApp();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        if (!user) {
            router.push("/login?role=marketman");
        } else if (user.role !== 'marketman') {
            router.push('/');
        }
    }, [user, router]);
    
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const handleCheckout = () => {
        toast({
            title: "Checkout Initiated",
            description: "Payment gateway integration would proceed from here."
        });
        clearCart();
        router.push("/marketman/dashboard");
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-8">
                <h1 className="font-headline text-3xl font-bold tracking-tight mb-8">Your Cart</h1>
                
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        {cart.length === 0 ? (
                            <Card className="flex flex-col items-center justify-center py-20">
                                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                                <h3 className="mt-4 text-xl font-semibold">Your cart is empty</h3>
                                <p className="text-muted-foreground mt-2">Browse products to add them to your cart.</p>
                                <Button asChild className="mt-6">
                                    <Link href="/marketman/dashboard">Start Shopping</Link>
                                </Button>
                            </Card>
                        ) : (
                             <Card>
                                <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Product</TableHead>
                                            <TableHead>Details</TableHead>
                                            <TableHead className="text-center">Quantity</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cart.map(item => (
                                            <TableRow key={item.product.id}>
                                                <TableCell>
                                                    <div className="relative aspect-square w-16 h-16 rounded-md overflow-hidden">
                                                        <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{item.product.name}</TableCell>
                                                <TableCell>
                                                    <Input 
                                                        type="number" 
                                                        min="1" 
                                                        value={item.quantity}
                                                        onChange={(e) => updateCartQuantity(item.product.id, parseInt(e.target.value, 10) || 1)}
                                                        className="w-20 mx-auto text-center"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.product.price)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.product.price * item.quantity)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                </CardContent>
                             </Card>
                        )}
                    </div>
                    {cart.length > 0 && (
                        <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Taxes & Fees</span>
                                    <span>{formatCurrency(subtotal * 0.05)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>{formatCurrency(subtotal * 1.05)}</span>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" size="lg" onClick={handleCheckout}>
                                    <CreditCard className="mr-2 h-4 w-4"/>
                                    Proceed to Checkout
                                </Button>
                            </CardFooter>
                        </Card>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
