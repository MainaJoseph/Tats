"use client";

import React, { useState } from "react";
import ChartTwo from "@/app/components/dashboard_components/Charts/ChartTwo";

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

  return (
    <div className="w-full h-fit">
      <ChartTwo
        onSumCountChange={setSumCount}
        onSumVolumeChange={setSumVolume}
        onProductSumVolumesChange={setProductSumVolumes}
        onSumAmountChange={setSumAmount}
        onProductSumAmountsChange={setProductSumAmounts}
        onProductSumCountChange={setProductSumCount}
      />
    </div>
  );
};

export default ChartsPage;
