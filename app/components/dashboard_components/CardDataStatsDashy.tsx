import React, { ReactNode } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface CardDataStatsProps {
  id: string;
  title: string;
  total?: string;
  children: ReactNode;
  details: Record<string, { volume?: number; amount?: number; count?: number }>;
  isExpanded: boolean;
  onExpand: () => void;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  id,
  title,
  total,
  children,
  details,
  isExpanded,
  onExpand,
}) => {
  const chunks = Object.entries(details).reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 2);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, [] as [string, { volume?: number; amount?: number; count?: number }][][]);

  return (
    <div
      className={`relative rounded-lg border border-stroke bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark transition-all duration-300 ${
        isExpanded ? "z-10 scale-105 shadow-lg" : ""
      }`}
    >
      <div className="flex items-center mb-3">
        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          {children}
        </div>
        <div>
          <h4 className="text-lg font-semibold text-black dark:text-white">
            {title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{total}</p>
        </div>
      </div>
      <div className={`space-y-2 ${isExpanded ? "block" : "hidden"}`}>
        {chunks.map((chunk, index) => (
          <div key={index} className="flex flex-wrap -mx-2">
            {chunk.map(([product, data]) => (
              <div key={product} className="w-1/2 px-2 mb-2">
                <div className="text-sm">
                  <span className="font-medium text-black dark:text-white">
                    {product}
                  </span>
                  <div className="text-gray-600 dark:text-gray-300">
                    {data.volume !== undefined && (
                      <span>Volume: {data.volume.toFixed(2)}</span>
                    )}
                    {data.amount !== undefined && (
                      <span>Amount: ${data.amount.toFixed(2)}</span>
                    )}
                    {data.count !== undefined && (
                      <span>Customers: {data.count}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button
        onClick={onExpand}
        className="absolute bottom-2 right-2 p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      >
        {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
      </button>
    </div>
  );
};

export default CardDataStats;
