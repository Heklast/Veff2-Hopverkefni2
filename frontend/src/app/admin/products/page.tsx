'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simple JWT decode function to extract payload
  function decodeJWT(token: string) {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You do not have admin privileges");
      setLoading(false);
      return;
    }
    const decoded = decodeJWT(token);
    if (!decoded || decoded.role !== "admin") {
      setError("You do not have admin privileges");
      setLoading(false);
      return;
    }

    async function fetchProducts() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          cache: 'no-store',
        });
        if (!res.ok) {
          throw new Error("Error fetching products");
        }
        const json = await res.json();
        // Assuming the public route returns { data: products, ... }
        setProducts(json.data || json);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error fetching products");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const token = localStorage.getItem("token");
    try {
      // Call the DELETE endpoint from products.js (protected by admin middleware)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error("Failed to delete product");
      }
      setProducts(products.filter(p => p.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Product Management</h1>
      <Link href="/admin/products/create">Add New Product</Link>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>ID</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Name</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Price</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Stock</th>
            <th style={{ borderBottom: "1px solid #ddd", padding: "0.5rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod.id}>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{prod.id}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{prod.name}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{prod.price} kr</td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>{prod.stock}</td>
              <td style={{ borderBottom: "1px solid #eee", padding: "0.5rem" }}>
                <Link href={`/admin/products/edit/${prod.id}`}>Edit</Link>
                <button style={{ marginLeft: "1rem" }} onClick={() => handleDelete(prod.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
