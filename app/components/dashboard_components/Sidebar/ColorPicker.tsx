// components/dashboard_components/Sidebar/ColorPicker.tsx

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange }) => {
  const [hexValue, setHexValue] = useState(value);

  useEffect(() => {
    setHexValue(value);
  }, [value]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setHexValue(newValue);
    if (newValue.match(/^#[0-9A-Fa-f]{6}$/)) {
      onChange(newValue);
    }
  };

  const defaultColors = ["#1E293B", "#b07406", "#055b0a", "#636ddb"];

  return (
    <Card className="w-full max-w-sm" style={{ borderRadius: "10px" }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Color Picker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            {defaultColors.map((color) => (
              <button
                key={color}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ease-in-out transform hover:scale-110 ${
                  color === value
                    ? "border-gray-400 ring-2 ring-offset-2 ring-gray-400"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onChange(color)}
              />
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="color-input">Custom Color</Label>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <Input
                  id="color-input"
                  type="text"
                  value={hexValue}
                  onChange={handleHexChange}
                  placeholder="#000000"
                  className="pl-9"
                />
                <div
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full border border-gray-300"
                  style={{ backgroundColor: value }}
                />
              </div>
              <Input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-10 h-10 p-1 rounded-md cursor-pointer"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorPicker;
