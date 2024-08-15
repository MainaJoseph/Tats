"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const StationProducts = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const stationName = params?.stationName as string;
  const stationId = searchParams.get("id");

  const [products, setProducts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (stationId) {
      fetchProducts();
    }
  }, [stationId]);

  const fetchProducts = async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const response = await fetch(
        `${apiBaseUrl}/stations/${stationId}/products`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Products for Station: {decodeURIComponent(stationName)}</h1>
      <ul>
        {Object.entries(products).map(([key, value]) => (
          <li key={key}>
            {key}: {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StationProducts;
