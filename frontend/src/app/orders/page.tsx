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
      } catch {
        setError("Error fetching orders");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <p>...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <main className="ordersPage">
  <h1 className="ordersHeading">Þínar pantanir</h1>
  {orders.length === 0 ? (
    <p>Engar pantanir fundust.</p>
  ) : (
    <div>
      {orders.map((order) => (
        <div key={order.id} className="orderCard">
          <h2>Pöntun #{order.id}</h2>
          <p>Status: {order.status}</p>
          <p>Heildarupphæð: {order.totalAmount} kr</p>
          <p>Dagsetning: {new Date(order.orderDate).toLocaleString()}</p>
          <h3>Vörur:</h3>
          <ul className="orderItemsList">
            {order.OrderItem.map((item) => (
              <li key={item.id} className="orderItem">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.Product.image}
                  alt={item.Product.name}
                />
                <span>
                  {item.Product.name} – {item.price} kr x {item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )}
  <Link href="/products" className="backLink">Aftur í vörur</Link>
</main>
  );
}
