import React from "react";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (selected: string[]) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    onChange(selectedOptions);
  };

  return (
    <select
      multiple
      value={value}
      onChange={handleChange}
      className="w-full p-2 border border-gray-300 rounded-md"
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
