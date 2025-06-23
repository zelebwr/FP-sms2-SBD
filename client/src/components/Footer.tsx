import Link from 'next/link';
import { Twitter, Facebook, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2d3250] text-gray-300 py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo and Social */}
        <div>
          <div className="flex items-center mb-4">
            <div className="bg-white text-black rounded-full h-10 w-10 flex items-center justify-center font-serif text-2xl font-bold">
                J
            </div>
            <span className="ml-3 text-2xl font-light tracking-widest text-white">JAVVA</span>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Modern Batik. Cool Style. Indonesian craftsmanship. Elevated.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white"><Twitter size={20} /></a>
            <a href="#" className="hover:text-white"><Facebook size={20} /></a>
            <a href="#" className="hover:text-white"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white"><Youtube size={20} /></a>
          </div>
        </div>

        {/* Links Column */}
        <div>
          <h3 className="font-bold text-white mb-4">Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-white text-sm">Home</Link></li>
            <li><Link href="/explore" className="hover:text-white text-sm">Explore</Link></li>
            <li><Link href="/men" className="hover:text-white text-sm">Men</Link></li>
          </ul>
        </div>

        {/* Helps Column */}
        <div>
          <h3 className="font-bold text-white mb-4">Helps</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white text-sm">Privacy Policies</a></li>
            <li><a href="#" className="hover:text-white text-sm">Terms of delivery</a></li>
            <li><a href="#" className="hover:text-white text-sm">Frequently asked questions</a></li>
          </ul>
        </div>
        
        {/* Contact/Newsletter Column - Placeholder */}
         <div>
          <h3 className="font-bold text-white mb-4">Stay Connected</h3>
           <p className="text-sm text-gray-400 mb-4">Subscribe to our newsletter for the latest updates.</p>
           <div className="flex">
             <input type="email" placeholder="Your email" className="bg-gray-700 text-white px-3 py-2 rounded-l-md focus:outline-none w-full" />
             <button className="bg-[#f8b179] text-[#2d3250] px-4 py-2 rounded-r-md font-bold hover:bg-opacity-80">Subscribe</button>
           </div>
        </div>
        
      </div>
       <div className="container mx-auto px-6 mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} JAVVA E-Commerce. All Rights Reserved.
      </div>
    </footer>
  );
}