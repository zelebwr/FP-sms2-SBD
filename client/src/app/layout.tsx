import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configure the Inter font
const inter = Inter({ 
    subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: "Javva E-Commerce",
  description: "Modern oriental fashion.",
};

export default function RootLayout({ children, }: 
  Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
