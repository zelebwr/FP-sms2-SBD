"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingCart, UserCircle } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Set state to true if user has scrolled more than 10px, false otherwise
      setIsScrolled(window.scrollY > 10);
    };

    // Add event listener for scroll
    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? 'bg-[#2d3450] shadow-lg' : 'bg-transparent'}
      `}
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center text-white">
        {/* Logo */}
        <Link href="/" className="flex items-center">
            <div className="bg-white text-black rounded-full h-10 w-10 flex items-center justify-center font-serif text-2xl font-bold">
                J
            </div>
            <span className="ml-3 text-2xl font-light tracking-widest">JAVVA</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <Link href="/explore" className="hover:text-gray-300 transition-colors">Explore</Link>
          <Link href="/men" className="hover:text-gray-300 transition-colors">Men</Link>
          <Link href="/woman" className="hover:text-gray-300 transition-colors">Woman</Link>
          <Link href="/kids" className="hover:text-gray-300 transition-colors">Kids</Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-6">
          <button className="hover:text-gray-300 transition-colors"><Search size={20} /></button>
          <Link href="/wishlist" className="hover:text-gray-300 transition-colors"><Heart size={20} /></Link>
          <Link href="/cart" className="hover:text-gray-300 transition-colors"><ShoppingCart size={20} /></Link>
          <Link href="/login" className="hover:text-gray-300 transition-colors"><UserCircle size={20} /></Link>
        </div>
      </nav>
    </header>
  );
}