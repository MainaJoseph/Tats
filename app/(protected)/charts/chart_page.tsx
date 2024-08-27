"use client";

import React, { useState, useEffect } from "react";
import ChartTwo from "@/app/components/dashboard_components/Charts/ChartTwo";
import { MdAttachMoney, MdOutlineWaterDrop } from "react-icons/md";
import CardDataStats from "@/app/components/dashboard_components/CardDataStatsDashy";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { FaUserFriends } from "react-icons/fa";

// Utility functions
const truncateToTwoDecimals = (num: number): string => {
  return num.toFixed(2);
};

const formatNumberWithCommas = (num: number): string => {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ChartsPage = () => {
  const [sumCount, setSumCount] = useState(0);
  const [sumVolume, setSumVolume] = useState(0);
  const [productSumVolumes, setProductSumVolumes] = useState<
    Record<string, number>
  >({});
  const [sumAmount, setSumAmount] = useState(0);
  const [productSumAmounts, setProductSumAmounts] = useState<
    Record<string, number>
  >({});
  const [productSumCount, setProductSumCount] = useState<
    Record<string, number>
  >({});

  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading delay on initial load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show skeleton when data changes
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    sumCount,
    sumVolume,
    sumAmount,
    productSumVolumes,
    productSumAmounts,
    productSumCount,
  ]);

  const CardSkeleton = () => (
    <Card className="p-6 bg-white shadow-md rounded-lg">
      <CardHeader>
        <Skeleton className="h-4 w-1/3 bg-slate-300" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-full mb-4 bg-slate-300" />
        <Skeleton className="h-4 w-2/3 bg-slate-300" />
      </CardContent>
    </Card>
  );

  const handleCardExpand = (cardId: string) => {
    setExpandedCard((prevCard) => (prevCard === cardId ? null : cardId));
  };

  const handleCardHover = (cardId: string | null) => {
    setHoveredCard(cardId);
  };

  return (
    <div className="w-full h-fit">
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
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
              isExpanded={expandedCard === "amount" || hoveredCard === "amount"}
              onExpand={() => handleCardExpand("amount")}
            >
              <MdAttachMoney size={26} className="text-slate-800" />
            </CardDataStats>

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
              isExpanded={expandedCard === "volume" || hoveredCard === "volume"}
              onExpand={() => handleCardExpand("volume")}
            >
              <MdOutlineWaterDrop size={20} className="text-slate-800" />
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
              isExpanded={
                expandedCard === "customers" || hoveredCard === "customers"
              }
              onExpand={() => handleCardExpand("customers")}
            >
              <FaUserFriends size={23} className="text-slate-800" />
            </CardDataStats>
          </>
        )}
      </div>

      <div className="mt-10">
        <ChartTwo
          onSumCountChange={setSumCount}
          onSumVolumeChange={setSumVolume}
          onProductSumVolumesChange={setProductSumVolumes}
          onSumAmountChange={setSumAmount}
          onProductSumAmountsChange={setProductSumAmounts}
          onProductSumCountChange={setProductSumCount}
        />
      </div>
    </div>
  );
};

export default ChartsPage;
