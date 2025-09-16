"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useApp } from '@/hooks/use-app';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';
import { Phone, MapPin, UserPlus, UserCheck, Users } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';

interface FarmerProfileDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    farmerId: string;
}

export function FarmerProfileDialog({ isOpen, onOpenChange, farmerId }: FarmerProfileDialogProps) {
    const { user, getFarmerById, followFarmer, unfollowFarmer } = useApp();
    const { getTranslation } = useLanguage();
    const { toast } = useToast();
    const farmer = getFarmerById(farmerId);

    if (!farmer) {
        return null; 
    }
    
    const isFollowing = user?.following?.includes(farmer.id);

    const handleFollowToggle = () => {
        if (isFollowing) {
            unfollowFarmer(farmer.id);
            toast({ title: `Unfollowed ${farmer.name}`});
        } else {
            followFarmer(farmer.id);
            toast({ title: `Followed ${farmer.name}`});
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline text-center text-2xl mb-4">{getTranslation('farmer-profile-title') || 'Farmer Profile'}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={farmer.profilePicture || undefined} alt={farmer.name} />
                        <AvatarFallback className="text-4xl">
                            {farmer.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">{farmer.name}</h2>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <span>{getTranslation('farmer-role-label') || 'Farmer'}</span>
                            <span className='flex items-center gap-1'><Users className='h-4 w-4' /> {farmer.followers || 0}</span>
                        </div>
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
                    <div className="w-full flex flex-col gap-2 mt-4">
                        <Button asChild>
                            <a href={`tel:${farmer.phone}`}>
                                <Phone className="mr-2 h-4 w-4" />
                                {getTranslation('contact-farmer-button') || 'Contact Farmer'}
                            </a>
                        </Button>
                         <Button variant={isFollowing ? "secondary" : "outline"} onClick={handleFollowToggle}>
                            {isFollowing ? <UserCheck className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                            {isFollowing ? 'Following' : 'Follow'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
