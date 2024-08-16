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

interface Product {
  [key: string]: string;
}

const StationProducts = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const stationName = params?.stationName as string;
  const stationId = searchParams.get("id");

  const [products, setProducts] = useState<Product>({});
  const [filteredProducts, setFilteredProducts] = useState<Product>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (stationId) {
      fetchProducts();
    }
  }, [stationId]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

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
      setFilteredProducts(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
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
      {Object.entries(filteredProducts).map(([key, value], index) => (
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
        {Object.entries(filteredProducts).map(([key, value]) => (
          <TableRow key={key}>
            <TableCell className="font-medium">{key}</TableCell>
            <TableCell>{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const EmptyState = () => (
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
      <Button
        variant="default"
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
        onClick={() => {
          /* Implement add product functionality */
        }}
        style={{ borderRadius: "6px" }}
      >
        <FaPlus className="mr-2" /> Add the first product
      </Button>
    </motion.div>
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
      <div className="flex flex-col md:flex-row justify-between mb-4 items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-2">
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
        <div className="flex-grow mx-4 max-w-3xl w-full">
          <div className="relative">
            <Input
              type="text"
              placeholder={`Search products for ${decodeURIComponent(
                stationName
              )}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-4 pr-12 text-lg rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={filterProducts}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
            >
              <FaSearch className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <Button
          variant="default"
          className="flex flex-row gap-1 bg-blue-500 hover:bg-blue-600 text-white"
          style={{ borderRadius: "6px" }}
        >
          <FaPlus className="mr-2" /> Add Product
        </Button>
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
