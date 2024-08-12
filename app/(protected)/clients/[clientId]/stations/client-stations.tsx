"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { MdLibraryAdd, MdDelete } from "react-icons/md";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { BsFillFuelPumpDieselFill } from "react-icons/bs";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  Table as DocxTable,
  TableCell as DocxTableCell,
  TableRow as DocxTableRow,
} from "docx";
import { ScaleLoader } from "react-spinners";
import axios from "axios";
import AddPumpModal from "@/app/(protected)/stations/AddPumpModal";
import AddStationModal from "@/app/(protected)/clients/add-station-client-modal";

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

interface ApiError {
  message: string;
}

type ErrorType = ApiError | Error;

const ClientStations = () => {
  const params = useParams();
  const clientId = params.clientId;
  const [stations, setStations] = useState<Station[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddPumpModalOpen, setIsAddPumpModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: false },
  ]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState<Station | null>(null);
  const [clientName, setClientName] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const fetchClientStations = useCallback(async () => {
    if (!clientId) return;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${apiBaseUrl}/clients/${clientId}/stations`
      );
      setStations(response.data);
    } catch (error) {
      console.error("Error fetching client stations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch client stations.",
        variant: "destructive",
        className: "bg-slate-800 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  }, [clientId, toast]);

  useEffect(() => {
    fetchClientStations();
  }, [fetchClientStations]);

  const handleViewPumps = (station: Station) => {
    if (!station.pumps || station.pumps.length === 0) {
      toast({
        title: "No Pumps Available",
        description: `Station ${station.name} has no pumps.`,
        variant: "destructive",
        className: "bg-slate-800 text-white",
      });
    } else {
      router.push(
        `/clients/${clientId}/stations/${encodeURIComponent(
          station.name
        )}/pumps`
      );
    }
  };

  //store add atation state
  const addStation = (newStation: Station) => {
    setStations((prevStations) => [...prevStations, newStation]);
  };

  const handleAddPump = (station: Station) => {
    setSelectedStation(station);
    setIsAddPumpModalOpen(true);
  };

  const handleDeleteStation = (station: Station) => {
    setStationToDelete(station);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteStation = async () => {
    if (!stationToDelete) return;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    setIsLoading(true);
    try {
      const response = await axios.delete(
        `${apiBaseUrl}/stations/${stationToDelete.id}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to delete station");
      }

      setStations(stations.filter((s) => s.id !== stationToDelete.id));
      toast({
        title: "Station Deleted",
        description: `${stationToDelete.name} has been successfully deleted.`,
        variant: "default",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Failed to delete station", error);
      toast({
        title: "Error",
        description: "Failed to delete station.",
        variant: "destructive",
        className: "bg-slate-800 text-white",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setStationToDelete(null);
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<Station>[] = [
    {
      accessorKey: "id",
      header: "STATION ID",
      cell: ({ row }) => parseInt(row.getValue("id")),
      sortingFn: "basic",
    },
    {
      accessorKey: "name",
      header: "NAME",
    },
    {
      accessorKey: "location",
      header: "LOCATION",
    },
    {
      accessorKey: "pumps",
      header: "NUMBER OF PUMPS",
      cell: ({ row }) => {
        const pumps = row.original.pumps;
        return pumps && Object.keys(pumps).length > 0
          ? Object.keys(pumps).length
          : "No pumps available";
      },
    },
    {
      accessorKey: "nozzleIdentifierName",
      header: "NOZZLE IDENTIFIER",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleViewPumps(row.original)}
            className="bg-green-500 hover:bg-green-600 text-white"
            style={{ borderRadius: "10px" }}
          >
            <BsFillFuelPumpDieselFill />
          </Button>
          <Button
            onClick={() => handleAddPump(row.original)}
            className="flex flex-row gap-1 bg-blue-500 hover:bg-blue-600 text-white"
            style={{ borderRadius: "10px" }}
          >
            Add Pump
            <MdLibraryAdd size={20} />
          </Button>
          <Button
            onClick={() => handleDeleteStation(row.original)}
            className="
              bg-rose-500
              text-white
              hover:bg-red-600
              hover:shadow-lg
              focus:ring-4
              focus:ring-red-300
              border
              border-transparent
              hover:border-red-600
              transition-all
              duration-300
              ease-in-out
              p-2
              rounded-lg
              flex
              items-center
              justify-center
              cursor-pointer
            "
            style={{ borderRadius: "10px", outline: "none" }}
          >
            <MdDelete size={18} />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: stations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
  });

  const handleExport = (format: string) => {
    switch (format) {
      case "excel":
        exportToExcel();
        break;
      case "csv":
        exportToCSV();
        break;
      case "pdf":
        exportToPDF();
        break;
      case "word":
        exportToWord();
        break;
      default:
        console.log("Unsupported format");
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(stations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stations");
    XLSX.writeFile(wb, "stations.xlsx");
  };

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(stations);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "stations.csv");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [
        ["ID", "NAME", "LOCATION", "NUMBER OF PUMPS", "NOZZLE IDENTIFIER"],
      ],
      body: stations.map((station) => [
        station.id.toString(),
        station.name,
        station.location,
        station.pumps && Object.keys(station.pumps).length > 0
          ? Object.keys(station.pumps).length.toString()
          : "No pumps available",
        station.nozzleIdentifierName,
      ]),
    });
    doc.save("stations.pdf");
  };

  const exportToWord = () => {
    const tableRows = stations.map(
      (station) =>
        new DocxTableRow({
          children: [
            new DocxTableCell({
              children: [new Paragraph(station.id.toString())],
            }),
            new DocxTableCell({
              children: [new Paragraph(station.name)],
            }),
            new DocxTableCell({
              children: [new Paragraph(station.location)],
            }),
            new DocxTableCell({
              children: [
                new Paragraph(
                  station.pumps && Object.keys(station.pumps).length > 0
                    ? Object.keys(station.pumps).length.toString()
                    : "No pumps available"
                ),
              ],
            }),
            new DocxTableCell({
              children: [new Paragraph(station.nozzleIdentifierName)],
            }),
          ],
        })
    );

    const doc = new Document({
      sections: [
        {
          children: [
            new DocxTable({
              rows: [
                new DocxTableRow({
                  children: [
                    new DocxTableCell({
                      children: [new Paragraph("ID")],
                    }),
                    new DocxTableCell({
                      children: [new Paragraph("NAME")],
                    }),
                    new DocxTableCell({
                      children: [new Paragraph("LOCATION")],
                    }),
                    new DocxTableCell({
                      children: [new Paragraph("NUMBER OF PUMPS")],
                    }),
                    new DocxTableCell({
                      children: [new Paragraph("NOZZLE IDENTIFIER")],
                    }),
                  ],
                }),
                ...tableRows,
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "stations.docx");
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Stations </h1>

      <div className="flex items-center mb-4 gap-4">
        <Input
          placeholder="Search stations..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs focus:border-sky-500"
          style={{ borderRadius: "6px" }}
        />

        <div className="flex-grow"></div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white sm:order-2"
              style={{ borderRadius: "5px" }}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Station
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[425px] bg-white text-slate-900 rounded-md"
            style={{ borderRadius: "5px" }}
          >
            <AddStationModal
              onClose={() => setIsAddModalOpen(false)}
              clientId={Number(clientId)}
              onAddStation={(newStation) => {
                setStations((prevStations) => [...prevStations, newStation]);
                setIsAddModalOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>

        <Select onValueChange={handleExport}>
          <SelectTrigger
            className="w-[180px] rounded-md "
            style={{ borderRadius: "6px" }}
          >
            <SelectValue placeholder="Export Data" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 text-white">
            <SelectItem value="excel" className="cursor-pointer">
              Export to Excel
            </SelectItem>
            <SelectItem value="csv" className="cursor-pointer">
              Export to CSV
            </SelectItem>
            <SelectItem value="pdf" className="cursor-pointer">
              Export to PDF
            </SelectItem>
            <SelectItem value="word" className="cursor-pointer">
              Export to Word
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton
                        className="h-6 bg-slate-400 border border-slate-500 rounded-md"
                        style={{ borderRadius: "10px" }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Stations Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of{" "}
          {table.getPreFilteredRowModel().rows.length} total rows
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            style={{ borderRadius: "10px" }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            style={{ borderRadius: "10px" }}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={isAddPumpModalOpen} onOpenChange={setIsAddPumpModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white text-slate-900 rounded-md">
          {selectedStation && (
            <AddPumpModal
              stationId={selectedStation.id}
              onClose={() => setIsAddPumpModalOpen(false)}
              onAddPump={(pumpData) => {
                setStations((prevStations) =>
                  prevStations.map((station) =>
                    station.id === selectedStation.id
                      ? {
                          ...station,
                          pumps: [
                            ...(station.pumps || []),
                            {
                              label: pumpData.label,
                              rdgIndex: pumpData.rdgIndex,
                              nozzles: pumpData.nozzles,
                            },
                          ],
                        }
                      : station
                  )
                );
                setIsAddPumpModalOpen(false);
                toast({
                  title: "Pump Added",
                  description:
                    "The pump has been successfully added to the station.",
                  variant: "default",
                  className: "bg-green-500 text-white",
                });
              }}
              onError={(error: ErrorType) => {
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent
          className="bg-white text"
          style={{ borderRadius: "10px" }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-bold">{stationToDelete?.name}</span> and
              remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-slate-800"
              style={{ borderRadius: "6px" }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteStation}
              className="bg-rose-500 hover:bg-rose-600 text-white"
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
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster />
    </div>
  );
};

export default ClientStations;
