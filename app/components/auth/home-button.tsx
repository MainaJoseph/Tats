"use client";

import { useRouter } from "next/navigation";

const HomeButton = () => {
  const router = useRouter(); // Initialize the useRouter hook

  const handleGoHome = () => {
    router.push("/"); // Navigate to the homepage when the button is clicked
  };
  return (
    <div>
      <button
        className="md:absolute md:top-30 md:left-4 bg-black text-white py-2 md:py-3 px-4 md:px-20 rounded-tl-xl rounded-br-xl hover:opacity-80 transition  shadow-xl"
        onClick={handleGoHome}
      >
        Back Home
      </button>
    </div>
  );
};

export default HomeButton;
