import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface ToggleButtonProps {
  initialState?: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  initialState = false,
}) => {
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [isOn, setIsOn] = useState(initialState);

  useEffect(() => {}, [currentUser]);

  const toggle = async () => {
    if (!currentUser) {
      toast.error("User not found");
      return;
    }

    const newState = !isOn;
    setIsOn(newState);

    try {
      const response = await fetch("/api/toggleTwoFactor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser.id, isEnabled: newState }),
      });

      if (!response.ok) {
        throw new Error("Failed to update two-factor authentication");
      }

      toast.success("Two-factor authentication updated successfully");
    } catch (error) {
      console.error("Error toggling two-factor authentication:", error);
      toast.error("Error updating two-factor authentication");
      setIsOn(!newState);
    } finally {
      router.refresh();
    }
  };

  return (
    <button
      onClick={toggle}
      className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
        isOn ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
          isOn ? "translate-x-8" : ""
        }`}
      />
    </button>
  );
};

export default ToggleButton;
