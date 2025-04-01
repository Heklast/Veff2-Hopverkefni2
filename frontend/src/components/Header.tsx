'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [basketCount, setBasketCount] = useState(0);

  useEffect(() => {
    // Check login status
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Get basket count from localStorage
    const basketStr = localStorage.getItem("basket");
    if (basketStr) {
      try {
        const basket = JSON.parse(basketStr);
        const count = basket.reduce(
          (acc: number, item: { quantity: number }) => acc + item.quantity,
          0
        );
        setBasketCount(count);
      } catch (error) {
        setBasketCount(0);
      }
    }
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
        <nav className="headerNav flex flex-wrap gap-4 items-center">
          <Link href="/basket" className="hover:underline">
            Karfa ({basketCount})
          </Link>
          {isLoggedIn && (
            <Link href="/orders" className="hover:underline">
              Pantanir
            </Link>
          )}
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
