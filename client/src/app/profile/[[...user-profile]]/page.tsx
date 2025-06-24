"use client";

import React, { useState, useEffect } from 'react';
import { useUser, UserProfile } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components';
import { Footer } from '@/components';
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Order = {
    orderId: string;
    orderDate: string;
    status: 'DELIVERED' | 'CANCELLED' | 'PENDING';
    total: number;
    items: {
        product: {
            Name: string;
            Picture: string[];
        };
        selectedSize: string;
    }[];
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const getStatusClass = (status: string) => {
    switch (status) {
        case 'DELIVERED': return 'text-green-600';
        case 'CANCELLED': return 'text-red-600';
        case 'PENDING': return 'text-yellow-600';
        default: return 'text-gray-500';
    }
};


export default function ProfilePage() {
    const { user } = useUser();
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);

    useEffect(() => {
        const storedHistory = localStorage.getItem('orderHistory');
        if (storedHistory) {
            const parsedHistory = JSON.parse(storedHistory);
            setOrderHistory(parsedHistory.sort((a: Order, b: Order) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
        }
    }, []);

    return (
        <>
            <Navbar />
            <main className="bg-[#EFE8DB] py-12 text-gray-800">
                <div className="container mx-auto px-8">

                    <section>
                        <h1 className="text-4xl font-light mb-2">My Account</h1>
                        <hr className="border-t-2 border-gray-400 mb-8" />
                        <div className="flex items-center gap-8">
                            <User className="h-40 w-40 text-gray-800 cursor-pointer transition-colors hover:text-white/80" />
                            <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-lg">
                                <strong className="font-medium">Email:</strong>
                                <span>{user?.primaryEmailAddress?.emailAddress}</span>

                                <strong className="font-medium">Username:</strong>
                                <span>{user?.username}</span>

                                <strong className="font-medium">Phone Number:</strong>
                                <span>{user?.unsafeMetadata.phone_number as string || '-'}</span>

                                <strong className="font-medium">Birth Date:</strong>
                                <span>{user?.unsafeMetadata.birth_date as string || '-'}</span>

                                <strong className="font-medium">Address:</strong>
                                <span>{user?.unsafeMetadata.address as string || '-'}</span>
                            </div>
                        </div>
                         <div className="my-8">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full mt-8 border-2 border-gray-400 bg-transparent text-gray-800 hover:bg-gray-800 hover:text-white rounded-md">
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl p-0">
                                    <UserProfile path="/profile" />
                                </DialogContent>
                            </Dialog>
                         </div>
                    </section>

                    <section className="mt-12">
                         <h2 className="text-4xl font-light mb-2">Order History</h2>
                         <hr className="border-t-2 border-gray-400 mb-8" />
                         
                         <div className="space-y-4">
                            {orderHistory.length > 0 ? (
                                orderHistory.map(order => (
                                    <div key={order.orderId} className="grid grid-cols-12 items-center gap-6 p-4 bg-white rounded-lg shadow-sm border">
                                        <div className="col-span-1">
                                            <Image src={order.items[0].product.Picture[0]} alt={order.items[0].product.Name} width={80} height={107} className="rounded-md" />
                                        </div>
                                        <div className="col-span-5">
                                            <h3 className="font-semibold text-lg">{order.items[0].product.Name} ({order.items[0].selectedSize})</h3>
                                            <p className="font-medium text-base">{formatCurrency(order.total)}</p>
                                        </div>
                                        <div className="col-span-3 text-center">
                                            <p className="text-sm text-gray-500">Status:</p>
                                            <p className={`font-semibold ${getStatusClass(order.status)}`}>{order.status}</p>
                                        </div>
                                        <div className="col-span-3 text-center">
                                            <p className="text-sm text-gray-500">Order Date:</p>
                                            <p className="font-semibold">{formatDate(order.orderDate)}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-10">You have no order history.</p>
                            )}
                         </div>
                    </section>

                </div>
            </main>
            <Footer />
        </>
    );
}