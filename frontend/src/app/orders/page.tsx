'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderItem = {
  id: number;
  Product: {
    id: number;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  status: string;
  totalAmount: number;
  orderDate: string;
  OrderItem: OrderItem[];
};

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token available. Please log in.");
      setLoading(false);
      return;
    }
    async function fetchOrders() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          cache: "no-store"
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || "Error fetching orders");
          setLoading(false);
          return;
        }
        const json = await res.json();
        setOrders(json.data || []);
      } catch (err) {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                border: "1px solid #ddd",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "4px"
              }}
            >
              <h2>Order #{order.id}</h2>
              <p>Status: {order.status}</p>
              <p>Total Amount: {order.totalAmount} kr</p>
              <p>Order Date: {new Date(order.orderDate).toLocaleString()}</p>
              <h3>Items:</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {order.OrderItem.map((item) => (
                  <li key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                    <img
                      src={item.Product.image}
                      alt={item.Product.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "0.5rem" }}
                    />
                    <span>
                      {item.Product.name} - {item.price} kr x {item.quantity}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <Link href="/products">Back to Products</Link>
    </main>
  );
}
