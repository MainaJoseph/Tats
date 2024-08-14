"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MdDelete, MdLibraryAdd } from "react-icons/md";
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
import { BsEvStation, BsFillFuelPumpDieselFill } from "react-icons/bs";
import { AiFillBank } from "react-icons/ai";
import AddClientModal from "./add-client-modal";
import ReactCountryFlag from "react-country-flag";
import { getCountryCode } from "@/lib/countryHelpers";

interface Client {
  id: number;
  name: string;
  allowedscope: string | null;
  country: string;
  dateCreated: string;
}

interface ApiError {
  message: string;
}

type ErrorType = ApiError | Error;

const ClientsClient = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: false },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchClients = useCallback(async () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/clients`);
      if (!response.ok) {
        throw new Error("Failed to fetch clients");
      }
      const data: Client[] = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Failed to fetch clients", error);
      toast({
        title: "Error",
        description: "Failed to fetch clients.",
        variant: "destructive",
        className: "bg-slate-800 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleViewClientStations = (client: Client) => {
    router.push(`/clients/${client.id}/stations`);
  };

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    setIsLoading(true);
    try {
      const response = await fetch(
        `${apiBaseUrl}/clients/${clientToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete client");
      }

      setClients(clients.filter((c) => c.id !== clientToDelete.id));
      toast({
        title: "Client Deleted",
        description: `${clientToDelete.name} has been successfully deleted.`,
        variant: "default",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Failed to delete client", error);
      toast({
        title: "Error",
        description: "Failed to delete client.",
        variant: "destructive",
        className: "bg-slate-800 text-white",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
      setIsLoading(false);
    }
  };

  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: "id",
      header: "CLIENT ID",
      cell: ({ row }) => parseInt(row.getValue("id")),
      sortingFn: "basic",
    },
    {
      accessorKey: "name",
      header: "NAME",
    },
    {
      accessorKey: "country",
      header: "COUNTRY",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <ReactCountryFlag
            countryCode={getCountryCode(row.getValue("country"))}
            svg
            style={{
              width: "1.5em",
              height: "1.5em",
            }}
            title={row.getValue("country")}
          />
          {row.getValue("country")}
        </div>
      ),
    },
    {
      accessorKey: "allowedscope",
      header: "ALLOWED SCOPE",
      cell: ({ row }) => row.getValue("allowedscope") || "N/A",
    },
    {
      accessorKey: "dateCreated",
      header: "DATE CREATED",
      cell: ({ row }) =>
        new Date(row.getValue("dateCreated")).toLocaleDateString(),
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleViewClientStations(row.original)}
            className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
            style={{
              borderRadius: "10px",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BsEvStation size={20} />
          </Button>

          <Button
            onClick={() => {}}
            className="flex flex-row gap-1 bg-blue-500 hover:bg-blue-600 text-white"
            style={{ borderRadius: "5px" }}
          >
            Add Station
            <MdLibraryAdd size={20} />
          </Button>
          <Button
            onClick={() => handleDeleteClient(row.original)}
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
    data: clients,
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
    const ws = XLSX.utils.json_to_sheet(clients);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clients");
    XLSX.writeFile(wb, "clients.xlsx");
  };

  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(clients);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "clients.csv");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [["ID", "Name", "Country", "Allowed Scope", "Date Created"]],
      body: clients.map((c) => [
        c.id,
        c.name,
        c.country,
        c.allowedscope || "N/A",
        new Date(c.dateCreated).toLocaleDateString(),
      ]),
    });
    doc.save("clients.pdf");
  };

  const exportToWord = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph("Clients"),
            new DocxTable({
              rows: [
                new DocxTableRow({
                  children: [
                    new DocxTableCell({ children: [new Paragraph("ID")] }),
                    new DocxTableCell({ children: [new Paragraph("Name")] }),
                    new DocxTableCell({ children: [new Paragraph("Country")] }),
                    new DocxTableCell({
                      children: [new Paragraph("Allowed Scope")],
                    }),
                    new DocxTableCell({
                      children: [new Paragraph("Date Created")],
                    }),
                  ],
                }),
                ...clients.map(
                  (c) =>
                    new DocxTableRow({
                      children: [
                        new DocxTableCell({
                          children: [new Paragraph(c.id.toString())],
                        }),
                        new DocxTableCell({
                          children: [new Paragraph(c.name)],
                        }),
                        new DocxTableCell({
                          children: [new Paragraph(c.country)],
                        }),
                        new DocxTableCell({
                          children: [new Paragraph(c.allowedscope || "N/A")],
                        }),
                        new DocxTableCell({
                          children: [
                            new Paragraph(
                              new Date(c.dateCreated).toLocaleDateString()
                            ),
                          ],
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
      saveAs(blob, "clients.docx");
    });
  };

  return (
    <div
      className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
      style={{ borderRadius: "10px" }}
    >
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Client Details
      </h4>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white sm:order-2"
              style={{ borderRadius: "5px" }}
            >
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-[425px] bg-white text-slate-900 rounded-md"
            style={{ borderRadius: "5px" }}
          >
            <AddClientModal onClose={() => {}} />
          </DialogContent>
        </Dialog>
        <Input
          placeholder="Search clients..."
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
              <span className="font-bold">{clientToDelete?.name}</span> and
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
              onClick={confirmDeleteClient}
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

export default ClientsClient;
