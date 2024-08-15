"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaGasPump,
  FaSpinner,
  FaThList,
  FaThLarge,
  FaPlus,
} from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const StationProducts = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const stationName = params?.stationName as string;
  const stationId = searchParams.get("id");

  const [products, setProducts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4"
        role="alert"
      >
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );

  const GridView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {Object.entries(products).map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center mb-4">
            <FaGasPump className="text-2xl text-blue-500 mr-3" />
            <h2 className="text-xl font-semibold text-gray-700">{key}</h2>
          </div>
          <p className="text-3xl font-bold text-green-600">{value}</p>
        </motion.div>
      ))}
    </motion.div>
  );

  const ListView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(products).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6 text-center text-gray-800"
      >
        Products for {decodeURIComponent(stationName)}
      </motion.h1>
      <div className="flex justify-between mb-4">
        <div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={`relative p-2 overflow-hidden rounded-full transition-all duration-300 ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white"
                : "bg-white/20 backdrop-blur-lg border border-white/50 text-gray-800"
            } hover:shadow-lg hover:scale-105`}
            style={{ borderRadius: "12px" }}
          >
            <span
              className={`absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-opacity duration-300 ${
                viewMode === "grid" ? "opacity-30" : "opacity-0"
              }`}
            ></span>
            <FaThLarge className="relative z-10" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={`relative p-2 overflow-hidden rounded-full transition-all duration-300 ${
              viewMode === "list"
                ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white"
                : "bg-white/20 backdrop-blur-lg border border-white/50 text-gray-800"
            } hover:shadow-lg hover:scale-105`}
            style={{ borderRadius: "12px" }}
          >
            <span
              className={`absolute inset-0 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-opacity duration-300 ${
                viewMode === "list" ? "opacity-30" : "opacity-0"
              }`}
            ></span>
            <FaThList className="relative z-10" />
          </Button>
        </div>
        <Button
          variant="default"
          className="flex flex-row gap-1 bg-blue-500 hover:bg-blue-600 text-white sm:order-2"
          style={{ borderRadius: "6px" }}
        >
          <FaPlus className="mr-2" /> Add Product
        </Button>
      </div>
      {viewMode === "grid" ? <GridView /> : <ListView />}
    </div>
  );
};

export default StationProducts;
