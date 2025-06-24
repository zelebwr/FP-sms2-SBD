"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search } from 'lucide-react';

const capitalize = (s: string) => {
    if (typeof s !== 'string' || s.length === 0) return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export const ProductSidebar = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const segments = pathname.split('/');
    const category = segments.length > 2 ? segments[segments.length - 1] : null;

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                params.set('search', searchTerm);
            } else {
                params.delete('search');
            }
            router.replace(`${pathname}?${params.toString()}`);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, pathname, router, searchParams]);

    return (
        <aside className="w-72 flex-shrink-0 bg-[#3F4971] p-6 text-white">
            <div className="mb-8 text-center">
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                {category && (
                    <>
                        <span className="mx-2 text-gray-500">&gt;</span>
                        <span className="font-semibold text-white">{capitalize(category)}</span>
                    </>
                )}
            </div>

            <div className="relative mb-6">
                <Input
                    placeholder="Search"
                    className="bg-white/10 border-none pl-10 text-white placeholder:text-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>

            <Accordion type="multiple" className="w-full">
                <AccordionItem value="item-1" className="border-b-white/20">
                    <AccordionTrigger>Man</AccordionTrigger>
                    <AccordionContent className="flex flex-col space-y-2 pl-2">
                         <Link href="/products/men" className="hover:underline">All Men's</Link>
                    </AccordionContent>
                </AccordionItem>
                 <AccordionItem value="item-2" className="border-b-white/20">
                    <AccordionTrigger>Woman</AccordionTrigger>
                    <AccordionContent className="flex flex-col space-y-2 pl-2">
                         <Link href="/products/woman" className="hover:underline">All Woman's</Link>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-b-0">
                    <AccordionTrigger>Kids</AccordionTrigger>
                    <AccordionContent className="flex flex-col space-y-2 pl-2">
                         <Link href="/products/kids" className="hover:underline">All Kids'</Link>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    );
};