"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import AddStationModal from "./add-station-modal";
import AddPumpModal from "./AddPumpModal";
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

interface ApiError {
  message: string;
}

type ErrorType = ApiError | Error;

const StationsClient = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddPumpModalOpen, setIsAddPumpModalOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: false },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState<Station | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchStations = useCallback(async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_STATION_ID;
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/stations`);
      const data: Station[] = await response.json();
      setStations(data);
    } catch (error) {
      console.error("Failed to fetch stations", error);
      toast({
        title: "Error",
        description: "Failed to fetch stations.",
        variant: "destructive",
        className: "bg-slate-800 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const handleViewPumps = (station: Station) => {
    if (!station.pumps || Object.keys(station.pumps).length === 0) {
      toast({
        title: "No Pumps Available",
        description: `Station ${station.name} has no pumps.`,
        variant: "destructive",
        className: "bg-slate-800 text-white",
      });
    } else {
      router.push(`/stations/${encodeURIComponent(station.name)}/pumps`);
    }
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
      const response = await fetch(
        `${apiBaseUrl}/stations/${stationToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
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
            className="bg-emerald-500 hover:bg-emerald-600 text-white transition-colors duration-300 flex items-center justify-center p-2  shadow-md"
            style={{ borderRadius: "40%" }}
          >
            <BsFillFuelPumpDieselFill className="w-5 h-5" />
          </Button>
          <Button
            onClick={() => handleAddPump(row.original)}
            className="flex flex-row gap-1 bg-blue-500 hover:bg-blue-600 text-white"
            style={{
              borderTopLeftRadius: "5px",
              borderBottomRightRadius: "5px",
            }}
          >
            <MdLibraryAdd size={20} />
            <BsFillFuelPumpDieselFill size={20} />
          </Button>
          <Button
            onClick={() => handleDeleteStation(row.original)}
            className="
      bg-none
      text-rose-500
      hover:bg-none
      hover:shadow-lg
      focus:ring-4
      focus:ring-red-300
      border
       border-red-300
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
            style={{ borderRadius: "40%", outline: "none" }}
          >
            <MdDelete className="w-6 h-6" />
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
        ["ID", "Name", "Location", "Number of Pumps", "Nozzle Identifier"],
      ],
      body: stations.map((s) => [
        s.id,
        s.name,
        s.location,
        s.pumps ? Object.keys(s.pumps).length : 0,
        s.nozzleIdentifierName,
      ]),
    });
    doc.save("stations.pdf");
  };

  const exportToWord = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph("Stations"),
            new DocxTable({
              rows: [
                new DocxTableRow({
                  children: [
                    new DocxTableCell({ children: [new Paragraph("ID")] }),
                    new DocxTableCell({ children: [new Paragraph("Name")] }),
                    new DocxTableCell({
                      children: [new Paragraph("Location")],
                    }),
                    new DocxTableCell({
                      children: [new Paragraph("Number of Pumps")],
                    }),
                    new DocxTableCell({
                      children: [new Paragraph("Nozzle Identifier")],
                    }),
                  ],
                }),
                ...stations.map(
                  (s) =>
                    new DocxTableRow({
                      children: [
                        new DocxTableCell({
                          children: [new Paragraph(s.id.toString())],
                        }),
                        new DocxTableCell({
                          children: [new Paragraph(s.name)],
                        }),
                        new DocxTableCell({
                          children: [new Paragraph(s.location)],
                        }),
                        new DocxTableCell({
                          children: [
                            new Paragraph(
                              s.pumps
                                ? Object.keys(s.pumps).length.toString()
                                : "0"
                            ),
                          ],
                        }),
                        new DocxTableCell({
                          children: [new Paragraph(s.nozzleIdentifierName)],
                        }),
                      ],
                    })
                ),
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
    <div
      className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
      style={{ borderRadius: "10px" }}
    >
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Station Details
      </h4>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            <AddStationModal onClose={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
        <Input
          placeholder="Search stations..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="w-full sm:max-w-sm focus:border-sky-500 sm:order-1"
          style={{ borderRadius: "10px" }}
        />
        <Select onValueChange={handleExport}>
          <SelectTrigger
            className="w-[180px] rounded-md"
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
                  <TableHead key={header.id} className="font-bold">
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          style={{ borderRadius: "5px" }}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          style={{ borderRadius: "5px" }}
        >
          Next
        </Button>
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

export default StationsClient;
