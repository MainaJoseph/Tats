import React, { ReactNode, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Button, MovingBorder } from "../../../components/ui/moving-border"; // Adjust the import path as needed
import { motion } from "framer-motion";

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
  const [isHovered, setIsHovered] = useState(false);

  const chunks = Object.entries(details).reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / 2);
    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = [];
    }
    resultArray[chunkIndex].push(item);
    return resultArray;
  }, [] as [string, { volume?: number; amount?: number; count?: number }][][]);

  return (
    <motion.div
      className={`relative rounded-lg bg-slate-50 border-[1px] p-4 shadow-sm dark:bg-boxdark transition-all duration-300 ease-in-out overflow-hidden
        ${isExpanded || isHovered ? "z-10 scale-105 shadow-lg" : ""}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isExpanded || isHovered ? "scale(1.05)" : "scale(1)",
        transition: "all 0.3s ease-in-out",
        borderRadius: "6px",
      }}
    >
      {(isExpanded || isHovered) && (
        <div className="absolute inset-0 z-0">
          <MovingBorder duration={2500} rx="1px" ry="1px">
            <div className="h-2 w-5 opacity-[0.8] bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)]" />
          </MovingBorder>
        </div>
      )}
      <div className="relative z-10">
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
        <div
          className={`space-y-2 overflow-hidden transition-all duration-300 ease-in-out`}
          style={{
            maxHeight: isExpanded || isHovered ? "1000px" : "0",
            opacity: isExpanded || isHovered ? 1 : 0,
          }}
        >
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
      </div>
      <button
        onClick={onExpand}
        className="absolute bottom-2 right-2 p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 z-20"
      >
        {isExpanded || isHovered ? (
          <FaChevronUp size={14} />
        ) : (
          <FaChevronDown size={14} />
        )}
      </button>
    </motion.div>
  );
};

export default CardDataStats;
