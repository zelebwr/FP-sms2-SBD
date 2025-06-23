import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types'; // We'll create this type definition file next

// Function to format the price
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.product_id}`} className="group block">
      <div className="overflow-hidden rounded-lg">
        <Image
          src={product.image_url || '/placeholder.png'}
          alt={product.product_name}
          width={400}
          height={500}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#577c8e] transition-colors">{product.product_name}</h3>
        <p className="mt-1 text-md text-gray-600">{formatPrice(product.product_price)}</p>
      </div>
    </Link>
  );
}