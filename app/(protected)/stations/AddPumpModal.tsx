import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface AddPumpModalProps {
  stationId: number;
  onClose: () => void;
  onAddPump: (pumpData: any) => void;
  onError: (error: ErrorType) => void;
}

interface ApiError {
  message: string;
}

type ErrorType = ApiError | Error;

interface Nozzle {
  id: string;
  label: string;
}

const AddPumpModal: React.FC<AddPumpModalProps> = ({
  stationId,
  onClose,
  onAddPump,
  onError,
}) => {
  const [label, setLabel] = useState("");
  const [rdgIndex, setRdgIndex] = useState("");
  const [nozzles, setNozzles] = useState<Nozzle[]>([
    { id: "1", label: "Side A" },
  ]);

  const handleAddNozzle = () => {
    const newId = (nozzles.length + 1).toString();
    const newLabel = `Side ${String.fromCharCode(65 + nozzles.length)}`;
    setNozzles([...nozzles, { id: newId, label: newLabel }]);
  };

  const handleNozzleLabelChange = (index: number, newLabel: string) => {
    const updatedNozzles = [...nozzles];
    updatedNozzles[index].label = newLabel;
    setNozzles(updatedNozzles);
  };

  const handleRemoveNozzle = (index: number) => {
    const updatedNozzles = nozzles.filter((_, i) => i !== index);
    setNozzles(updatedNozzles);
  };

  const handleSubmit = async () => {
    const pumpData = {
      label,
      rdgIndex: parseInt(rdgIndex, 10),
      nozzles: nozzles.map((nozzle) => ({
        id: nozzle.id,
        label: nozzle.label,
      })),
    };

    console.log("Sending data to server:", JSON.stringify(pumpData, null, 2));

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(
        `${apiBaseUrl}/station/managePumps/${stationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pumpData),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        console.log("Server response:", responseData);
        onAddPump(pumpData);
        onClose();
      } else {
        console.error("Server error response:", responseData);
        if (responseData.reasons) {
          console.error("Validation reasons:", responseData.reasons);
        }
        throw new Error(
          responseData.message || responseData.error || "Failed to add pump"
        );
      }
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }
      console.error(
        "Error submitting pump data:",
        JSON.stringify(pumpData, null, 2)
      );
      console.error("Full error object:", error);
      onError({ message: "Error adding pump: " + errorMessage });
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-lg"
      style={{ borderRadius: "10px" }}
    >
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold mb-4">Add Pump</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label
            htmlFor="pumpLabel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Pump Label
          </label>
          <Input
            id="pumpLabel"
            placeholder="Enter pump label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            style={{ borderRadius: "10px" }}
          />
        </div>
        <div>
          <label
            htmlFor="rdgIndex"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            RDG Index
          </label>
          <Input
            id="rdgIndex"
            placeholder="Enter RDG index"
            value={rdgIndex}
            onChange={(e) => setRdgIndex(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            style={{ borderRadius: "10px" }}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Nozzles</h3>
          <div
            className={`space-y-2 ${
              nozzles.length >= 4 ? "max-h-48 overflow-y-auto" : ""
            }`}
          >
            {nozzles.map((nozzle, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder={`Nozzle ${index + 1}`}
                  value={nozzle.label}
                  onChange={(e) =>
                    handleNozzleLabelChange(index, e.target.value)
                  }
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  style={{ borderRadius: "10px" }}
                />
                <Button
                  onClick={() => handleRemoveNozzle(index)}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                  style={{ borderRadius: "10px" }}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
          <Button
            onClick={handleAddNozzle}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            style={{ borderRadius: "10px" }}
          >
            Add Nozzle
          </Button>
        </div>
      </div>
      <DialogFooter className="mt-6 flex justify-end space-x-2">
        <Button
          onClick={onClose}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          style={{ borderRadius: "10px" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          style={{ borderRadius: "10px" }}
        >
          Add Pump
        </Button>
      </DialogFooter>
    </div>
  );
};

export default AddPumpModal;
