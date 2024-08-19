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
  FaSearch,
  FaSadTear,
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
import { Input } from "@/components/ui/input";
import { AddProductModal } from "./add-product-modal";

interface Product {
  [key: string]: string;
}

const StationProducts: React.FC = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const stationName = params?.stationName as string;
  const stationId = searchParams.get("id");

  const [products, setProducts] = useState<Product>({});
  const [filteredProducts, setFilteredProducts] = useState<Product>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    if (stationId) {
      fetchProducts();
    }
  }, [stationId]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const fetchProducts = async (): Promise<void> => {
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
      setFilteredProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = (): void => {
    if (searchTerm === "") {
      setFilteredProducts(products);
    } else {
      const filtered = Object.entries(products).reduce((acc, [key, value]) => {
        if (
          key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          value.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          acc[key] = value;
        }
        return acc;
      }, {} as Product);
      setFilteredProducts(filtered);
    }
  };

  const handleProductAdded = (): void => {
    fetchProducts();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <FaSadTear className="text-6xl text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );

  const GridView: React.FC = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(filteredProducts).map(([key, value], index) => (
        <motion.div
          key={index}
          className="bg-white p-4 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <h3 className="text-lg font-semibold mb-2">{key}</h3>
          <p className="text-gray-600">{value}</p>
        </motion.div>
      ))}
    </div>
  );

  const ListView: React.FC = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(filteredProducts).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell>{key}</TableCell>
            <TableCell>{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const EmptyState: React.FC = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg"
    >
      <FaSadTear className="text-6xl text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">
        Oops! No products found
      </h2>
      <p className="text-gray-500 text-center max-w-md">
        It looks like {decodeURIComponent(stationName)} is taking a break from
        selling products. Maybe they are out chasing rainbows or hunting for
        unicorns?
      </p>

      <AddProductModal
        stationId={stationId || ""}
        onProductAdded={handleProductAdded}
      />
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Products for {decodeURIComponent(stationName)}
      </h1>
      <div className="flex items-center mb-4 space-x-4">
        <div className="flex space-x-2">
          <Button
            onClick={() => setViewMode("grid")}
            className={`relative p-2 overflow-hidden rounded-full transition-all duration-300 ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white"
                : "bg-white/20 backdrop-blur-lg border border-white/50 text-gray-800"
            } hover:shadow-lg hover:scale-105`}
            style={{ borderRadius: "12px" }}
          >
            <FaThLarge />
          </Button>
          <Button
            onClick={() => setViewMode("list")}
            className={`relative p-2 overflow-hidden rounded-full transition-all duration-300 ${
              viewMode === "list"
                ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white"
                : "bg-white/20 backdrop-blur-lg border border-white/50 text-gray-800"
            } hover:shadow-lg hover:scale-105`}
            style={{ borderRadius: "12px" }}
          >
            <FaThList />
          </Button>
        </div>

        <div className="flex-grow relative">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="w-full h-12 pl-4 pr-12 text-lg rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <AddProductModal
          stationId={stationId || ""}
          onProductAdded={handleProductAdded}
        />
      </div>

      {Object.keys(filteredProducts).length === 0 ? (
        <EmptyState />
      ) : viewMode === "grid" ? (
        <GridView />
      ) : (
        <ListView />
      )}
    </div>
  );
};

export default StationProducts;
