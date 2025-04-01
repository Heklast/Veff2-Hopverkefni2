'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
};

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch categories and check login status on mount
  useEffect(() => {
    async function getCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          cache: "no-store",
        });
        const json = await res.json();
        setCategories(json.data || []);
      } catch (error) {
        console.error("Error fetching categories in Header:", error);
      }
    }
    getCategories();

    // Check for token in localStorage to determine login state
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <header className="bg-white shadow-md border-b py-4 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-xl font-semibold hover:underline">
          <h1>Heimasíða Heklu og Óla</h1>
        </Link>
        <nav className="headerNav flex flex-wrap gap-4">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.id}`}>
              {cat.name}
            </Link>
          ))}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
              <Link href="/signup" className="hover:underline">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
