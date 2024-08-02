"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ReportItem {
  datetime: string;
  productname: string;
  volume: number;
  amount: number;
  count: number;
}

interface ApiResponse {
  products: string[];
  report: ReportItem[];
  xAxisColumns: string[];
  xAxisColumnsLabels: string[];
  sumCount: number;
  sumVolume: number;
  productSumVolumes: Record<string, number>;
  sumAmount: number;
  productSumAmounts: Record<string, number>;
  productSumCount: Record<string, number>;
}

// Define a color mapping for the products
const productColors: Record<string, string> = {
  DIESEL: "#7C3AED",
  SUPER: "#3B82F6",
  "DIESEL BULK": "#F97316",
  "SUPER BULK": "#10B981",
};

const getCurrentDateTime = () => {
  const date = new Date();
  return date.toISOString().slice(0, 19).replace("T", " ");
};

const getPastDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

const getStartOfYearDate = () => {
  const date = new Date(new Date().getFullYear(), 0, 1);
  return date.toISOString().split("T")[0];
};

const ChartOne: React.FC<{
  onSumCountChange: (sumCount: number) => void;
  onSumVolumeChange: (sumVolume: number) => void;
  onProductSumVolumesChange: (
    productSumVolumes: Record<string, number>
  ) => void;
  onSumAmountChange: (sumAmount: number) => void;
  onProductSumAmountsChange: (
    productSumAmounts: Record<string, number>
  ) => void;
  onProductSumCountChange: (productSumCount: Record<string, number>) => void;
}> = ({
  onSumCountChange,
  onSumVolumeChange,
  onProductSumVolumesChange,
  onSumAmountChange,
  onProductSumAmountsChange,
  onProductSumCountChange,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [timeFrame, setTimeFrame] = useState<string>("day");
  const [xAxisLabels, setXAxisLabels] = useState<string[]>([]);

  const fetchData = async (timeFrame: string) => {
    const currentDateTime = getCurrentDateTime();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    let url = "";
    let fromDateTime = currentDateTime;

    switch (timeFrame) {
      case "day":
        url = `${apiBaseUrl}/reports/v2/2?clientId=2&reportType=hour&fromDateTime=${currentDateTime}`;
        break;
      case "week":
        fromDateTime = getPastDate(7);
        url = `${apiBaseUrl}/reports/v2/2?clientId=2&reportType=day&fromDateTime=${fromDateTime}&toDateTime=${currentDateTime}`;
        break;
      case "month":
        fromDateTime = getStartOfYearDate();
        url = `${apiBaseUrl}/reports/v2/2?clientId=2&reportType=month&fromDateTime=${fromDateTime}&toDateTime=${currentDateTime}`;
        break;
      default:
        url = `${apiBaseUrl}/reports/v2/2?clientId=2&reportType=hour&fromDateTime=${currentDateTime}`;
    }

    try {
      const response = await axios.get<ApiResponse>(url);
      const responseData = response.data;
      const { products, report, xAxisColumns, xAxisColumnsLabels } =
        responseData;

      const formattedData = xAxisColumns.map((datetime, index) => {
        const dataItem: any = { datetime, label: xAxisColumnsLabels[index] };
        products.forEach((product) => {
          const reportItem = report.find(
            (item) => item.datetime === datetime && item.productname === product
          );
          dataItem[product] = reportItem ? reportItem.amount : 0;
        });
        return dataItem;
      });

      setData(formattedData);
      setXAxisLabels(xAxisColumnsLabels);
      onSumCountChange(responseData.sumCount);
      onSumVolumeChange(responseData.sumVolume);
      onProductSumVolumesChange(responseData.productSumVolumes);
      onSumAmountChange(responseData.sumAmount);
      onProductSumAmountsChange(responseData.productSumAmounts);
      onProductSumCountChange(responseData.productSumCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(timeFrame);
  }, [timeFrame]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <Tabs value={timeFrame} onValueChange={setTimeFrame}>
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(productColors).map((product) => (
              <Line
                key={product}
                type="monotone"
                dataKey={product}
                stroke={productColors[product]}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ChartOne;
