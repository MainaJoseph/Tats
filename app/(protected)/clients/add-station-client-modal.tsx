"use client";

import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import {
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScaleLoader } from "react-spinners";

interface Station {
  id: number;
  name: string;
  location: string;
  nozzleIdentifierName: "pumpAddress" | "nozzle";
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

interface AddStationModalProps {
  onClose: () => void;
  clientId: number;
  onAddStation: (newStation: Station) => void;
}

const StationSchema = z.object({
  name: z.string().min(1, "Station name is required"),
  location: z.string().min(1, "Location is required"),
  nozzleIdentifierName: z.enum(["pumpAddress", "nozzle"]),
});

type StationFormData = z.infer<typeof StationSchema>;

const errorMessageStyle = {
  color: "red",
};

const AddStationModal: React.FC<AddStationModalProps> = ({
  onClose,
  clientId,
  onAddStation,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<StationFormData>({
    resolver: zodResolver(StationSchema),
    defaultValues: {
      name: "",
      location: "",
      nozzleIdentifierName: "pumpAddress",
    },
  });

  const checkStationExists = async (name: string): Promise<boolean> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/${clientId}/stations`
      );
      const stations = response.data;
      return stations.some(
        (station: any) => station.name.toLowerCase() === name.toLowerCase()
      );
    } catch (error) {
      console.error("Error checking station existence:", error);
      return false;
    }
  };

  const onSubmit = async (data: StationFormData) => {
    setIsLoading(true);
    try {
      const stationExists = await checkStationExists(data.name);

      if (stationExists) {
        toast({
          title: "Station Already Exists",
          description: `A station with the name "${data.name}" already exists.`,
          variant: "destructive",
          className: "bg-rose-500 text-white rounded-md",
        });
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/clients/${clientId}/stations`,
          {
            ...data,
            id: 0,
            pumps: [],
          }
        );

        const newStation: Station = response.data;
        onAddStation(newStation);
        form.reset();
        toast({
          title: "Station Added Successfully",
          description: `${data.name} has been added to the Tats.`,
          className: "bg-green-500 text-white",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error adding station:", error);
      toast({
        title: "Error Adding Station",
        description:
          "There was a problem adding the station. Please try again.",
        variant: "destructive",
        className: "bg-slate-800 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DialogTitle>Add New Station</DialogTitle>
        <DialogDescription>
          Fill in the details to add a new station to the system.
        </DialogDescription>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Station Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter station name"
                  {...field}
                  style={{ borderRadius: "10px" }}
                />
              </FormControl>
              <FormMessage style={errorMessageStyle} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter station location"
                  {...field}
                  style={{ borderRadius: "10px" }}
                />
              </FormControl>
              <FormMessage style={errorMessageStyle} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nozzleIdentifierName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                Nozzle Identifier Name
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger style={{ borderRadius: "10px" }}>
                    <SelectValue
                      placeholder="Select nozzle identifier"
                      style={{ borderRadius: "10px" }}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent
                  className="bg-slate-800 text-white"
                  style={{ borderRadius: "10px" }}
                >
                  <SelectItem value="pumpAddress">Pump Address</SelectItem>
                  <SelectItem value="nozzle">Nozzle</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage style={errorMessageStyle} />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="hover:border-rose-400"
            style={{ borderRadius: "6px" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="border-[1px] bg-blue-500 hover:bg-blue-700 text-white"
            style={{ borderRadius: "6px" }}
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
              "Add Station"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddStationModal;
