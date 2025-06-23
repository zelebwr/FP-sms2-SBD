import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can now use classes like `bg-javva-sand` or `text-javva-blue-dark`
        'javva-sand': '#efe8db',
        'javva-blue': {
          light: '#c7d9e5',
          DEFAULT: '#577c8e',
          medium: '#557c8a',
          dark: '#2f4157',
        },
        'javva-purple': {
          DEFAULT: '#676f9d',
          dark: '#424669',
          darker: '#2d3250',
        },
        'javva-accent': '#f8b179',
      },
      fontFamily: {
        // Note: The Inter font is already loaded in layout.tsx via next/font
        // This is just for reference if you add more fonts
        sans: ['var(--font-inter)'], 
      },
    },
  },
  plugins: [],
};