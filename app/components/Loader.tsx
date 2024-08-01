"use client";

import { CirclesWithBar } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <CirclesWithBar
          color="#001550"
          height={100}
          width={100}
          ariaLabel="loading"
          wrapperClass="mb-4"
        />
        <p className="text-md font-bold text-gray-600">TATS is loading...</p>
      </div>
    </div>
  );
};

export default Loader;
