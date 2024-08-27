"use client";

import React, { useState } from "react";
import ChartOne from "./ChartOne";
import ChartTwo from "./ChartTwo";
import ChartThree from "./ChartThree";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

const ChartWrapper: React.FC = () => {
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

  const handleSumCountChange = (newSumCount: number) => {
    setSumCount(newSumCount);
  };

  const handleSumVolumeChange = (newSumVolume: number) => {
    setSumVolume(newSumVolume);
  };

  const handleProductSumVolumesChange = (
    newProductSumVolumes: Record<string, number>
  ) => {
    setProductSumVolumes(newProductSumVolumes);
  };

  const handleSumAmountChange = (newSumAmount: number) => {
    setSumAmount(newSumAmount);
  };

  const handleProductSumAmountsChange = (
    newProductSumAmounts: Record<string, number>
  ) => {
    setProductSumAmounts(newProductSumAmounts);
  };

  const handleProductSumCountChange = (
    newProductSumCount: Record<string, number>
  ) => {
    setProductSumCount(newProductSumCount);
  };

  return (
    <>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne
          onSumCountChange={handleSumCountChange}
          onSumVolumeChange={handleSumVolumeChange}
          onProductSumVolumesChange={handleProductSumVolumesChange}
          onSumAmountChange={handleSumAmountChange}
          onProductSumAmountsChange={handleProductSumAmountsChange}
          onProductSumCountChange={handleProductSumCountChange}
        />
        <ChartTwo
          onSumCountChange={handleSumCountChange}
          onSumVolumeChange={handleSumVolumeChange}
          onProductSumVolumesChange={handleProductSumVolumesChange}
          onSumAmountChange={handleSumAmountChange}
          onProductSumAmountsChange={handleProductSumAmountsChange}
          onProductSumCountChange={handleProductSumCountChange}
        />
        <ChartThree />
      </div>
    </>
  );
};

export default ChartWrapper;
