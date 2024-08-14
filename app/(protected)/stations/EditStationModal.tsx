// EditStationModal.tsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { EditStationSchema, EditStationData } from "@/schemas";
import { z } from "zod";
import { FormErrorSecond } from "@/app/components/form-error-2";

// Define the Station interface
interface Station {
  id: number;
  name: string;
  location: string;
  nozzleIdentifierName: string;
  pumps: {
    label: string;
    rdgIndex: string;
    nozzles: {
      id: string;
      label: string;
    }[];
  }[];
  client: {
    id: number;
  };
}

interface EditStationModalProps {
  station: Station;
  onClose: () => void;
  onUpdate: (updatedStation: Station) => void;
}

const EditStationModal: React.FC<EditStationModalProps> = ({
  station,
  onClose,
  onUpdate,
}) => {
  const [name, setName] = useState(station.name);
  const [location, setLocation] = useState(station.location);
  const [nozzleIdentifierName, setNozzleIdentifierName] = useState(
    station.nozzleIdentifierName
  );
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      EditStationSchema.parse({ name, location, nozzleIdentifierName });
      const updatedStation: Station = {
        ...station,
        name,
        location,
        nozzleIdentifierName,
      };
      onUpdate(updatedStation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        setError(errorMessages.join(". "));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle className="text-slate-800 font-semibold">
          Edit Station
        </DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right font-semibold">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
            style={{ borderRadius: "6px" }}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right font-semibold">
            Location
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="col-span-3"
            style={{ borderRadius: "6px" }}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="nozzleIdentifierName"
            className="text-right font-semibold"
          >
            Nozzle Identifier
          </Label>
          <select
            id="nozzleIdentifierName"
            value={nozzleIdentifierName}
            onChange={(e) =>
              setNozzleIdentifierName(
                e.target.value as "pumpAddress" | "nozzle"
              )
            }
            className="col-span-3"
          >
            <option value="pumpAddress" className=" bg-slate-800 text-white">
              Pump Address
            </option>
            <option value="nozzle" className=" bg-slate-800 text-white">
              Nozzle
            </option>
          </select>
        </div>
      </div>
      <FormErrorSecond message={error} />
      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="border border-slate-500 hover:border-rose-600"
          style={{ borderRadius: "6px" }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-sky-500 text-white hover:bg-sky-500/70"
          style={{ borderRadius: "6px" }}
        >
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  );
};

export default EditStationModal;
