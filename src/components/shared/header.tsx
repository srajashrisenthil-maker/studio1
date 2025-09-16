"use client";

import { useApp } from "@/hooks/use-app";
import { Languages, Leaf, LogOut, ShoppingCart, User as UserIcon } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { useLanguage } from "@/hooks/use-language";

export function Header() {
  const { user, logout, cart } = useApp();
  const { language, setLanguage, getTranslation } = useLanguage();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link href="/" className="flex items-center gap-2">
          <Leaf className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">AGROW</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Languages className="h-5 w-5" />
                        <span className="sr-only">Change language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{getTranslation('header-language-switcher-label')}</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as 'en' | 'ta')}>
                        <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="ta">தமிழ்</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            {user?.role === 'marketman' && (
              <Button asChild variant="ghost" size="icon">
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemCount > 0 && (
                     <Badge variant="destructive" className="absolute top-2 right-1 h-5 w-5 justify-center p-0 text-xs">{cartItemCount}</Badge>
                  )}
                  <span className="sr-only">Shopping Cart</span>
                </Link>
              </Button>
            )}

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                       <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{getTranslation('header-logout-button')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
