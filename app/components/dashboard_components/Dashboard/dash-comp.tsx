"use client";
import React, { useState } from "react";
import ChartOne from "../Charts/ChartOne";
import { BsFuelPumpDieselFill } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import CardDataStats from "../CardDataStatsDashy";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import TableOne from "../Tables/TableOne";

// Utility functions
const truncateToTwoDecimals = (num: number): string => {
  return num.toFixed(2);
};

const formatNumberWithCommas = (num: number): string => {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Dashy: React.FC = () => {
  const [sumCount, setSumCount] = useState<number>(0);
  const [sumVolume, setSumVolume] = useState<number>(0);
  const [sumAmount, setSumAmount] = useState<number>(0);
  const [productSumVolumes, setProductSumVolumes] = useState<
    Record<string, number>
  >({});
  const [productSumAmounts, setProductSumAmounts] = useState<
    Record<string, number>
  >({});
  const [productSumCount, setProductSumCount] = useState<
    Record<string, number>
  >({});
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const handleCardExpand = (cardId: string) => {
    setExpandedCard((prevCard) => (prevCard === cardId ? null : cardId));
  };

  // Map of product names to colors
  const productColors: Record<string, string> = {
    DIESEL: "bg-purple-600",
    SUPER: "bg-blue-500",
    "DIESEL BULK": "bg-orange-500",
    "SUPER BULK": "bg-green-500",
  };

  // Derive product names from keys of productSumVolumes
  const products = Object.keys(productSumVolumes).map((productName) => ({
    name: productName,
    color: productColors[productName] || "bg-gray-500", // Default color if not found
  }));

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-1/3 space-y-4">
          <Card className="p-4 bg-white shadow-md rounded-lg">
            <CardHeader>
              <CardDescription className="text-md font-semibold mb-2">
                Products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {products.map((product, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-gray-800">{product.name}</span>
                    <span
                      className={`w-10 h-2 rounded-full ${product.color}`}
                    ></span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <CardDataStats
            id="volume"
            title="Volume Stats"
            total={`Total: ${truncateToTwoDecimals(sumVolume)}`}
            details={Object.fromEntries(
              Object.entries(productSumVolumes).map(([key, value]) => [
                key,
                { volume: value },
              ])
            )}
            isExpanded={expandedCard === "volume"}
            onExpand={() => handleCardExpand("volume")}
          >
            <BsFuelPumpDieselFill size={20} className="text-slate-800" />
          </CardDataStats>

          <CardDataStats
            id="amount"
            title="Amount Stats"
            total={`Total: ${formatNumberWithCommas(sumAmount)}`}
            details={Object.fromEntries(
              Object.entries(productSumAmounts).map(([key, value]) => [
                key,
                { amount: value },
              ])
            )}
            isExpanded={expandedCard === "amount"}
            onExpand={() => handleCardExpand("amount")}
          >
            <MdAttachMoney size={26} className="text-slate-800" />
          </CardDataStats>

          <CardDataStats
            id="customers"
            title="Customers Served"
            total={`Total: ${sumCount}`}
            details={Object.fromEntries(
              Object.entries(productSumCount).map(([key, value]) => [
                key,
                { count: value },
              ])
            )}
            isExpanded={expandedCard === "customers"}
            onExpand={() => handleCardExpand("customers")}
          >
            <FaUserFriends size={23} className="text-slate-800" />
          </CardDataStats>
        </div>

        <div className="w-full md:w-2/3">
          <ChartOne
            onSumCountChange={setSumCount}
            onSumVolumeChange={setSumVolume}
            onProductSumVolumesChange={setProductSumVolumes}
            onSumAmountChange={setSumAmount}
            onProductSumAmountsChange={setProductSumAmounts}
            onProductSumCountChange={setProductSumCount}
          />
        </div>
      </div>
      <div className="col-span-12 xl:col-span-8 mt-3">
        <TableOne />
      </div>
    </>
  );
};

export default Dashy;
