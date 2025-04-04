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
      setError("Þú ert ekki admin");
      setLoading(false);
      return;
    }
    const decoded = decodeJWT(token);
    if (!decoded || decoded.role !== "admin") {
      setError("Þú ert ekki admin");
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
    if (!confirm("Ertu viss um að þú viljir eyða?")) return;
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
        throw new Error("Gekk ekki að eyða");
      }
      setProducts(products.filter(p => p.id !== id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gekk ekki að eyða");
    }
  };

  if (loading) return <p>...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="adminPage">
  <h1 className="adminHeading">Admin Síða</h1>
  <Link href="/admin/products/create" className="adminAddLink">
    Bæta við vöru
  </Link>

  <table className="adminTable">
    <thead>
      <tr>
        <th>Heiti</th>
        <th>Verð</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {products.map(prod => (
        <tr key={prod.id}>
          <td>{prod.name}</td>
          <td>{prod.price} kr</td>
          <td className="adminActions">
            <Link href={`/admin/products/edit/${prod.id}`}>Breyta</Link>
            <button onClick={() => handleDelete(prod.id)}>Eyða</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  );
}
