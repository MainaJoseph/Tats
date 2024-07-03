"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Spinner from "@/app/components/Spinner";
import Heading from "@/app/components/Heading";
import { DateRangePicker, RangeKeyDict } from "react-date-range";
import { IconButton, Modal, Box } from "@mui/material";
import { MdCalendarToday } from "react-icons/md";
import { useToast } from "@/components/ui/use-toast"; // Import the useToast hook
import "react-date-range/dist/styles.css"; // Main style file for date range picker
import "react-date-range/dist/theme/default.css"; // Theme CSS file for date range picker

interface Transaction {
  id: string;
  transactionId: string;
  createdAt: string;
  fdcNumber: string;
  fdcName: string;
  rdgIndex: string;
  rdgId: string;
  fp: string;
  pumpAddress: string;
  nozzle: string;
  fdcTransactionId: string;
  fdcDateTime: string;
  rdgTransactionId: string;
  rdgDateTime: string;
  productId: string;
  productName: string;
  price: number;
  volume: number;
  amount: number;
  roundType: string;
  totalVolume: number;
  fdcTank: string;
}

const ManageTransactions: React.FC = () => {
  const { toast } = useToast(); // Initialize the toast hook
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const fetchTransactions = useCallback(async () => {
    const { startDate, endDate } = dateRange;
    if (!startDate || !endDate) return;

    setIsLoading(true);
    try {
      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const response = await axios.get(
        "http://20.4.219.173:8800/reports/v2/2?reportType=month",
        {
          params: {
            fromDateTime: `${formattedStartDate}T00:00:00`,
            toDateTime: `${formattedEndDate}T23:59:59`,
          },
        }
      );

      if (response.data && response.data.report) {
        // Extract and map transactions data with unique id
        const mappedTransactions = response.data.report.map(
          (item: any, index: number) => ({
            id: `trans-${index}`,
            transactionId: item.transactionId,
            createdAt: item.datetime,
            fdcNumber: item.fdcNumber,
            fdcName: item.fdcName,
            rdgIndex: item.rdgIndex,
            rdgId: item.rdgId,
            fp: item.fp,
            pumpAddress: item.pumpAddress,
            nozzle: item.nozzle,
            fdcTransactionId: item.fdcTransactionId,
            fdcDateTime: item.fdcDateTime,
            rdgTransactionId: item.rdgTransactionId,
            rdgDateTime: item.rdgDateTime,
            productId: item.productId,
            productName: item.productname,
            price: item.price,
            volume: item.volume,
            amount: item.amount,
            roundType: item.roundType,
            totalVolume: item.totalVolume,
            fdcTank: item.fdcTank,
          })
        );
        setTransactions(mappedTransactions);
      } else {
        toast({
          title: "No Transactions",
          description: "No transactions found for the selected date range.",
          style: {
            backgroundColor: "#1e293b", // Slate-800
            color: "#ffffff", // White
          },
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          toast({
            title: "Server Error",
            description: "Internal server error. Please try again later.",
            style: {
              backgroundColor: "#1e293b", // Slate-800
              color: "#ffffff", // White
            },
          });
        } else {
          toast({
            title: "Fetch Error",
            description:
              "Failed to fetch transactions. Please try again later.",
            style: {
              backgroundColor: "#1e293b", // Slate-800
              color: "#ffffff", // White
            },
          });
        }
      } else {
        toast({
          title: "Unknown Error",
          description: "An unknown error occurred. Please try again later.",
          style: {
            backgroundColor: "#1e293b", // Slate-800
            color: "#ffffff", // White
          },
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const columns: GridColDef[] = [
    { field: "transactionId", headerName: "Transaction ID", width: 150 },
    { field: "pumpAddress", headerName: "Pump Address", width: 150 },
    { field: "fdcTransactionId", headerName: "FDC Transaction ID", width: 150 },
    { field: "fdcDateTime", headerName: "FDC DateTime", width: 150 },
    { field: "rdgTransactionId", headerName: "RDG Transaction ID", width: 150 },
    { field: "rdgDateTime", headerName: "RDG DateTime", width: 150 },
    { field: "productId", headerName: "Product ID", width: 150 },
    { field: "productName", headerName: "Product Name", width: 150 },
    { field: "price", headerName: "Price", width: 150 },
    { field: "amount", headerName: "Amount", width: 150 },
    { field: "createdAt", headerName: "Created At", width: 150 },
    { field: "volume", headerName: "Volume", width: 150 },
    { field: "count", headerName: "Count", width: 150 },
  ];

  return (
    <div className="max-w-[1250px] m-auto text-xl">
      {isLoading && <Spinner />}
      <div className="mb-4 mt-4">
        <Heading title="Manage Transactions" center />
      </div>
      <div className="mb-4 flex items-center">
        <IconButton onClick={() => setIsCalendarOpen(true)}>
          <MdCalendarToday size={24} />
        </IconButton>
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={transactions}
          columns={columns}
          getRowId={(row) => row.id}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 9 },
            },
          }}
          pageSizeOptions={[9, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>

      <Modal
        open={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        aria-labelledby="calendar-modal"
        aria-describedby="calendar-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <DateRangePicker
            ranges={[dateRange]}
            onChange={(ranges: RangeKeyDict) => {
              const { selection } = ranges;
              const { startDate, endDate } = selection;
              if (
                startDate &&
                endDate &&
                startDate <= endDate &&
                endDate <= new Date()
              ) {
                setDateRange({
                  startDate,
                  endDate,
                  key: "selection",
                });
                setIsCalendarOpen(false);
              } else {
                toast({
                  title: "Invalid Date Range",
                  description: "Invalid date range selected.",
                  style: {
                    backgroundColor: "#1e293b", // Slate-800
                    color: "#ffffff", // White
                  },
                });
              }
            }}
            months={1}
            direction="vertical"
          />
        </Box>
      </Modal>
    </div>
  );
};

export default ManageTransactions;
