"use client";

import { CiSearch } from "react-icons/ci";
import { useState } from "react";

const Search = () => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative flex items-center w-full md:w-auto">
      <div
        className={`flex items-center w-full border rounded-full px-4 py-2 ${
          isFocused ? "border-sky-500" : "border-gray-300"
        }`}
      >
        <CiSearch size={24} className="mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent outline-none"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
};

export default Search;
