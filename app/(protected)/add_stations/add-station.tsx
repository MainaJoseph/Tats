"use client";

import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StationSchema, StationData } from "../../../schemas/index";
import { useToast } from "@/components/ui/use-toast";
import { ScaleLoader } from "react-spinners";
import Heading from "@/app/components/Heading";

const AddStationForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StationData>({
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
        `${process.env.NEXT_PUBLIC_API_BASE_URL_STATION_ID}/stations`
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

  const onSubmit = async (data: StationData) => {
    setIsLoading(true);
    try {
      const stationExists = await checkStationExists(data.name);

      if (stationExists) {
        toast({
          title: "Station Already Exists",
          description: `A station with the name "${data.name}" already exists.`,
          variant: "destructive",
          className: "bg-slate-800 text-white rounded-md",
        });
      } else {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL_STATION_ID}/stations`,
          {
            ...data,
            id: 0,
            pumps: {},
            client: { id: 1 },
          }
        );
        reset();
        toast({
          title: "Station Added Successfully",
          description: `${data.name} has been added to the Tats.`,
          className: "bg-slate-800 text-white rounded-md",
        });
      }
    } catch (error) {
      console.error("Error adding station:", error);
      toast({
        title: "Error Adding Station",
        description:
          "There was a problem adding the station. Please try again.",
        variant: "destructive",
        className: "bg-slate-800 text-white rounded-md",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 mt-4">
        <Heading title="Add Station" center />
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderRadius: "10px" }}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="location"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Location:
          </label>
          <input
            type="text"
            id="location"
            {...register("location")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderRadius: "10px" }}
          />
          {errors.location && (
            <p className="text-red-500 text-xs mt-1">
              {errors.location.message}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label
            htmlFor="nozzleIdentifierName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Nozzle Identifier Name:
          </label>
          <select
            id="nozzleIdentifierName"
            {...register("nozzleIdentifierName")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderRadius: "10px" }}
          >
            <option value="pumpAddress">Pump Address</option>
            <option value="nozzle">Nozzle</option>
          </select>
          {errors.nozzleIdentifierName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.nozzleIdentifierName.message}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-300"
          style={{ borderRadius: "10px" }}
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
        </button>
      </form>
    </div>
  );
};

export default AddStationForm;
