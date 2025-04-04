'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
};

export default function EditProductPage() {
  const router = useRouter();
  const { id: productId } = useParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch categories for the dropdown
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Error fetching categories");
        }
        const json = await res.json();
        setCategories(json.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // Fetch product details
  useEffect(() => {
    if (!productId) {
      setError("No product ID provided.");
      setFetching(false);
      return;
    }

    async function fetchProduct() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Error fetching product details");
        }
        const data: Product = await res.json();
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price);
        setStock(data.stock);
        setCategoryId(data.categoryId);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Error fetching product");
      } finally {
        setFetching(false);
      }
    }
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in as an admin to edit a product.");
      setLoading(false);
      return;
    }

    const payload = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      categoryId: Number(categoryId)
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error updating product");
      }
      const updatedProduct = await res.json();
      setSuccess("Product updated successfully!");
      // Redirect back to the admin products page after a short delay
      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error updating product");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <p>Loading product details...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Breyta upplýsingum um vöru</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "400px"
        }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value === "" ? "" : Number(e.target.value))
          }
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value === "" ? "" : Number(e.target.value))
          }
          required
        />
        <select
          value={categoryId}
          onChange={(e) =>
            setCategoryId(e.target.value === "" ? "" : Number(e.target.value))
          }
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Staðfesta"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "1rem" }}>{success}</p>}
      <Link href="/admin/products" style={{ display: "block", marginTop: "1rem" }}>
        Aftur á Admin síðu
      </Link>
    </div>
  );
}
