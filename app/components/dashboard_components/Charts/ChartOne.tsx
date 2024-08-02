"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { X } from "lucide-react";
import { AiOutlineFullscreen } from "react-icons/ai";

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

const generateHourlyLabels = () => {
  const currentHour = new Date().getHours();
  return Array.from(
    { length: currentHour + 1 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );
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
  const [chartType, setChartType] = useState<"line" | "bar" | "area">("line");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      let formattedData;
      let labels;

      if (timeFrame === "day") {
        labels = generateHourlyLabels();
        formattedData = labels.map((label) => {
          const dataItem: any = { datetime: label, label };
          products.forEach((product) => {
            const reportItem = report.find(
              (item) =>
                item.datetime.includes(label) && item.productname === product
            );
            dataItem[product] = reportItem ? reportItem.amount : 0;
          });
          return dataItem;
        });
      } else {
        formattedData = xAxisColumns.map((datetime, index) => {
          const dataItem: any = { datetime, label: xAxisColumnsLabels[index] };
          products.forEach((product) => {
            const reportItem = report.find(
              (item) =>
                item.datetime === datetime && item.productname === product
            );
            dataItem[product] = reportItem ? reportItem.amount : 0;
          });
          return dataItem;
        });
        labels = xAxisColumnsLabels;
      }

      setData(formattedData);
      setXAxisLabels(labels);
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

  const renderChart = (height: number | string = 350) => {
    return (
      <ResponsiveContainer width="100%" height={height}>
        {chartType === "line" ? (
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
        ) : chartType === "bar" ? (
          <BarChart data={data}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(productColors).map((product) => (
              <Bar
                key={product}
                dataKey={product}
                fill={productColors[product]}
              />
            ))}
          </BarChart>
        ) : (
          <AreaChart data={data}>
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            {Object.keys(productColors).map((product) => (
              <Area
                key={product}
                type="monotone"
                dataKey={product}
                stroke={productColors[product]}
                fill={productColors[product]}
              />
            ))}
          </AreaChart>
        )}
      </ResponsiveContainer>
    );
  };

  const renderChartControls = () => (
    <>
      <div className="flex justify-center mb-6">
        <div className="inline-flex rounded-md shadow-sm">
          {["day", "week", "month"].map((frame) => (
            <button
              key={frame}
              onClick={() => setTimeFrame(frame)}
              className={`px-4 py-2 text-sm font-medium ${
                timeFrame === frame
                  ? "text-blue-700 bg-blue-100 border-blue-300"
                  : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300"
              } ${
                frame === "day"
                  ? "rounded-l-lg"
                  : frame === "month"
                  ? "rounded-r-lg"
                  : ""
              } border ${
                frame === "week" ? "border-l-0 border-r-0" : ""
              } focus:z-10 focus:ring-2 focus:ring-blue-500 focus:text-blue-700`}
            >
              {frame.charAt(0).toUpperCase() + frame.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
        {["line", "bar", "area"].map((type) => (
          <button
            key={type}
            onClick={() => setChartType(type as "line" | "bar" | "area")}
            className={`p-2 rounded-md transition-all duration-200 ${
              chartType === type
                ? "bg-white shadow-sm"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type === "line" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            )}
            {type === "bar" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            )}
            {type === "area" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12C22 12 19 18 12 18C5 18 2 12 2 12C2 12 5 6 12 6C19 6 22 12 22 12Z"></path>
              </svg>
            )}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold">Sales Overview</CardTitle>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-none  text-white bg-sky-500 rounded-full hover:bg-blue-600 transition-colors duration-200"
          >
            <AiOutlineFullscreen size={23} />
          </button>
        </CardHeader>
        <CardContent>
          {renderChartControls()}
          {renderChart()}
        </CardContent>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-11/12 h-5/6 rounded-lg p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                <AiOutlineFullscreen />
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
              >
                <X size={24} />
              </button>
            </div>
            {renderChartControls()}
            {renderChart("100%")}
          </div>
        </div>
      )}
    </>
  );
};

export default ChartOne;
