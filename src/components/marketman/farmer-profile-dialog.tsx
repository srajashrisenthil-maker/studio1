"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useApp } from '@/hooks/use-app';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface FarmerProfileDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    farmerId: string;
}

export function FarmerProfileDialog({ isOpen, onOpenChange, farmerId }: FarmerProfileDialogProps) {
    const { getFarmerById } = useApp();
    const { getTranslation } = useLanguage();
    const farmer = getFarmerById(farmerId);

    if (!farmer) {
        return null; 
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline text-center text-2xl mb-4">{getTranslation('farmer-profile-title') || 'Farmer Profile'}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={farmer.profilePicture} alt={farmer.name} />
                        <AvatarFallback className="text-4xl">
                            {farmer.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">{farmer.name}</h2>
                        <p className="text-muted-foreground">{getTranslation('farmer-role-label') || 'Farmer'}</p>
                    </div>
                    <div className="w-full space-y-2 pt-4">
                         <div className="flex items-center text-sm">
                           <MapPin className="mr-3 h-4 w-4 text-muted-foreground" />
                           <span>{farmer.address}</span>
                        </div>
                        <div className="flex items-center text-sm">
                           <Phone className="mr-3 h-4 w-4 text-muted-foreground" />
                           <span>{farmer.phone}</span>
                        </div>
                    </div>
                    <Button asChild className="w-full mt-4">
                        <a href={`tel:${farmer.phone}`}>
                            <Phone className="mr-2 h-4 w-4" />
                            {getTranslation('contact-farmer-button') || 'Contact Farmer'}
                        </a>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
