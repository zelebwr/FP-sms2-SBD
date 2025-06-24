import { fetchProductBySlug, fetchProducts } from '@/lib/dummy-data'; // Impor juga fetchProducts
import { ProductDetailClient } from '@/components';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components';
import { Footer } from '@/components';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
    const product = await fetchProductBySlug(params.slug);

    if (!product) {
        notFound();
    }

    const allProducts = await fetchProducts();

    const relatedProducts = allProducts
        .filter(p => p.SKU !== product.SKU)
        .map(p => {
            const sharedTags = p.Tags.filter(tag => product.Tags.includes(tag));
            const score = sharedTags.length + (p.Category === product.Category ? 1 : 0);
            return { ...p, score };
        })
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

    return (
        <>
            <Navbar />
            <ProductDetailClient product={product} relatedProducts={relatedProducts} />
            <Footer />
        </>
    );
}