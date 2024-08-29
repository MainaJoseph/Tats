"use client";

import React from "react";
import { ChevronRight, Cloud, Zap, Activity } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import Link from "next/link";

// Define types for the Feature component props
interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md">
    {icon}
    <h3 className="mt-4 text-xl font-semibold">{title}</h3>
    <p className="mt-2 text-center text-gray-600">{description}</p>
  </div>
);

interface ButtonProps {
  children: React.ReactNode;
  primary?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, primary = false }) => (
  <button
    className={`px-6 py-2 rounded-full font-semibold ${
      primary
        ? "bg-blue-600 text-white hover:bg-blue-700"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
    } transition duration-300`}
  >
    {children}
  </button>
);

const LaptopDisplay: React.FC = () => (
  <div className="relative mx-auto flex items-end justify-center max-w-5xl">
    {/* Laptop */}
    <div className="w-full md:w-3/4 lg:mr-8">
      {/* Screen */}
      <div className="bg-gray-800 rounded-t-2xl p-2 shadow-xl">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <img
            src="dashboard.png"
            alt="Tats Dashboard"
            className="w-full h-auto"
          />
        </div>
      </div>
      {/* Laptop body */}
      <div className="relative bg-gray-700 rounded-b-3xl p-2">
        <div className="absolute left-1/2 top-1 w-16 h-1 bg-gray-600 rounded-full transform -translate-x-1/2"></div>
        <div className="h-4"></div>
      </div>
      {/* Laptop base */}
      <div className="absolute inset-x-0 bottom-0 h-2 bg-gray-800 rounded-b-3xl transform translate-y-1/2"></div>
    </div>

    {/* iPhone */}
    <div className="hidden lg:block relative w-1/4 max-w-xs">
      <div className="aspect-[9/19.5] bg-black rounded-[3rem] overflow-hidden shadow-xl border-8 border-gray-800 relative">
        {/* iPhone frame */}
        <div className="absolute inset-0 bg-black rounded-[2.5rem] overflow-hidden">
          {/* iPhone screen */}
          <div className="absolute inset-2 bg-white rounded-[2rem] overflow-hidden">
            <img
              src="d-phone.png"
              alt="iPhone Display"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        {/* iPhone notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-7 bg-black rounded-b-3xl z-10"></div>
        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-1 bg-gray-400 rounded-full z-10"></div>
      </div>
    </div>
  </div>
);

const LandingPage: React.FC = () => {
  const user = useCurrentUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-20">
          <h2 className="text-3xl font-bold text-gray-900">
            Cloud-Based Atrium Automation Solution
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Streamline your petrol station operations with our cutting-edge
            automation system.
          </p>
          <div className="mt-8 space-x-4">
            {user ? (
              <Link href="/dashboard">
                <Button primary>
                  Dashboard <ChevronRight className="inline ml-2" size={20} />
                </Button>
              </Link>
            ) : (
              <Link href="/auth/sign-up">
                <Button primary>
                  Get Started <ChevronRight className="inline ml-2" size={20} />
                </Button>
              </Link>
            )}
            <Button>Learn More</Button>
          </div>
        </section>

        <section className="mb-20">
          <LaptopDisplay />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            icon={<Cloud className="w-12 h-12 text-blue-500" />}
            title="Cloud-Based Solution"
            description="Access your data and controls from anywhere, anytime."
          />
          <Feature
            icon={<Zap className="w-12 h-12 text-yellow-500" />}
            title="Simple Automation"
            description="Effortlessly manage your forecourt with no downtime."
          />
          <Feature
            icon={<Activity className="w-12 h-12 text-green-500" />}
            title="Remote Monitoring"
            description="Keep an eye on your operations in real-time, from any device."
          />
        </section>
      </main>

      <footer className="bg-gray-800 text-white mt-20 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; 2024 Tats - Tovuti Automation System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
