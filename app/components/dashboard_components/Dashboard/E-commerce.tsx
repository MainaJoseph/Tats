"use client";
import React, { useEffect, useState } from "react";
import ChartOne from "../Charts/ChartOne";
import ChartThree from "../Charts/ChartThree";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import { SkeletonCard } from "../../SkeletonCard";
import { BsFuelPumpDieselFill } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import { BiHide } from "react-icons/bi";
import TableTwo from "../Tables/TableTwo";

// Truncate function to round off to two decimal places
const truncateToTwoDecimals = (num: number): string => {
  return num.toFixed(2);
};

// Format number with commas as thousand separators
const formatNumberWithCommas = (num: number): string => {
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ECommerce: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
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

  useEffect(() => {
    // Simulate a fetch call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Volume Stats"
          total={`Total Volume: ${truncateToTwoDecimals(sumVolume)}`}
          rate=""
          levelDown
        >
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="">
              <BsFuelPumpDieselFill size={20} className="text-slate-800" />
            </div>

            <div className="flex flex-col gap-2 items-start justify-start">
              {Object.keys(productSumVolumes).map((product) => (
                <div key={product} className="flex flex-col items-start">
                  <span className="font-bold">{product}</span>
                  <span className="font-semibold">
                    {truncateToTwoDecimals(productSumVolumes[product])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardDataStats>
        <CardDataStats
          title="Amount Stats"
          total={`Total Amount: ${formatNumberWithCommas(sumAmount)}`}
          rate=""
          levelDown
        >
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="">
              <MdAttachMoney size={26} className="text-slate-800" />
            </div>

            <div
              className="flex flex-col gap-2"
              style={{ alignItems: "flex-start", justifyContent: "flex-start" }}
            >
              {Object.keys(productSumAmounts).map((product) => (
                <div key={product} className="flex flex-col items-start">
                  <span className="font-bold">{product}</span>
                  <span className="font-semibold">
                    {formatNumberWithCommas(productSumAmounts[product])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardDataStats>
        <CardDataStats title="Total views" total="$3.456K" rate="0.43%" levelUp>
          <BiHide size={25} className="text-slate-800" />
        </CardDataStats>

        <CardDataStats
          title="Customers Served"
          total={`Total Customer: ${sumCount}`}
          rate=""
          levelUp
        >
          <div className="flex flex-col gap-2 items-center justify-center">
            <div className="">
              <FaUserFriends size={23} className="text-slate-800" />

              <div
                className="flex flex-col gap-2"
                style={{
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                {Object.keys(productSumCount).map((product) => (
                  <div key={product} className="flex flex-col items-start">
                    <span className="font-bold">{product}</span>
                    <span className="font-semibold">
                      {productSumCount[product]}
                    </span>
                  </div>
                ))}
              </div>
            </div>{" "}
          </div>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne
          onSumCountChange={setSumCount}
          onSumVolumeChange={setSumVolume}
          onProductSumVolumesChange={setProductSumVolumes}
          onSumAmountChange={setSumAmount}
          onProductSumAmountsChange={setProductSumAmounts}
          onProductSumCountChange={setProductSumCount}
        />
        <ChartTwo />
        <ChartThree />

        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>

        <ChatCard />
        {/* <div className="col-span-12 xl:col-span-12">
          <TableTwo />
        </div> */}
      </div>
    </>
  );
};

export default ECommerce;
