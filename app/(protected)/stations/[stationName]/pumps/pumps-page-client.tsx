"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { BsFillFuelPumpDieselFill, BsDropletFill } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import AddPumpModalClient from "../../add-pump-modal-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScaleLoader } from "react-spinners";
import { AiOutlineClose } from "react-icons/ai";

interface Nozzle {
  id: string;
  label: string;
}

interface Pump {
  label: string;
  rdgIndex: string;
  nozzles: Nozzle[];
}

interface PumpDetails {
  stationId: number;
  nozzleIdentifierName: string;
  pumps: Pump[];
}
interface PumpModalProps {
  pump: Pump;
  stationId: number;
  onClose: () => void;
  onDeletePump: (rdgIndex: string) => void;
}

interface ApiError {
  message: string;
}

interface NewPumpData {
  label: string;
  rdgIndex: string;
  nozzles: Nozzle[];
}

const PumpsPageClient = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [pumpDetails, setPumpDetails] = useState<PumpDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPump, setSelectedPump] = useState<number | null>(null);
  const [isAddPumpModalOpen, setIsAddPumpModalOpen] = useState(false);

  const stationName = Array.isArray(params.stationName)
    ? params.stationName.join(" ")
    : params.stationName;

  const decodedStationName = decodeURIComponent(stationName);

  useEffect(() => {
    const fetchPumpDetails = async () => {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      setIsLoading(true);
      try {
        const response = await fetch(
          `${apiBaseUrl}/stations/pumps/${stationName}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch pump details");
        }
        const data: PumpDetails = await response.json();
        if (data.pumps.length === 0) {
          toast({
            title: "No Pumps Available",
            description: `Station ${decodedStationName} has no pumps.`,
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

    if (stationName) {
      fetchPumpDetails();
    }
  }, [stationName, router, toast, decodedStationName]);

  const handleAddPump = () => {
    setIsAddPumpModalOpen(true);
  };

  const handleDeletePump = (rdgIndex: string) => {
    setPumpDetails((prevDetails) => {
      if (!prevDetails) return null;
      return {
        ...prevDetails,
        pumps: prevDetails.pumps.filter((pump) => pump.rdgIndex !== rdgIndex),
      };
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-200 to-purple-200 py-12"
      style={{ borderRadius: "6px" }}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <Button
              onClick={() => router.back()}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 transform hover:scale-105"
              style={{ borderRadius: "6px" }}
            >
              Back to Stations
            </Button>
            <Button
              onClick={handleAddPump}
              className="bg-green-500 hover:bg-green-600 text-white transition-all duration-300 transform hover:scale-105"
              style={{ borderRadius: "6px" }}
            >
              Add Pump
            </Button>
          </div>
          <h1 className="text-5xl font-bold mb-8 text-slate-700 text-center">
            Pump Details for {decodedStationName}
          </h1>
        </motion.div>
        {pumpDetails && (
          <div>
            <p className="mb-8 text-xl text-slate-700 font-semibold text-center">
              Nozzle Identifier: {pumpDetails.nozzleIdentifierName}
            </p>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {pumpDetails.pumps.map((pump, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Card className="border-0 shadow-lg rounded-xl overflow-hidden bg-white/80 hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center mb-6">
                        <h2 className="text-4xl font-bold text-slate-600 mb-4">
                          {pump.label}
                        </h2>
                        <BsFillFuelPumpDieselFill
                          size={80}
                          className="text-blue-500"
                        />
                      </div>
                      <p className="mb-6 text-slate-700 font-semibold text-center">
                        RDG Index: {pump.rdgIndex}
                      </p>
                      <div className="border-t border-blue-200 pt-4">
                        <h3 className="font-bold mb-4 text-blue-700 text-xl">
                          Nozzles:
                        </h3>
                        {pump.nozzles.map((nozzle) => (
                          <div
                            key={nozzle.id}
                            className="flex justify-between items-center mb-2 bg-blue-50 p-2 rounded hover:bg-blue-100 transition-colors duration-200"
                          >
                            <span className="font-semibold text-slate-600 flex items-center">
                              <BsDropletFill className="mr-2 text-blue-500" />
                              {nozzle.label || `Nozzle ${nozzle.id}`}
                            </span>
                            <span className="font-mono text-slate-800">
                              ID: {nozzle.id}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-4 space-x-2">
                        <Button
                          onClick={() => setSelectedPump(index)}
                          className="bg-sky-400 hover:bg-sky-600 text-white flex-1"
                          style={{ borderRadius: "6px" }}
                        >
                          Details
                        </Button>
                        <Button
                          onClick={() => {}}
                          className="bg-blue-600 hover:bg-blue-800 text-white flex-1"
                          style={{ borderRadius: "6px" }}
                        >
                          Transactions
                        </Button>
                        <Button
                          onClick={() => {}}
                          className="bg-yellow-400 hover:bg-yellow-600 text-white flex-1"
                          style={{ borderRadius: "6px" }}
                        >
                          Remap
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
      <AnimatePresence>
        {selectedPump !== null && pumpDetails && (
          <PumpModal
            pump={pumpDetails.pumps[selectedPump]}
            stationId={pumpDetails.stationId}
            onClose={() => setSelectedPump(null)}
            onDeletePump={handleDeletePump}
          />
        )}
      </AnimatePresence>
      <Dialog open={isAddPumpModalOpen} onOpenChange={setIsAddPumpModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-slate-900 rounded-md">
          {pumpDetails && (
            <AddPumpModalClient
              stationId={pumpDetails.stationId}
              stationName={decodedStationName}
              onClose={() => setIsAddPumpModalOpen(false)}
              onAddPump={(pumpData: NewPumpData) => {
                setPumpDetails((prevDetails) => ({
                  ...prevDetails!,
                  pumps: [...prevDetails!.pumps, pumpData],
                }));
                setIsAddPumpModalOpen(false);
                toast({
                  title: "Pump Added",
                  description:
                    "The pump has been successfully added to the station.",
                  variant: "default",
                  className: "bg-green-500 text-white",
                });
              }}
              onError={(error: ApiError) => {
                toast({
                  title: "Error",
                  description: `Failed to add pump: ${error.message}`,
                  variant: "destructive",
                  className: "bg-red-500 text-white",
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PumpModal: React.FC<PumpModalProps> = ({
  pump,
  stationId,
  onClose,
  onDeletePump,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { toast } = useToast();

  const params = useParams();

  const stationName = Array.isArray(params.stationName)
    ? params.stationName.join(" ")
    : params.stationName;

  const decodedStationName = decodeURIComponent(stationName);

  const handleDeletePump = async () => {
    setIsDeleting(true);
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const response = await fetch(
        `${apiBaseUrl}/station/managePumps/${stationId}/${pump.rdgIndex}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete pump");
      }

      // Call the onDeletePump function passed as a prop
      onDeletePump(pump.rdgIndex);
      onClose();
      toast({
        title: "Pump Deleted",
        description: "The pump has been successfully deleted.",
        variant: "default",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Error deleting pump:", error);
      toast({
        title: "Error",
        description: "Failed to delete pump. Please try again.",
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          className="bg-white rounded-lg p-8 max-w-lg w-full relative"
          style={{ borderRadius: "9px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            onClick={onClose}
            className="absolute top-2 right-2 bg-transparent hover:bg-rose-100 text-rose-500 hover:text-rose-700 p-2 rounded-full transition-all duration-200"
          >
            <AiOutlineClose size={24} />
          </Button>
          <h2 className="text-2xl font-bold mb-4 text-center">Pump Details</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Label:
            </label>
            <p className="p-2 bg-gray-100 rounded-md">{pump.label}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              RDG Index:
            </label>
            <p className="p-2 bg-gray-100 rounded-md">{pump.rdgIndex}</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nozzles:
            </label>
            <ul className="p-2 bg-gray-100 rounded-md">
              {pump.nozzles.map((nozzle) => (
                <li
                  key={nozzle.id}
                  className="flex justify-between items-center mb-2"
                >
                  <span>{nozzle.label || `Nozzle ${nozzle.id}`}</span>
                  <span>ID: {nozzle.id}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6 flex justify-end space-x-2">
            <Button
              onClick={() => setShowDeleteAlert(true)}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeleting}
              style={{ borderRadius: "6px" }}
            >
              {isDeleting ? (
                <ScaleLoader
                  height={15}
                  width={2}
                  radius={2}
                  margin={2}
                  color="white"
                />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
      {showDeleteAlert && (
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogContent
            className="bg-white text-slate-800 rounded-md"
            style={{ borderRadius: "10px" }}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="font-bold">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete{" "}
                <span className="font-bold">{pump.label} </span> for{" "}
                <span className="font-bold">{decodedStationName}</span> and
                remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => setShowDeleteAlert(false)}
                style={{ borderRadius: "6px" }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeletePump}
                disabled={isDeleting}
                className="bg-red-500 hover:bg-rose-500/75"
                style={{ borderRadius: "6px" }}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
  </div>
);

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="flex justify-center items-center h-screen">
    <div
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md"
      role="alert"
    >
      <p className="font-bold">Error</p>
      <p>{message}</p>
    </div>
  </div>
);

export default PumpsPageClient;
