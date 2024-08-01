"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface SidebarColorContextType {
  sidebarColor: string;
  setSidebarColor: (color: string) => void;
}

const SidebarColorContext = createContext<SidebarColorContextType | undefined>(
  undefined
);

export const SidebarColorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarColor, setSidebarColor] = useState("#1e293b"); // Default color

  useEffect(() => {
    // Load color from localStorage on initial render
    const savedColor = localStorage.getItem("sidebarColor");
    if (savedColor) {
      setSidebarColor(savedColor);
    }
  }, []);

  const updateSidebarColor = (color: string) => {
    setSidebarColor(color);
    localStorage.setItem("sidebarColor", color);
  };

  return (
    <SidebarColorContext.Provider
      value={{ sidebarColor, setSidebarColor: updateSidebarColor }}
    >
      {children}
    </SidebarColorContext.Provider>
  );
};

export const useSidebarColor = () => {
  const context = useContext(SidebarColorContext);
  if (context === undefined) {
    throw new Error(
      "useSidebarColor must be used within a SidebarColorProvider"
    );
  }
  return context;
};
