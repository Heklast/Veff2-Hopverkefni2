'use client';

import Link from 'next/link';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-left mb-1">Email</label>
            <input id="email" type="email" className="border rounded px-3 py-2 w-full" placeholder="Email" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-left mb-1">Password</label>
            <input id="password" type="password" className="border rounded px-3 py-2 w-full" placeholder="Password" />
          </div>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Sign Up
          </button>
        </form>
        <p className="mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </main>
  );
}
