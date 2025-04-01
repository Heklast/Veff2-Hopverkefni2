'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './ProductDetail.module.css';

type Product = {
  id: number;
  name: string;
  image: string;
  description?: string;
  price?: number;
  // Optionally, you can add more fields such as brand, color, etc.
};

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
          cache: 'no-store',
        });
        if (!res.ok) {
          setError('Product not found or an error occurred.');
          return;
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No product found.</p>;

  // Example placeholders (since brand, colors, sizes aren’t in your current schema):
  const colors = ['Anthracite', 'White'];
  const sizes = [32, 34, 36, 38];
  const lengthOptions = [30];

  return (
    <main className={styles.main}>
      <div className={styles.productDetailContainer}>
        {/* Left side: textual info */}
        <div className={styles.infoContainer}>
          {/* Product name */}
          <h1 className={styles.productName}>{product.name}</h1>

          {/* Price */}
          {product.price && (
            <p className={styles.price}>{product.price} kr</p>
          )}

          {/* Description */}
          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}

          {/* Example color options */}
          <div className={styles.optionsContainer}>
            <span className={styles.colorLabel}>Litur:</span>
            <div className={styles.colorOptions}>
              {colors.map((color) => (
                <button key={color} className={styles.optionButton}>
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Example size options */}
          <div className={styles.optionsContainer}>
            <span className={styles.sizeLabel}>Stærð:</span>
            <div className={styles.sizeOptions}>
              {sizes.map((size) => (
                <button key={size} className={styles.optionButton}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Example length options */}
          <div className={styles.optionsContainer}>
            <span className={styles.sizeLabel}>Sídd:</span>
            <div className={styles.sizeOptions}>
              {lengthOptions.map((length) => (
                <button key={length} className={styles.optionButton}>
                  {length}
                </button>
              ))}
            </div>
          </div>

          {/* Add to cart button (placeholder) */}
          <button className={styles.addToCartButton}>Bæta í körfu</button>

          {/* Back link */}
          <Link href="/products" className={styles.backLink}>
            Til baka
          </Link>
        </div>

        {/* Right side: product image */}
        <div className={styles.imageContainer}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.bigImage}
          />
        </div>
      </div>
    </main>
  );
}
