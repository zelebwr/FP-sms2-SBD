import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Product } from "src2/types";

// A simple component for the informational feature cards
const FeatureCard = ({
  title,
  description,
  imgSrc,
  reverse = false,
}: {
  title: string;
  description: string;
  imgSrc: string;
  reverse?: boolean;
}) => (
  <div
    className={`grid md:grid-cols-2 gap-12 items-center ${
      reverse ? "md:grid-flow-col-dense" : ""
    }`}
  >
    <div
      className={`text-center md:text-left ${reverse ? "md:col-start-2" : ""}`}
    >
      <h3 className="text-4xl font-semibold text-[#2d3250] mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
    <div className="flex justify-center">
      <Image
        src={imgSrc}
        alt={title}
        width={400}
        height={500}
        className="rounded-lg shadow-xl object-cover"
      />
    </div>
  </div>
);

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/featured`,
      {
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="bg-[#efe8db]">
      {" "}
      {/* Using custom background color */}
      <Navbar />
      <main>
        {/* --- Hero Section --- */}
        <section className="bg-[#676f9d] py-24">
          {" "}
          {/* Outer container */}
          <div className="container mx-auto">
            {/* Inner content container */}
            <div className="bg-[#4a4e73] rounded-lg flex items-center justify-center min-h-[50vh] text-center text-white p-4">
              <div>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  Modern Batik. Cool Style.
                </h1>
                <h2 className="text-5xl md:text-7xl font-bold text-[#c7d9e5]">
                  Indonesian craftsmanship. Elevated
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* --- Origin of Batik Section --- */}
        <section className="bg-[#2d3250] p-6 text-center text-white shadow-lg">
          <div className="container mx-auto">
            <h3 className="font-semibold text-lg mb-2">The origins of batik</h3>
            <p className="text-sm max-w-3xl mx-auto text-gray-300">
              The origins of batik are widely debated, but batik truly evolved
              and became deeply rooted in the cultural fabric of Java.
            </p>
          </div>
        </section>

        {/* --- Feature Section --- */}
        <section className="bg-[#efe8db] py-20 px-6">
          <div className="container mx-auto text-center">
            <h2 className="text-6xl font-light text-[#2d3250] mb-16">
              Stay cool & elegant
            </h2>
            <div className="space-y-20">
              <FeatureCard
                title="Premium materials."
                description="We source only the finest modern batik fabric for unmatched quality and feel."
                imgSrc="/images 1.png"
              />
              <FeatureCard
                title="Contemporary design"
                description="Fusion with Javanese tradition with modern minimalism for a truly unique look."
                imgSrc="/image 14.png"
                reverse={true}
              />
              <FeatureCard
                title="Sustainable production."
                description="Crafted responsibly by skilled artisans in Indonesia, supporting local communities."
                imgSrc="/bawahnyadiskon15.png"
              />
            </div>
          </div>
        </section>

        {/* --- New Arrivals Section (Dynamic) --- */}
        <section className="bg-[#efe8db] py-20 px-6">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#2d3250] mb-12">
              New Arrivals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* --- CTA Banner --- */}
        <section className="bg-[#676f9d] text-white text-center py-10">
          <h3 className="text-4xl font-bold">15% OFF NOW!</h3>
        </section>

        {/* --- Full-width Image Banner --- */}
        <section>
          <Image
            src="/Rectangle 6479.png"
            alt="Batik fabrics"
            width={1920}
            height={500}
            className="w-full h-auto object-cover"
          />
        </section>

        {/* --- Photo Gallery --- */}
        <section className="bg-[#424669] py-20 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {" "}
              {/* Centered grid */}
              <Link
                href="/products/10"
                className="group col-span-1 row-span-1"
                legacyBehavior>
                <Image
                  src="/sustainable.png"
                  alt="Family wearing batik"
                  width={800}
                  height={800}
                  className="rounded-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <Link
                href="/products/11"
                className="group col-span-1 row-span-1"
                legacyBehavior>
                <Image
                  src="/premiumquality.png"
                  alt="Family gathering"
                  width={800}
                  height={800}
                  className="rounded-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <Link
                href="/products/16"
                className="group col-span-2 md:col-span-1"
                legacyBehavior>
                <Image
                  src="/sustainable.png"
                  alt="Couple in batik"
                  width={800}
                  height={1200}
                  className="rounded-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <Link
                href="/products/17"
                className="group col-span-2 md:col-span-1"
                legacyBehavior>
                <Image
                  src="/premiumquality.png"
                  alt="Mother and daughter in batik"
                  width={800}
                  height={1200}
                  className="rounded-lg object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
