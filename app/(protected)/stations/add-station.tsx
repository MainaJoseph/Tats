// components/AddStationForm.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";

interface StationData {
  name: string;
  location: string;
  nozzleIdentifierName: "pumpAddress" | "nozzle";
}

const AddStationForm: React.FC = () => {
  const [stationData, setStationData] = useState<StationData>({
    name: "",
    location: "",
    nozzleIdentifierName: "pumpAddress",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://20.4.219.173:8800/clients/2/stations",
        {
          ...stationData,
          id: 0,
          pumps: {},
          client: { id: 1 },
        }
      );
      console.log("Station added successfully:", response.data);
      // Reset form or show success message
    } catch (error) {
      console.error("Error adding station:", error);
      // Show error message
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={stationData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={stationData.location}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="nozzleIdentifierName">Nozzle Identifier Name:</label>
        <select
          id="nozzleIdentifierName"
          name="nozzleIdentifierName"
          value={stationData.nozzleIdentifierName}
          onChange={handleChange}
          required
        >
          <option value="pumpAddress">Pump Address</option>
          <option value="nozzle">Nozzle</option>
        </select>
      </div>
      <button type="submit">Add Station</button>
    </form>
  );
};

export default AddStationForm;
