'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <header className="header">
  <div className="header-inner">
    <Link href="/" className="logo">
      <h1>Vefverslun Heklu og Óla</h1>
    </Link>
    <nav className="headerNav">
      <Link href="/basket">Karfa</Link>
      {isLoggedIn && <Link href="/orders">Pantanir</Link>}
      {isLoggedIn ? (
        <button onClick={handleLogout}>Skrá út</button>
      ) : (
        <>
          <Link href="/login">Innskráning</Link>
          <Link href="/signup">Nýskráning</Link>
        </>
      )}
    </nav>
  </div>
</header>)
}
