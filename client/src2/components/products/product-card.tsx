"use client";

import Image from "next/image";
import { slugify } from "@/lib/dummy-data";
import { Button } from "src2/components/ui/button";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/dummy-data";
import Link from "next/link";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const ProductCard = ({ product }: { product: Product }) => {
  const productUrl = `/product/${slugify(product.Name)}`;
  return (
    <div className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl">
      <button className="absolute top-3 right-3 z-10 rounded-full bg-white/70 p-2 text-gray-400 backdrop-blur-sm transition hover:text-red-500 hover:bg-white">
        <Heart size={20} />
      </button>
      <div className="aspect-[3/4] overflow-hidden">
        <Image
          src={product.Picture[0]}
          alt={product.Name}
          width={400}
          height={533}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-gray-800">{product.Name}</h3>
        <p className="mt-1 font-bold text-gray-900">
          {formatCurrency(product.Price)}
        </p>
        <Link href={productUrl}>
          <Button className="mt-4 w-full bg-gray-800 text-white hover:bg-gray-900">
            Buy Now
          </Button>
        </Link>
      </div>
    </div>
  );
};
