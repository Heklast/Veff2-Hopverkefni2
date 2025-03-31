'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Login failed');
        return;
      }

      const data = await res.json();
      localStorage.setItem('token', data.token);
      setSuccess('Login successful! Redirecting to homepage...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-skysoft to-blush">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="login-heading text-3xl font-bold font-heading text-charcoal mb-6 text-center">
          Login
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-charcoal"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-charcoal"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-charcoal text-white py-2 rounded-md hover:bg-opacity-90 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-charcoal hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
