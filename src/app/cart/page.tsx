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
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

export default function CartPage() {
    const { user, cart, removeFromCart, updateCartQuantity, clearCart, addOrder } = useApp();
    const router = useRouter();
    const { toast } = useToast();
    const [isPaymentDialogOpen, setPaymentDialogOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/login?role=marketman");
        } else if (user.role !== 'marketman') {
            router.push('/');
        }
    }, [user, router]);
    
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const total = subtotal * 1.05;

    const handleCheckout = () => {
        setPaymentDialogOpen(true);
    }

    const handlePayment = () => {
        addOrder(cart, total);
        setPaymentDialogOpen(false);
        toast({
            title: "Payment Successful",
            description: "Your order has been placed."
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
                                    <span>{formatCurrency(total)}</span>
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
             <Dialog open={isPaymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-headline">Complete Your Payment</DialogTitle>
                         <DialogDescription>
                            Total Amount: <span className="font-bold">{formatCurrency(total)}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="upi">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="upi">UPI</TabsTrigger>
                            <TabsTrigger value="bank">Bank Account</TabsTrigger>
                        </TabsList>
                        <TabsContent value="upi" className="pt-4 space-y-4">
                           <div className="flex flex-col items-center space-y-2">
                                <Image src="https://picsum.photos/seed/qrcode/200/200" alt="UPI QR Code" width={200} height={200} data-ai-hint="QR code" />
                                <p className="text-sm text-muted-foreground">Scan QR or enter UPI ID</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="upi-id">UPI ID</Label>
                                <Input id="upi-id" placeholder="yourname@upi" />
                            </div>
                        </TabsContent>
                        <TabsContent value="bank" className="pt-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="acc-holder">Account Holder Name</Label>
                                <Input id="acc-holder" placeholder="e.g. Ram Singh" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="acc-number">Account Number</Label>
                                <Input id="acc-number" placeholder="Enter your account number" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="ifsc">IFSC Code</Label>
                                <Input id="ifsc" placeholder="Enter your bank's IFSC code" />
                            </div>
                        </TabsContent>
                    </Tabs>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handlePayment}>Pay {formatCurrency(total)}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
