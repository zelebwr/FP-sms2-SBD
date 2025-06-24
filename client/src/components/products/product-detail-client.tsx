"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Star, Minus, Plus } from 'lucide-react';
import { Product } from '@/lib/dummy-data';
import { ProductCard } from "@/components";

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

export const ProductDetailClient = ({ product, relatedProducts }: { product: Product, relatedProducts: Product[] }) => {
    const { dispatch } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [mainImage, setMainImage] = useState(product.Picture[0]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Please select a size.");
            return;
        }
        dispatch({
            type: 'ADD_ITEM',
            payload: {
                product: product,
                quantity: quantity,
                selectedSize: selectedSize,
            }
        });
        console.log({
            sku: product.SKU,
            name: product.Name,
            size: selectedSize,
            quantity: quantity,
            price: product.Price,
        });
        toast.success(`${quantity} x ${product.Name} (${selectedSize}) added to cart!`);
    };

    return (
        <>
            <header className="bg-[#EFE8DB] py-4">
                <div className="container mx-auto px-8">
                    <div className="text-sm text-gray-500">
                        <Link href="/" className="hover:text-black">Home</Link>
                        <span className="mx-2">&gt;</span>
                        <Link href={`/products/${product.Category.toLowerCase()}`} className="hover:text-black">{product.Category}</Link>
                        <span className="mx-2">&gt;</span>
                        <span className="font-semibold text-black">{product.Name}</span>
                    </div>
                </div>
            </header>

            <div className="bg-[#3F4971] min-h-screen text-white p-8">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-4">
                                {product.Picture.map((pic, index) => (
                                    <button key={index} onClick={() => setMainImage(pic)} className={`rounded-lg overflow-hidden border-2 ${mainImage === pic ? 'border-white' : 'border-transparent'}`}>
                                        <Image src={pic} alt={`${product.Name} thumbnail ${index + 1}`} width={80} height={107} className="object-cover" />
                                    </button>
                                ))}
                            </div>
                            <div className="flex-1 rounded-lg overflow-hidden bg-white">
                                <Image src={mainImage} alt={product.Name} width={600} height={800} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <h1 className="text-4xl font-bold">{product.Name}</h1>
                            <p className="mt-2 text-2xl font-semibold">{formatCurrency(product.Price)}</p>
                            <div className="my-4 flex items-center gap-3">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={20} 
                                            fill={i < Math.round(product.Rating) ? 'currentColor' : 'none'} 
                                            stroke="currentColor" 
                                        />
                                    ))}
                                </div>
                                <div className="h-4 w-px bg-gray-500"></div>
                                <span className="text-sm text-gray-300">{product.Review} Customer Reviews</span>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{product.Description}</p>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="mb-2 text-sm font-semibold">Size</h3>
                                    <div className="flex gap-2">
                                        {['S', 'M', 'L'].map(size => (
                                        <Button
                                            key={size}
                                            className={`
                                                rounded-md px-4 py-2 font-semibold transition-colors duration-200
                                                ${selectedSize === size
                                                ? 'bg-[#F8B179] text-black border border-[#F8B179]'
                                                : 'bg-white text-black border border-gray-300 hover:bg-gray-100'
                                                }
                                            `}
                                            onClick={() => setSelectedSize(size)}
                                            >
                                            {size}
                                        </Button>
                                        ))}
                                    </div>
                                </div>
                                 <div>
                                    <h3 className="mb-2 text-sm font-semibold">Color</h3>
                                    <div className="flex gap-2 items-center">
                                        {product.Color.map((color) => (
                                            <span
                                                key={color.name}
                                                title={color.name}
                                                className={`h-8 w-8 rounded-full block cursor-pointer
                                                    ${color.hex.toLowerCase() === '#ffffff' ? 'border-2 border-gray-400' : ''}
                                                `}
                                                style={{ backgroundColor: color.hex }}
                                            ></span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-6">
                                <div className="flex items-center rounded-md border border-gray-600">
                                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-3"><Minus size={16} /></button>
                                    <span className="px-4 font-semibold">{quantity}</span>
                                    <button onClick={() => setQuantity(q => q + 1)} className="p-3"><Plus size={16} /></button>
                                </div>
                                <Button
                                    size="lg"
                                    className="flex-1 bg-transparent border border-white text-white hover:bg-[#F8B179] hover:border-[#F8B179] hover:text-black transition-colors duration-300 ease-in-out"
                                    onClick={handleAddToCart}
                                    >
                                    Add To Cart
                                </Button>
                            </div>

                            <hr className="my-8 border-gray-700" />
                            
                            <div className="space-y-2 text-sm text-gray-300">
                                <p>SKU: <span className="text-white">{product.SKU}</span></p>
                                <p>Category: <span className="text-white">{product.Category}</span></p>
                                <p>Tags: <span className="text-white">{product.Tags.join(', ')}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <section className="bg-[#EFE8DB] py-16">
                <div className="container mx-auto px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-10">
                        Related Products
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedProducts.map((related) => (
                            <ProductCard key={related.SKU} product={related} />
                        ))}
                    </div>
                    <div className="mt-12">
                        <Link href={`/products/${product.Category.toLowerCase()}`}>
                            <Button className="bg-black text-white hover:bg-gray-800 px-10 py-6 text-base font-semibold">
                                Show More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};