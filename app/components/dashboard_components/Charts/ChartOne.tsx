"use client";

import { ApexOptions } from "apexcharts";
import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

interface ReportItem {
  datetime: string;
  productname: string;
  volume: number;
  amount: number;
  count: number;
}

interface ChartOneState {
  name: string;
  data: number[];
}

const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split("T")[0]; // returns YYYY-MM-DD format
};

const getDailyCategories = () => {
  const date = new Date();
  const hours = Array.from(
    { length: date.getHours() + 1 },
    (_, i) => `${i}:00`
  );
  return hours;
};

const getWeeklyCategories = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days;
};

const getMonthlyCategories = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months;
};

const ChartOne: React.FC = () => {
  const [series, setSeries] = useState<ChartOneState[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [timeFrame, setTimeFrame] = useState<string>("day");

  const fetchData = async (timeFrame: string) => {
    const currentDate = getCurrentDate();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    let url = "";
    let newCategories: string[] = [];
    let fromDateTime = currentDate;

    switch (timeFrame) {
      case "day":
        url = `${apiBaseUrl}/reports/v2/2?clientId=2&reportType=hour&fromDateTime=${currentDate}`;
        newCategories = getDailyCategories();
        break;
      case "week":
        url = `${apiBaseUrl}/reports/v2/2?clientId=2&reportType=day`;
        newCategories = getWeeklyCategories();
        break;
      case "month":
        url = `${apiBaseUrl}/reports/v2/2?clientId=2&reportType=month&fromDateTime=${currentDate}`;
        newCategories = getMonthlyCategories();
        break;
      default:
        url = `${apiBaseUrl}/reports/v2/2?clientId=2&reportType=hour&fromDateTime=${currentDate}`;
    }

    try {
      let response = await axios.get(url);
      let data = response.data;
      const products: string[] = data.products;
      const report: ReportItem[] = data.report;

      if (timeFrame === "week" && report.length > 0) {
        fromDateTime = report.reduce((earliest, item) => {
          const itemDate = new Date(item.datetime);
          return itemDate < new Date(earliest) ? item.datetime : earliest;
        }, report[0].datetime);

        url = `${apiBaseUrl}/reports/v2/2?clientId=2&reportType=day&fromDateTime=${fromDateTime}&toDateTime=${currentDate}`;
        response = await axios.get(url);
        data = response.data;
      }

      const newSeries = products.map((product: string) => ({
        name: product,
        data: data.report
          .filter((item: ReportItem) => item.productname === product)
          .map((item: ReportItem) => item.amount),
      }));

      setSeries(newSeries);
      setCategories(newCategories);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(timeFrame);
  }, [timeFrame]);

  const handleTimeFrameChange = (newTimeFrame: string) => {
    setTimeFrame(newTimeFrame);
  };

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#80CAEE", "#3C50E0"], // Inverted colors
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#80CAEE", "#3C50E0"], // Inverted colors
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5"></div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
            <button
              className={`rounded px-3 py-1 text-xs font-medium ${
                timeFrame === "day"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              } hover:bg-blue-300 hover:text-white`}
              onClick={() => handleTimeFrameChange("day")}
            >
              Day
            </button>
            <button
              className={`rounded px-3 py-1 text-xs font-medium ${
                timeFrame === "week"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              } hover:bg-blue-300 hover:text-white`}
              onClick={() => handleTimeFrameChange("week")}
            >
              Week
            </button>
            <button
              className={`rounded px-3 py-1 text-xs font-medium ${
                timeFrame === "month"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              } hover:bg-blue-300 hover:text-white`}
              onClick={() => handleTimeFrameChange("month")}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
