"use client";

import { useCart } from "src2/context/cart-context";
import { Product, fetchProducts } from "@/lib/dummy-data";
import Link from "next/link";
import Image from "next/image";
import { Button } from "src2/components/ui/button";
import { Minus, Plus, Tag, ArrowRight } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { ProductCard } from "src2/components/products/product-card";
import { Navbar } from "src2/components";
import { Footer } from "src2/components";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const CartItemRow = ({
  item,
}: {
  item: import("src2/context/cart-context").CartItem;
}) => {
  const { dispatch } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: {
        sku: item.product.SKU,
        size: item.selectedSize,
        quantity: newQuantity,
      },
    });
  };

  return (
    <div className="flex items-center gap-6 bg-white p-4 rounded-lg shadow-sm mb-4">
      <Image
        src={item.product.Picture[0]}
        alt={item.product.Name}
        width={100}
        height={133}
        className="rounded-md bg-gray-100"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-gray-800">
          {item.product.Name}
        </h3>
        <p className="text-sm text-gray-500">
          Color: {item.product.Color[0]?.name || "N/A"}
        </p>
        <p className="text-sm text-gray-500">Size: {item.selectedSize}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-md border text-gray-800">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="p-2 hover:bg-gray-100 rounded-l-md"
          >
            <Minus size={16} />
          </button>
          <span className="px-4 font-semibold">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="p-2 hover:bg-gray-100 rounded-r-md"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <p className="w-40 text-right font-semibold text-gray-800">
        {formatCurrency(item.product.Price * item.quantity)}
      </p>
    </div>
  );
};

export default function CartPage() {
  const { state } = useCart();
  const { items } = state;

  const subtotal = useMemo(() => {
    return items.reduce(
      (acc, item) => acc + item.product.Price * item.quantity,
      0
    );
  }, [items]);

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  useEffect(() => {
    const getRelated = async () => {
      if (items.length > 0) {
        const allProducts = await fetchProducts();
        const tagsInCart = new Set(items.flatMap((item) => item.product.Tags));
        const related = allProducts
          .filter((p) => !items.some((item) => item.product.SKU === p.SKU))
          .map((p) => {
            const sharedTags = p.Tags.filter((tag) => tagsInCart.has(tag));
            return { ...p, score: sharedTags.length };
          })
          .filter((p) => p.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);
        setRelatedProducts(
          related.length > 0
            ? related
            : allProducts.sort(() => 0.5 - Math.random()).slice(0, 3)
        );
      }
    };
    getRelated();
  }, [items]);

  return (
    <>
      <Navbar />
      <header className="bg-[#3F4971] text-white shadow-md">
        <div className="container mx-auto px-8 py-5">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>
      </header>

      <main className="bg-[#EFE8DB]">
        <div className="container mx-auto px-8 py-12">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 py-20">
              Your cart is empty.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="lg:col-span-2">
                {items.map((item) => (
                  <CartItemRow
                    key={`${item.product.SKU}-${item.selectedSize}`}
                    item={item}
                  />
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold border-b text-gray-800 pb-4">
                    Order summary | {items.length} products
                  </h2>
                  <div className="space-y-4 py-4 text-gray-700">
                    <div className="flex justify-between">
                      <span>Product subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <p className="text-xs text-gray-400">Includes VAT.</p>
                  </div>
                  <div className="flex justify-between border-t pt-4 font-bold text-gray-800">
                    <span>Total order:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="mt-6 flex items-center gap-2 border-y py-4">
                    <Tag className="text-gray-400" />
                    <input
                      type="text"
                      placeholder="Voucher"
                      className="flex-1 border-none bg-transparent text-sm focus:ring-0"
                    />
                  </div>
                  <Link
                    href="/cart/checkout"
                    className="flex justify-end items-center mt-6 font-semibold text-gray-800 hover:text-black transition-colors"
                  >
                    Checkout
                    <ArrowRight className="ml-2" size={18} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <section className="pb-16">
          <div className="container mx-auto px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-10">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((related) => (
                <ProductCard key={related.SKU} product={related} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
