import ChartOne from "./ChartOne";
import ChartTwo from "./ChartTwo";
import ChartThree from "./ChartThree";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import React, { useState } from "react";

const Chart: React.FC = () => {
  const [sumCount, setSumCount] = useState<number>(0);

  const handleSumCountChange = (newSumCount: number) => {
    setSumCount(newSumCount);
  };

  return (
    <>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne onSumCountChange={handleSumCountChange} />
        <ChartTwo />
        <ChartThree />
      </div>
    </>
  );
};

export default Chart;
