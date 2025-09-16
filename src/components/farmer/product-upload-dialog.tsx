"use client";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/hooks/use-app';
import { aiPricePrediction, AIPricePredictionOutput } from '@/ai/flows/ai-price-prediction';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { formatCurrency } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.any(),
});

type FormData = z.infer<typeof formSchema>;

export function ProductUploadDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { user, addProduct } = useApp();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<AIPricePredictionOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [finalPrice, setFinalPrice] = useState<number>(0);

  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (prediction) {
      setFinalPrice(prediction.predictedPrice);
    }
  }, [prediction]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit for Genkit
        toast({
          variant: 'destructive',
          title: 'Image too large',
          description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = async (data: FormData) => {
    if (!imagePreview) {
      toast({
        variant: 'destructive',
        title: 'Image required',
        description: 'Please upload an image of your product.',
      });
      return;
    }
    if (!user?.location) {
         toast({
            variant: 'destructive',
            title: 'Location not found',
            description: 'Your location is required to predict price.',
        });
        return;
    }

    setIsLoading(true);
    setPrediction(null);
    try {
      // Mocked values
      const distanceToMarket = Math.floor(Math.random() * 50) + 5; // 5-55 km
      const logisticsCost = distanceToMarket * 15; // Rs. 15 per km

      const result = await aiPricePrediction({
        productName: data.name,
        productDescription: data.description,
        marketTrends: 'High demand for fresh, organic produce due to seasonal festivities.',
        logisticsCost,
        distanceToMarket,
        productImage: imagePreview,
      });
      setPrediction(result);
    } catch (error) {
      console.error('AI Price Prediction Error:', error);
      toast({
        variant: 'destructive',
        title: 'AI Prediction Failed',
        description: 'Could not get a price suggestion. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    const formValues = getValues();
    if (finalPrice > 0 && imagePreview && formValues.name && formValues.description) {
      const productData = {
        name: formValues.name,
        description: formValues.description,
        image: imagePreview,
        imageHint: 'custom product'
      };
      addProduct(productData, finalPrice);
      toast({
        title: "Product Added!",
        description: `${productData.name} is now listed for sale for ${formatCurrency(finalPrice)}.`
      });
      handleClose();
    } else {
        toast({
            variant: 'destructive',
            title: 'Invalid Price',
            description: 'Please enter a valid price for your product.',
        });
    }
  };

  const handleClose = () => {
    reset();
    setImagePreview(null);
    setPrediction(null);
    setIsLoading(false);
    setOpen(false);
    setFinalPrice(0);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()} onCloseAutoFocus={handleClose}>
        <DialogHeader>
          <DialogTitle className='font-headline'>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details of your product to get an AI-powered price suggestion.
          </DialogDescription>
        </DialogHeader>
        {!prediction ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <div className='col-span-3'>
                  <Input id="name" {...register('name')} className="w-full" />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                 <div className='col-span-3'>
                    <Textarea id="description" {...register('description')} className="w-full" />
                    {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
                 </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">Image</Label>
                <div className='col-span-3'>
                    <Input id="image" type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
                    {imagePreview && (
                        <div className="mt-2 w-full aspect-video relative rounded-md overflow-hidden border">
                            <Image src={imagePreview} alt="Preview" fill className='object-cover'/>
                        </div>
                    )}
                 </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Get Price Suggestion
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="py-4 space-y-4">
             <Alert>
                <Wand2 className="h-4 w-4" />
                <AlertTitle className="font-headline text-lg text-primary">AI Price Suggestion</AlertTitle>
                <AlertDescription className="space-y-2">
                    <p className="text-3xl font-bold text-accent">{formatCurrency(prediction.predictedPrice)}</p>
                    <p className='text-foreground'>{prediction.reasoning}</p>
                </AlertDescription>
            </Alert>
            <div className="grid gap-2">
                <Label htmlFor="final-price">Your Price (per kg)</Label>
                <Input 
                    id="final-price"
                    type="number"
                    value={finalPrice}
                    onChange={(e) => setFinalPrice(parseFloat(e.target.value) || 0)}
                    className="text-lg font-bold"
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setPrediction(null)}>Go Back</Button>
                <Button onClick={handleAddProduct}>Set Price & Add Product</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
