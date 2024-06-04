"use client";

import { Header } from "./Header";
import { BackButton } from "./BackButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface ErrorCardProps {
  duration?: number;
  borderRadius?: string;
}

export const ErrorCard = ({
  duration = 5000, // Increased duration for slower movement
  borderRadius = "1rem",
}: ErrorCardProps) => {
  const pathRef = useRef<SVGRectElement>(null);
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    const length = pathRef.current?.getTotalLength();
    if (length) {
      const pxPerMillisecond = length / duration;
      progress.set((time * pxPerMillisecond) % length);
    }
  });

  const x = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).x
  );
  const y = useTransform(
    progress,
    (val) => pathRef.current?.getPointAtLength(val).y
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <Card
      className="w-[500px] shadow-lg border border-rose-300 relative overflow-hidden mt-36"
      style={{ borderRadius }}
    >
      <CardHeader>
        <Header label="Oops! Something went Wrong" />
      </CardHeader>
      <CardContent className="w-full justify-center flex items-center">
        <FaExclamationTriangle className="text-rose-500" />
      </CardContent>
      <CardFooter>
        <BackButton label="Back to Login" href="auth/login" />
      </CardFooter>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="absolute h-full w-full rounded-md"
        width="100%"
        height="100%"
      >
        <rect
          fill="none"
          stroke="transparent"
          width="100%"
          height="100%"
          rx={borderRadius}
          ry={borderRadius}
          ref={pathRef}
        />
      </svg>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          display: "inline-block",
          transform,
        }}
      >
        <div className="h-2 w-2 bg-rose-500 rounded-full" />
      </motion.div>
    </Card>
  );
};
