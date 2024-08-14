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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedStation: Station = {
      ...station,
      name,
      location,
      nozzleIdentifierName,
    };
    onUpdate(updatedStation);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Edit Station</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="location" className="text-right">
            Location
          </Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="nozzleIdentifierName" className="text-right">
            Nozzle Identifier
          </Label>
          <Input
            id="nozzleIdentifierName"
            value={nozzleIdentifierName}
            onChange={(e) => setNozzleIdentifierName(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </form>
  );
};

export default EditStationModal;
