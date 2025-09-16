"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Store } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useLanguage } from '@/hooks/use-language';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');
  const { getTranslation } = useLanguage();

  return (
    <div className="relative min-h-screen w-full bg-background">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover opacity-20"
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <header className="text-center mb-12">
          <h1 className="font-headline text-6xl md:text-7xl font-bold text-primary">AGROW</h1>
          <p className="mt-4 text-xl text-muted-foreground">{getTranslation('home-tagline')}</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <Card className="text-center bg-card/80 backdrop-blur-sm transition-transform hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <div className="mx-auto bg-primary text-primary-foreground rounded-full p-4 w-fit">
                <Leaf className="h-10 w-10" />
              </div>
              <CardTitle className="font-headline text-3xl pt-4">{getTranslation('home-for-farmers-title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">
                {getTranslation('home-for-farmers-description')}
              </p>
              <Button asChild size="lg" className="w-full">
                <Link href="/login?role=farmer">{getTranslation('home-enter-as-farmer')}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center bg-card/80 backdrop-blur-sm transition-transform hover:scale-105 hover:shadow-xl">
            <CardHeader>
              <div className="mx-auto bg-primary text-primary-foreground rounded-full p-4 w-fit">
                <Store className="h-10 w-10" />
              </div>
              <CardTitle className="font-headline text-3xl pt-4">{getTranslation('home-for-marketmen-title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">
                {getTranslation('home-for-marketmen-description')}
              </p>
              <Button asChild size="lg" className="w-full">
                <Link href="/login?role=marketman">{getTranslation('home-enter-as-marketman')}</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <footer className="mt-12 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AGROW. {getTranslation('home-footer-rights')}</p>
        </footer>
      </div>
    </div>
  );
}
