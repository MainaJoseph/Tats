"use client";

import { CirclesWithBar } from "react-loader-spinner";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <CirclesWithBar color="black" />
      </div>
    </div>
  );
};

export default Loader;
