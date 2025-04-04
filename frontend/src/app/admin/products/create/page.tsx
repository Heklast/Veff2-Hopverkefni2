'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
};

export default function CreateProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in as an admin to create a product.");
      setLoading(false);
      return;
    }

    // Create the payload and log it
    const payload = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      categoryId: Number(categoryId)
    };
    console.log("Posting product payload:", payload);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      console.log("Response status:", res.status);
      if (!res.ok) {
        const data = await res.json();
        console.error("Error response from server:", data);
        throw new Error(data.error || "Error creating product");
      }
      const responseData = await res.json();
      console.log("Response data:", responseData);
      
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
      
        const imageRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${responseData.id}/image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          body: formData,
        });
      
        if (!imageRes.ok) {
          const data = await imageRes.json();
          console.error("Image upload failed:", data);
          throw new Error(data.error || "Image upload failed");
        }
      
        console.log("Image uploaded successfully");
        setSuccess("Product and image uploaded successfully!");
      }
      setSuccess("Product created successfully!");
      // Redirect back to admin products after a short delay
      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Error creating product:", err.message);
      } else {
        setError("Error creating product");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Create New Product</h1>
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
          onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
          required
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value === "" ? "" : Number(e.target.value))}
          required
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
  }}
  required
/>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "1rem" }}>{success}</p>}
      <Link href="/admin/products" style={{ display: "block", marginTop: "1rem" }}>
        Back to Admin Products
      </Link>
    </div>
  );
}
