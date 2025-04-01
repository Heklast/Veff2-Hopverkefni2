'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Product = {
  id: number;
  name: string;
  image: string;
  price?: number;
};

type Category = {
  id: number;
  name: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

  // Fetch categories from the API
  useEffect(() => {
    async function getCategories() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        console.error('Failed to fetch categories');
        return;
      }
      const json = await res.json();
      setCategories(json.data || []);
    }
    getCategories();
  }, []);

  // Fetch products, optionally filtered by category
  useEffect(() => {
    async function getProducts() {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/products`;
      if (selectedCategory !== 'all') {
        url += `?categoryId=${selectedCategory}`;
      }
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        console.error('Failed to fetch products');
        return;
      }
      const json = await res.json();
      setProducts(json.data || []);
    }
    getProducts();
  }, [selectedCategory]);

  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Allar Vörur</h1>

      {/* Category Filter */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label htmlFor="categorySelect" style={{ marginRight: '0.5rem' }}>
          Sía eftir flokki:
        </label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCategory(value === 'all' ? 'all' : Number(value));
          }}
        >
          <option value="all">Allir Flokkar</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product List */}
      <div
        className="Vorur"
        style={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        }}
      >
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div
              className="vara"
              style={{
                cursor: 'pointer',
                border: '1px solid #ddd',
                padding: '0.5rem',
                borderRadius: '4px',
              }}
            >
              {/* Image container with fixed height */}
              <div style={{ position: 'relative', width: '100%', height: '150px', marginBottom: '0.5rem' }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <h2 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
                {product.name}
              </h2>
              {product.price && <p style={{ color: '#555' }}>{product.price} kr</p>}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
