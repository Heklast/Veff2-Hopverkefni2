'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

type BasketItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export default function BasketPage() {
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  useEffect(() => {
    const storedBasket = localStorage.getItem("basket");
    if (storedBasket) {
      setBasket(JSON.parse(storedBasket));
    }
  }, []);

  const removeItem = (id: number) => {
    const newBasket = basket.filter(item => item.id !== id);
    setBasket(newBasket);
    localStorage.setItem("basket", JSON.stringify(newBasket));
  };

  const placeOrder = async () => {
    const orderItems = basket.map(item => ({
      productId: item.id,
      quantity: item.quantity,
    }));
  
    const token = localStorage.getItem("token"); // Read token
  
    try {
      setPlacingOrder(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Add Authorization header
        },
        body: JSON.stringify({ items: orderItems }),
      });
      if (!res.ok) {
        const data = await res.json();
        setOrderError(data.error || "Error placing order");
      } else {
        setOrderSuccess("Pöntun tókst!");
        setBasket([]);
        localStorage.removeItem("basket");
      }
    } catch {
      setOrderError("Error placing order");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Karfan</h1>
      {basket.length === 0 ? (
        <p>Karfan er tóm.</p>
      ) : (
        <div>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {basket.map(item => (
              <li key={item.id} style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "1rem" }}
                />
                <div>
                  <h2>{item.name}</h2>
                  <p>{item.price} kr x {item.quantity}</p>
                  <button onClick={() => removeItem(item.id)}>Fjarlægja</button>
                </div>
              </li>
            ))}
          </ul>
          {orderError && <p style={{ color: "red" }}>{orderError}</p>}
          {orderSuccess && <p style={{ color: "green" }}>{orderSuccess}</p>}
          <button onClick={placeOrder} disabled={placingOrder}>
            {placingOrder ? "Pöntun er í gangi..." : "Staðfesta pöntun"}
          </button>
        </div>
      )}
      <Link href="/products">Til baka</Link>
    </main>
  );
}
