'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
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
          {isLoggedIn ? (
            <button onClick={handleLogout} className="hover:underline">
              Skrá út
            </button>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Innskráning
              </Link>
              <Link href="/signup" className="hover:underline">
                Nýskráning
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
