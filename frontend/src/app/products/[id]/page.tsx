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
};

type BasketItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
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

  const addToBasket = () => {
    const basketStr = localStorage.getItem("basket");
    let basket: BasketItem[] = basketStr ? JSON.parse(basketStr) : [];
    // Check if product already exists in the basket
    const index = basket.findIndex(item => item.id === product.id);
    if (index !== -1) {
      basket[index].quantity += 1;
    } else {
      basket.push({
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price || 0,
        quantity: 1
      });
    }
    localStorage.setItem("basket", JSON.stringify(basket));
    alert("Vörunni var bætt við körfuna!");
  };

  return (
    <main className={styles.main}>
      <div className={styles.productDetailContainer}>
        {/* Left side: textual info */}
        <div className={styles.infoContainer}>
          <h1 className={styles.productName}>{product.name}</h1>
          {product.price && (
            <p className={styles.price}>{product.price} kr</p>
          )}
          {product.description && (
            <p className={styles.description}>{product.description}</p>
          )}
          {/* Add to basket button */}
          <button onClick={addToBasket} className={styles.addToCartButton}>
            Bæta í körfu
          </button>
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
