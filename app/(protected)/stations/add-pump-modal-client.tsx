import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { ScaleLoader } from "react-spinners";
import { useToast } from "@/components/ui/use-toast";
import { AddPumpSchema } from "@/schemas";
import * as z from "zod";
import { FormErrorSecond } from "@/app/components/form-error-2";

interface AddPumpModalClientProps {
  stationId: number;
  stationName: string; // Added stationName prop
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

const AddPumpModalClient: React.FC<AddPumpModalClientProps> = ({
  stationId,
  stationName, // Added stationName to destructuring
  onClose,
  onAddPump,
  onError,
}) => {
  const { toast } = useToast();
  const [label, setLabel] = useState("");
  const [rdgIndex, setRdgIndex] = useState("");
  const [nozzles, setNozzles] = useState<Nozzle[]>([
    { id: "1", label: "Side A" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    label: "",
    rdgIndex: "",
    nozzles: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const validateForm = () => {
    try {
      AddPumpSchema.parse({
        label,
        rdgIndex: parseInt(rdgIndex, 10),
        nozzles,
      });
      setErrors({ label: "", rdgIndex: "", nozzles: "" });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = { label: "", rdgIndex: "", nozzles: "" };
        error.errors.forEach((err) => {
          if (err.path[0] in newErrors) {
            newErrors[err.path[0] as keyof typeof newErrors] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

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
    setIsSubmitted(true);
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setFormError(null);

    const pumpData = {
      label,
      rdgIndex: parseInt(rdgIndex, 10),
      nozzles: nozzles.map((nozzle) => ({
        id: nozzle.id,
        label: nozzle.label,
      })),
    };

    try {
      // Check if pump label or RDG index already exists
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const checkResponse = await fetch(
        `${apiBaseUrl}/stations/pumps/${encodeURIComponent(stationName)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!checkResponse.ok) {
        const errorText = await checkResponse.text();
        console.error("Check response not OK:", errorText);
        throw new Error(
          `Failed to check existing pumps: ${checkResponse.status} ${errorText}`
        );
      }

      const responseData = await checkResponse.json();
      const existingPumps = responseData.pumps || [];

      const labelExists = existingPumps.some(
        (pump: any) => pump.label === label
      );
      const rdgIndexExists = existingPumps.some(
        (pump: any) => pump.rdgIndex === rdgIndex
      );

      if (labelExists || rdgIndexExists) {
        let errorMessage = "";
        if (labelExists && rdgIndexExists) {
          errorMessage = "Pump label and RDG index already exist.";
        } else if (labelExists) {
          errorMessage = "Pump label already exists.";
        } else {
          errorMessage = "RDG index already exists.";
        }
        setFormError(errorMessage);
        setIsLoading(false);
        return;
      }

      // If pump doesn't exist, proceed with adding the new pump
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

      const addPumpResponseData = await response.json();

      if (response.ok) {
        // console.log("Server response:", addPumpResponseData);
        onAddPump(pumpData);
        onClose();

        toast({
          title: "Success",
          description: "Pump added successfully",
          variant: "default",
          className: "bg-green-400 text-white",
        });

        window.location.reload();
      } else {
        // console.error("Server error response:", addPumpResponseData);
        if (addPumpResponseData.reasons) {
          // console.error("Validation reasons:", addPumpResponseData.reasons);
        }
        throw new Error(
          addPumpResponseData.message ||
            addPumpResponseData.error ||
            "Failed to add pump"
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
    } finally {
      setIsLoading(false);
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
          {isSubmitted && errors.label && (
            <p className="text-red-500 text-sm mt-1">{errors.label}</p>
          )}
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
          {isSubmitted && errors.rdgIndex && (
            <p className="text-red-500 text-sm mt-1">{errors.rdgIndex}</p>
          )}
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
          {isSubmitted && errors.nozzles && (
            <p className="text-red-500 text-sm mt-1">{errors.nozzles}</p>
          )}
          <Button
            onClick={handleAddNozzle}
            className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            style={{ borderRadius: "10px" }}
          >
            Add Nozzle
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <DialogFooter className="mt-6 flex flex-col gap-3">
          <Button
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            style={{ borderRadius: "10px" }}
            disabled={isLoading}
          >
            {isLoading ? (
              <ScaleLoader
                height={15}
                width={2}
                radius={2}
                margin={2}
                color="white"
              />
            ) : (
              "Add Pump"
            )}
          </Button>
        </DialogFooter>
        <FormErrorSecond message={formError} />
      </div>
    </div>
  );
};

export default AddPumpModalClient;
