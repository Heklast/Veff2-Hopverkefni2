'use client';

import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-skysoft to-blush">
      <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="login-heading text-3xl font-bold font-heading text-charcoal mb-6 text-center">
            Login
        </h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
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
