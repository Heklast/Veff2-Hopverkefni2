'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
  id: number;
  name: string;
  image: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [index, setIndex] = useState(0);
  const searchParams = useSearchParams();

  // Check for the forceRefresh query parameter and reload the page if present.
  useEffect(() => {
    if (searchParams.get('forceRefresh') === 'true') {
      // Reload the page without the query parameter
      window.location.replace(window.location.pathname);
    }
  }, [searchParams]);

  useEffect(() => {
    async function getProducts() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        console.error('Failed to fetch products');
        return;
      }
      const json = await res.json();
      setProducts(json.data || []);
    }
    getProducts();
  }, []);

  if (products.length === 0) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#666', fontSize: '1.2rem' }}>Engar vörur fundust</p>
      </main>
    );
  }

  const product = products[index];
  const next = () => setIndex((prev) => (prev + 1) % products.length);
  const prev = () => {
    setIndex((prev) =>
      products.length === 0 ? 0 : (prev - 1 + products.length) % products.length
    );
  };

  return (
    <main className="hero-wrapper">
      <Image
        src={product.image}
        alt={product.name}
        className="hero-image"
        width={800}  // Adjust width as needed
        height={600} // Adjust height as needed
        priority
      />
      <div className="hero-overlay">
        <h1 className="hero-title">{product.name}</h1>
        <Link href="/products" className="hero-button">
          Skoða allar vörur
        </Link>
        <div className="hero-controls">
          <button onClick={prev}>◀</button>
          <button onClick={next}>▶</button>
        </div>
      </div>
    </main>
  );
}
