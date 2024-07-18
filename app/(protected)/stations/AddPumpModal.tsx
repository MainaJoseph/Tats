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

const AddPumpModal: React.FC<AddPumpModalProps> = ({
  stationId,
  onClose,
  onAddPump,
  onError,
}) => {
  const [label, setLabel] = useState("");
  const [rdgIndex, setRdgIndex] = useState("");
  const [nozzles, setNozzles] = useState([{ id: "", label: "" }]);

  const handleAddNozzle = () => {
    setNozzles([...nozzles, { id: "", label: "" }]);
  };

  const handleNozzleChange = (index: number, field: string, value: string) => {
    const updatedNozzles = [...nozzles];
    updatedNozzles[index] = { ...updatedNozzles[index], [field]: value };
    setNozzles(updatedNozzles);
  };

  const handleRemoveNozzle = (index: number) => {
    const updatedNozzles = nozzles.filter((_, i) => i !== index);
    setNozzles(updatedNozzles);
  };

  const handleSubmit = async () => {
    const pumpData = {
      label,
      rdgIndex,
      nozzles,
    };

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_STATION_ID;
      const response = await fetch(
        `${apiBaseUrl}/stations/${stationId}/pumps`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pumpData),
        }
      );

      if (response.ok) {
        onAddPump(pumpData);
        onClose();
      } else {
        const errorData = await response.json();
        onError({ message: errorData.message || "Failed to add pump" });
      }
    } catch (error) {
      onError({ message: "Error adding pump: " + (error as Error).message });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
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
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Nozzles</h3>
          {nozzles.map((nozzle, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
              <Input
                placeholder="Nozzle ID"
                value={nozzle.id}
                onChange={(e) =>
                  handleNozzleChange(index, "id", e.target.value)
                }
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <Input
                placeholder="Nozzle Label"
                value={nozzle.label}
                onChange={(e) =>
                  handleNozzleChange(index, "label", e.target.value)
                }
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                onClick={() => handleRemoveNozzle(index)}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                <X size={16} />
              </Button>
            </div>
          ))}
          <Button
            onClick={handleAddNozzle}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add Nozzle
          </Button>
        </div>
      </div>
      <DialogFooter className="mt-6 flex justify-end space-x-2">
        <Button
          onClick={onClose}
          className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Add Pump
        </Button>
      </DialogFooter>
    </div>
  );
};

export default AddPumpModal;
