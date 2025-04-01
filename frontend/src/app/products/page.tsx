'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  image: string;
  price?: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

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

  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Allar Vörur</h1>
      <div className='Vorur'>
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="vara" style={{ cursor: 'pointer' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '150px', objectFit: 'cover', marginBottom: '0.5rem' }}
              />
              <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{product.name}</h2>
              {product.price && <p style={{ color: '#555' }}>{product.price} kr</p>}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
