"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";
import { useUser, useClerk } from "@clerk/nextjs";
import { Heart, Search, ShoppingCart, User, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
    { title: "Home", href: "/" },
    { title: "Explore", href: "/products" },
    { title: "Men", href: "/products/men" },
    { title: "Woman", href: "/products/woman" },
    { title: "Kids", href: "/products/kids" },
];

const Navbar = () => {
    const { isSignedIn, user } = useUser();
    const { signOut } = useClerk();

    return (
        <nav className="w-full bg-[#2D3450]">
            <div className="container mx-auto flex items-center justify-between h-20 px-4">
                
                <div className="flex-shrink-0">
                    <Link href="/">
                        <Image
                            src="/images/Logo-Javva.png"
                            alt="Logo JAVVA"
                            width={80}
                            height={45}
                            priority
                        />
                    </Link>
                </div>

                <div>
                    <NavigationMenu>
                        <NavigationMenuList>
                            {menuItems.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <Link href={item.href} legacyBehavior passHref>
                                        <NavigationMenuLink className="h-10 px-4 py-2 text-sm font-medium rounded-md text-white/80 hover:text-white w-max bg-transparent hover:bg-transparent focus:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                                            {item.title}
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="flex items-center space-x-5">
                    <Search className="h-6 w-6 text-white cursor-pointer transition-colors hover:text-white/80" />
                    <Heart className="h-6 w-6 text-white cursor-pointer transition-colors hover:text-white/80" />
                    <Link href="/cart" aria-label="cart">
                        <ShoppingCart className="h-6 w-6 text-white cursor-pointer transition-colors hover:text-white/80" />
                    </Link>

                    {isSignedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="focus:outline-none rounded-full">
                                    <User className="h-6 w-6 text-white cursor-pointer transition-colors hover:text-white/80" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="mr-4">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <Link href="/profile">
                                    <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem onClick={() => signOut({ redirectUrl: '/' })} className="cursor-pointer text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/auth/signin" aria-label="user">
                            <User className="h-6 w-6 text-white cursor-pointer transition-colors hover:text-white/80" />
                        </Link>
                    )}
                </div>

            </div>
        </nav>
    );
};

export default Navbar;