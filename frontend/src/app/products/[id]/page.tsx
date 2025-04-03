'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import styles from './productDetail.module.css';

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

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  User: {
    username: string;
  };
};

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");
  const params = useParams();
  const { id } = params;

  // Fetch product details
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
      } catch {
        setError('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Fetch reviews for this product
  useEffect(() => {
    async function fetchReviews() {
      setReviewsLoading(true);
      try {
        // Assuming your reviews endpoint can filter by productId
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews?productId=${id}`, {
          cache: 'no-store',
        });
        if (!res.ok) {
          setReviewError("Error fetching reviews");
          return;
        }
        const json = await res.json();
        setReviews(json.data || []);
      } catch {
        setReviewError("Error fetching reviews");
      } finally {
        setReviewsLoading(false);
      }
    }
    if (id) {
      fetchReviews();
    }
  }, [id]);

  const addToBasket = () => {
    const basketStr = localStorage.getItem("basket");
    const basket: BasketItem[] = basketStr ? JSON.parse(basketStr) : [];
    // Check if product already exists in the basket
    const index = basket.findIndex(item => item.id === product!.id);
    if (index !== -1) {
      basket[index].quantity += 1;
    } else {
      basket.push({
        id: product!.id,
        name: product!.name,
        image: product!.image,
        price: product!.price || 0,
        quantity: 1
      });
    }
    localStorage.setItem("basket", JSON.stringify(basket));
    alert("Vörunni var bætt við körfuna!");
  };

  // Submit a new review
  const submitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to write a review.");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: Number(id),
          rating: newRating,
          comment: newComment
        })
      });
      if (!res.ok) {
        const data = await res.json();
        setReviewError(data.error || "Error creating review");
      } else {
        // Clear the form and refresh reviews list
        setNewRating(5);
        setNewComment("");
        const newReview = await res.json();
        setReviews([newReview, ...reviews]);
      }
    } catch {
      setReviewError("Error creating review");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No product found.</p>;

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
          <button onClick={addToBasket} className={styles.addToCartButton}>
            Bæta í körfu
          </button>
          <Link href="/products" className={styles.backLink}>
            Til baka
          </Link>

          {/* Reviews Section */}
          <div className={styles.reviewsSection}>
            <h2>Ummæli</h2>
            {reviewsLoading ? (
              <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p>Engin ummæli hafa verið skilin enn.</p>
            ) : (
              <ul className={styles.reviewsList}>
                {reviews.map(review => (
                  <li key={review.id} className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewerName}>
                        {review.User.username}
                      </span>
                      <span className={styles.reviewRating}>
                        {`⭐`.repeat(review.rating)}
                      </span>
                      <span className={styles.reviewDate}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={styles.reviewComment}>{review.comment}</p>
                  </li>
                ))}
              </ul>
            )}

            {/* Write a Review Form */}
            <div className={styles.reviewForm}>
              <h3>Skrifa ummæli</h3>
              {reviewError && <p style={{ color: "red" }}>{reviewError}</p>}
              <div>
                <label>
                  Stjörnur:
                  <select
                    value={newRating}
                    onChange={(e) => setNewRating(Number(e.target.value))}
                  >
                    {[1,2,3,4,5].map(star => (
                      <option key={star} value={star}>{star}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Skrifaðu ummæli hér..."
                  rows={4}
                  className={styles.reviewTextarea}
                />
              </div>
              <button onClick={submitReview} className={styles.submitReviewButton}>
                Senda ummæli
              </button>
            </div>
          </div>
        </div>
        {/* Right side: product image */}
        <div className={styles.imageContainer}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
