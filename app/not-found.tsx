"use client";

import Image from "next/image";
import Container from "./components/Container";
import { useRouter } from "next/navigation";
import { Redressed } from "next/font/google";
import Link from "next/link";

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

export default function NotFound() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Container>
        <div className="bg-gradient-to-r from-slate-700 to-slate-950 text-white rounded-lg shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex flex-row items-center">
              <Image
                src="/tatswhite.png"
                alt="Logo"
                width={100}
                height={100}
                className="object-contain "
              />
              <Link
                href="/"
                className={`${redressed.className} font-bold text-5xl flex items-center text-white`}
              >
                Tats
              </Link>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 space-y-6">
                <h1 className="font-bold text-4xl md:text-6xl text-white tracking-tight">
                  404 Error
                </h1>
                <h2 className="font-semibold text-2xl md:text-3xl text-white">
                  Page Not Found
                </h2>
                <p className="text-white text-lg font-mono">
                  Your search has ventured beyond the known universe.
                </p>
                <button
                  onClick={handleGoHome}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-full hover:opacity-90 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg"
                >
                  Return to Home
                </button>
              </div>
              <div className="w-full md:w-1/2 mt-8 md:mt-0">
                <Image
                  className="mx-auto max-w-full h-auto object-cover rounded-lg shadow-md "
                  src="/astro.png"
                  alt="Lost in space"
                  width={500}
                  height={500}
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
