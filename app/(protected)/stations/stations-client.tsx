"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
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

interface Station {
  id: number;
  name: string;
  location: string;
  nozzleIdentifierName: string;
  pumps: {
    [key: string]: {
      nozzles: {
        id: string;
        label: string;
      }[];
      rdgIndex: string;
    };
  } | null;
  client: {
    id: number;
  };
}

const StationsClient = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchStations = async () => {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL_STATION_ID;
      try {
        const response = await fetch(`${apiBaseUrl}/stations`);
        const data: Station[] = await response.json();
        setStations(data);
      } catch (error) {
        console.error("Failed to fetch stations", error);
      }
    };

    fetchStations();
  }, []);

  const columns: ColumnDef<Station>[] = [
    {
      accessorKey: "id",
      header: "STATION ID",
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
  ];

  const table = useReactTable({
    data: stations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-bold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
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
    </div>
  );
};

export default StationsClient;