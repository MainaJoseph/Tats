import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { RemapPumpSchema, RemapPumpData } from "@/schemas";
import { FormErrorSecond } from "@/app/components/form-error-2";

interface Nozzle {
  id: string;
  label: string;
}

interface Pump {
  label: string;
  rdgIndex: string;
  nozzles: Nozzle[];
}

interface RemapPumpModalProps {
  pump: Pump;
  stationId: number;
  isOpen: boolean;
  onClose: () => void;
  onRemap: (updatedPump: Pump) => void;
}

const RemapPumpModal: React.FC<RemapPumpModalProps> = ({
  pump,
  stationId,
  isOpen,
  onClose,
  onRemap,
}) => {
  const { toast } = useToast();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RemapPumpData>({
    resolver: zodResolver(RemapPumpSchema),
    defaultValues: {
      label: pump.label,
      rdgIndex: pump.rdgIndex,
      nozzles: pump.nozzles,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "nozzles",
  });

  const onSubmit = async (data: RemapPumpData) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      // First, check if the label or RDG index already exists
      let checkResponse;
      try {
        checkResponse = await fetch(
          `${apiBaseUrl}/stations/${stationId}/pumps`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("Error fetching existing pumps:", error);
        // If the check fails, we'll proceed with the remapping
        console.warn(
          "Unable to check for existing pumps. Proceeding with remap."
        );
      }

      if (checkResponse && checkResponse.ok) {
        const responseData = await checkResponse.json();
        const existingPumps = responseData.pumps || [];

        const labelExists = existingPumps.some(
          (p: any) => p.label === data.label && p.rdgIndex !== pump.rdgIndex
        );
        const rdgIndexExists = existingPumps.some(
          (p: any) => p.rdgIndex === data.rdgIndex && p.label !== pump.label
        );

        if (labelExists || rdgIndexExists) {
          if (labelExists) {
            setError("label", {
              type: "manual",
              message: "Pump label already exists",
            });
          }
          if (rdgIndexExists) {
            setError("rdgIndex", {
              type: "manual",
              message: "RDG index already exists",
            });
          }
          return;
        }
      }

      // Proceed with remapping
      const remapResponse = await fetch(
        `${apiBaseUrl}/station/managePumps/${stationId}/${pump.rdgIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!remapResponse.ok) {
        throw new Error(`Failed to remap pump: ${remapResponse.statusText}`);
      }

      onRemap(data);
      onClose();
      toast({
        title: "Pump Remapped",
        description: "The pump has been successfully remapped.",
        variant: "default",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Error remapping pump:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to remap pump. Please try again.",
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px] bg-white text-slate-900 rounded-md"
        style={{ borderRadius: "6px" }}
      >
        <DialogHeader>
          <DialogTitle className="font-bold">Remap Pump</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="label"
              className="block text-sm text-gray-700 mb-1 font-semibold"
            >
              Pump Label
            </label>
            <Input
              id="label"
              {...register("label")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              style={{ borderRadius: "10px" }}
            />
            {errors.label && (
              <p className="text-red-500 text-sm mt-1">
                {errors.label.message}
              </p>
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
              {...register("rdgIndex")}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              style={{ borderRadius: "10px" }}
            />
            {errors.rdgIndex && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rdgIndex.message}
              </p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Nozzles</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <Input
                    type="text"
                    {...register(`nozzles.${index}.id` as const)}
                    placeholder={`Nozzle ${index + 1} ID`}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    style={{ borderRadius: "10px" }}
                  />
                  <Input
                    type="text"
                    {...register(`nozzles.${index}.label` as const)}
                    placeholder={`Nozzle ${index + 1} Label`}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    style={{ borderRadius: "10px" }}
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    style={{ borderRadius: "10px" }}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
            {errors.nozzles && (
              <p className="text-red-500 text-sm mt-1">
                {errors.nozzles.message}
              </p>
            )}
            <Button
              type="button"
              onClick={() => append({ id: "", label: "" })}
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              style={{ borderRadius: "10px" }}
            >
              Add Nozzle
            </Button>
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 hover:bg-gray-400"
              style={{ borderRadius: "10px" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-500 text-white hover:bg-green-600"
              style={{ borderRadius: "10px" }}
            >
              Remap
            </Button>
          </DialogFooter>
        </form>
        <FormErrorSecond
          message={errors.label?.message || errors.rdgIndex?.message}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RemapPumpModal;
