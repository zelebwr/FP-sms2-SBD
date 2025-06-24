"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation'; // Impor hook baru
import { fetchProducts, Product } from '@/lib/dummy-data';
import { ProductCard } from '@/components/products/product-card';
import { ProductGridSkeleton } from '@/components/products/product-grid-skeleton';

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ProductsPage({ params }: { params: { category?: string[] } }) {
    const category = params.category?.[0];
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search');

    const [products, setProducts] = useState<Product[]>([]);
    const [sortOrder, setSortOrder] = useState('rating_desc');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setIsLoading(true);
            const fetchedProducts = await fetchProducts(category);
            setProducts(fetchedProducts);
            setIsLoading(false);
        };
        loadProducts();
    }, [category]);

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...products];
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.Name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        const sorted = [...filtered];
        switch (sortOrder) {
            case 'price_asc':
                sorted.sort((a, b) => a.Price - b.Price);
                break;
            case 'price_desc':
                sorted.sort((a, b) => b.Price - a.Price);
                break;
            case 'rating_desc':
            default:
                sorted.sort((a, b) => b.Rating - a.Rating);
                break;
        }
        return sorted;
    }, [products, sortOrder, searchQuery]);
    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="rounded-md border-gray-300 bg-white p-2 shadow-sm text-black"
                    >
                        <option value="rating_desc">By rating</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <ProductGridSkeleton />
            ) : (
                <>
                    {filteredAndSortedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {filteredAndSortedProducts.map((product) => (
                                <ProductCard key={product.SKU} product={product} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-10">No products found matching your criteria.</p>
                    )}
                </>
            )}
        </div>
    );
}