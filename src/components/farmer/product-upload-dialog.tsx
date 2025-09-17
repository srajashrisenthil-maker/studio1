
"use client";
import React, { useState } from 'react';
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
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/hooks/use-app';
import { formatCurrency } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be a positive number')
  ),
  image: z.string().refine(val => val.length > 0, 'Product image is required.'),
});

type FormData = z.infer<typeof formSchema>;

export function ProductUploadDialog({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { addProduct } = useApp();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue, trigger } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast({
          variant: 'destructive',
          title: 'Image too large',
          description: 'Please upload an image smaller than 2MB.',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setValue("image", result, { shouldValidate: true });
        trigger("image");
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    
    const newProductId = addProduct({
        name: data.name,
        description: data.description,
        image: data.image,
        imageHint: data.name,
    }, data.price);

    toast({
        title: "Product Added!",
        description: `${data.name} is now listed for sale.`,
    });
    
    setIsLoading(false);
    handleClose();
    
    router.push(`/farmer/market-analysis?productId=${newProductId}`);
  };

  const handleClose = () => {
    reset();
    setIsLoading(false);
    setOpen(false);
    setImagePreview(null);
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isLoading && (isOpen ? setOpen(true) : handleClose())}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => {
        if (isLoading) e.preventDefault();
      }} onCloseAutoFocus={handleClose}>
        <DialogHeader>
          <DialogTitle className='font-headline'>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to list your product for sale.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <div className='col-span-3'>
                  <Input id="name" {...register('name')} className="w-full" placeholder="e.g. Fresh Tomatoes" disabled={isLoading}/>
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Description</Label>
                 <div className='col-span-3'>
                    <Textarea id="description" {...register('description')} className="w-full" disabled={isLoading}/>
                    {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
                 </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price (per kg)</Label>
                <div className='col-span-3'>
                  <Input id="price" type="number" step="0.01" {...register('price')} className="w-full" placeholder="e.g. 50" disabled={isLoading} />
                  {errors.price && <p className="text-sm text-destructive mt-1">{errors.price.message}</p>}
                </div>
              </div>
               <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="image" className="text-right pt-2">Image</Label>
                 <div className='col-span-3'>
                    <div className="flex items-center gap-4">
                       <Avatar className="h-16 w-16 rounded-md">
                          <AvatarImage src={imagePreview || null} alt="Product preview" className='object-cover' />
                           <AvatarFallback className="rounded-md">
                               <Upload />
                           </AvatarFallback>
                       </Avatar>
                       <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="w-full" disabled={isLoading}/>
                    </div>
                    {errors.image && <p className="text-sm text-destructive mt-1">{errors.image.message as string}</p>}
                 </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                  Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Product
              </Button>
            </DialogFooter>
          </form>
      </DialogContent>
    </Dialog>
  );
}
