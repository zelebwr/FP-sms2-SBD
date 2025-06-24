"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // --- Handle Token ---
      // For now, we'll log it. In a real app, you would store this
      // securely (e.g., in an httpOnly cookie).
      console.log('Login successful, token:', data.token);
      // localStorage.setItem('token', data.token); // A simple but less secure way
      
      // On successful login, redirect to the homepage
      router.push('/');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-5xl font-light text-white font-serif mb-2">J</h1>
            <h2 className="text-2xl font-light tracking-widest text-white">JAVVA</h2>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Login to your account</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div>
              <label className="block text-gray-300 text-sm mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#577c8e]"
                required
              />
            </div>
            <div>
                <div className="flex justify-between items-baseline">
                    <label className="block text-gray-300 text-sm mb-1" htmlFor="password">
                        Password
                    </label>
                    <a href="#" className="text-xs text-gray-400 hover:underline">Forgot?</a>
                </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#577c8e]"
                required
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#676f9d] text-white py-2 rounded-md hover:bg-[#52587a] transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Login now'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#f8b179] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}