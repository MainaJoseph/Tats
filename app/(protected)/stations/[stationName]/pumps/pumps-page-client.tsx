"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface PumpDetails {
  nozzleIdentifierName: string;
  pumps: {
    label: string;
    rdgIndex: string;
    nozzles: {
      id: string;
      label: string;
    }[];
  }[];
}

const PumpsPageClient = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [pumpDetails, setPumpDetails] = useState<PumpDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPumpDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://tats.phan-tec.com/stations/pumps/${params.stationName}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pump details");
        }
        const data: PumpDetails = await response.json();
        if (data.pumps.length === 0) {
          toast({
            title: "No Pumps Available",
            description: `Station ${params.stationName} has no pumps.`,
            variant: "destructive",
          });
          router.back();
        } else {
          setPumpDetails(data);
        }
      } catch (err) {
        setError("An error occurred while fetching pump details.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.stationName) {
      fetchPumpDetails();
    }
  }, [params.stationName, router, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button onClick={() => router.back()} className="mb-4">
        Back to Stations
      </Button>
      <h1 className="text-2xl font-bold mb-4">
        Pump Details for {params.stationName}
      </h1>
      {pumpDetails && (
        <div>
          <p className="mb-4">
            Nozzle Identifier: {pumpDetails.nozzleIdentifierName}
          </p>
          <div className="space-y-6">
            {pumpDetails.pumps.map((pump, index) => (
              <div key={index} className="border p-4 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">{pump.label}</h2>
                <p className="mb-2">RDG Index: {pump.rdgIndex}</p>
                <h3 className="text-lg font-medium mb-2">Nozzles:</h3>
                <ul className="list-disc list-inside">
                  {pump.nozzles.map((nozzle) => (
                    <li key={nozzle.id}>
                      {nozzle.label} (ID: {nozzle.id})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PumpsPageClient;
