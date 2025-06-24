import { Suspense } from 'react';
import { ProductSidebar } from "@/components"; 
import { ProductGridSkeleton } from '@/components';
import { Navbar } from "@/components";
import { Footer } from "@/components";

export default function ProductsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1">
                <ProductSidebar />
                <main className="flex-1 bg-[#EFE8DB] p-8 overflow-y-auto">
                    <Suspense fallback={<ProductGridSkeleton />}>
                        {children}
                    </Suspense>
                </main>
            </div>
            <Footer />
        </div>
    );
}