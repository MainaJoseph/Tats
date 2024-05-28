"use client";
import React, { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Header } from "./Header";
import { Socials } from "./Socials";
import { BackButton } from "./BackButton";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
  duration?: number;
  borderRadius?: string;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonHref,
  backButtonLabel,
  showSocial,
  duration = 5000, // Increased duration for slower movement
  borderRadius = "1rem",
}: CardWrapperProps) => {
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
      className="w-full shadow-lg border border-sky-300 rounded-md relative overflow-hidden"
      style={{ borderRadius }}
    >
      <CardHeader className="rounded-t-md overflow-hidden">
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent className="w-full overflow-hidden">{children}</CardContent>
      {showSocial && (
        <CardFooter className="overflow-hidden">
          <Socials />
        </CardFooter>
      )}
      <CardFooter className="rounded-b-md overflow-hidden">
        <BackButton href={backButtonHref} label={backButtonLabel} />
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
        <div className="h-2 w-2 bg-sky-500 rounded-full" />
      </motion.div>
    </Card>
  );
};
