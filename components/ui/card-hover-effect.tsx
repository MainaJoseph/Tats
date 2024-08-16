import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    title: string;
    description: string;
    link: string;
    details?: Record<string, { [key: string]: number }>;
    isExpanded?: boolean;
    onExpand?: () => void;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={item.title}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card
            details={item.details}
            isExpanded={item.isExpanded}
            onExpand={item.onExpand}
          >
            <CardTitle>{item.title}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
            {item.icon}
          </Card>
        </div>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
  details,
  isExpanded,
  onExpand,
}: {
  className?: string;
  children: React.ReactNode;
  details?: Record<string, { [key: string]: number }>;
  isExpanded?: boolean;
  onExpand?: () => void;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden text-slate-900 bg-white border border-slate-400  group-hover:border-slate-700 relative z-20",
        className
      )}
      onClick={onExpand}
    >
      <div className="relative z-50">
        <div className="p-4">{children}</div>
        {isExpanded && details && (
          <div className="mt-4">
            {Object.entries(details).map(([key, value]) => (
              <div key={key} className="flex justify-between text-slate-900">
                <span>{key}:</span>
                <span>{Object.values(value)[0]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4
      className={cn("text-slate-900 font-bold tracking-wide mt-4", className)}
    >
      {children}
    </h4>
  );
};

export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-slate-800 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};