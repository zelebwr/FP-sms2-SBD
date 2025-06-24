"use client"; // This must be a client component for interactivity.

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { ExploreSidebar } from "@/components/ExploreSidebar";
import Pagination from "@/components/Pagination";
import { Product } from "src2/types";
import { ChevronDown } from "lucide-react";

export default function ExplorePage() {
  // State for the products fetched from the API
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for the filter controls
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // This `useEffect` hook is the magic. It runs whenever a filter changes.
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      // Build the query string from the current state of the filters
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory) params.append("category", selectedCategory);
      if (sortBy) params.append("sortBy", sortBy);

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    // We use a debounce timer to avoid sending API requests on every keystroke
    const debounceTimer = setTimeout(() => {
      fetchProducts();
    }, 500); // Wait 500ms after the user stops typing

    return () => clearTimeout(debounceTimer); // Cleanup the timer
  }, [searchTerm, selectedCategory, sortBy]); // Dependency array: re-run when any of these change

  return (
    <div className="bg-[#3f4971] min-h-screen">
      <Navbar />
      <main className="container mx-auto px-6 pt-32 pb-12">
        <div className="bg-[#efe8db] flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <ExploreSidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-javva-purple-darker">
                {selectedCategory || "All Products"}
              </h1>

              {/* Sort By Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-gray-700 focus:outline-none focus:ring-2 focus:ring-javva-accent"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <ChevronDown
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="text-center py-20">Loading products...</div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">
                Error: {error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <ProductCard key={product.product_id} product={product} />
                    ))
                  ) : (
                    <p className="col-span-full text-center text-gray-500">
                      No products found matching your criteria.
                    </p>
                  )}
                </div>
                {products.length > 0 && <Pagination />}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
