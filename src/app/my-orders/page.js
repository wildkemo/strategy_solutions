"use client";
import { useEffect, useState } from "react";

export default function MyOrders({ userId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost/strategy_solutions_backend/app/Controllers/get_user_orders.php",
          // "http://localhost/www/oop_project/php_backend/app/Controllers/get_user_orders.php",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ userId }),
          }
        );
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  if (loading) return <div style={{ padding: 32 }}>Loading...</div>;
  if (error)
    return <div style={{ padding: 32, color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: "80px 32px 32px 32px" }}>
      <h1>My Orders</h1>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>ID</th>
            <th style={{ textAlign: "left", padding: 8 }}>Service Type</th>
            <th style={{ textAlign: "left", padding: 8 }}>Description</th>
            <th style={{ textAlign: "left", padding: 8 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td style={{ padding: 8 }}>{order.id}</td>
              <td style={{ padding: 8 }}>{order.service_type}</td>
              <td style={{ padding: 8 }}>{order.service_description}</td>
              <td style={{ padding: 8 }}>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
