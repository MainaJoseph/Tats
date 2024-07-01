"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import Spinner from "@/app/components/Spinner";
import Heading from "@/app/components/Heading";
import { Calendar } from "@/components/ui/calendar";
import { IconButton, Modal, Box } from "@mui/material";
import { MdCalendarToday } from "react-icons/md";

interface Transaction {
  isPosted: boolean;
  transactionId: string;
  fdcName: string;
  rdgId: string;
  pumpAddress: string;
  nozzle: string;
  fromDate: string;
}

const ManageTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      console.log("Fetching transactions for date:", formattedDate);

      const response = await axios.get(
        "http://20.4.219.173:8800/Transactions/fetchTransactions",
        {
          params: {
            fromDate: formattedDate,
          },
        }
      );
      console.log("API response:", response.data);

      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const columns: GridColDef[] = [
    { field: "isPosted", headerName: "Is Posted", width: 150 },
    { field: "transactionId", headerName: "Transaction ID", width: 150 },
    { field: "fdcName", headerName: "FDC Name", width: 150 },
    { field: "rdgId", headerName: "RDG ID", width: 150 },
    { field: "pumpAddress", headerName: "Pump Address", width: 150 },
    { field: "nozzle", headerName: "Nozzle", width: 150 },
    { field: "fromDate", headerName: "From Date", width: 150 },
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
          getRowId={(row) => row.transactionId}
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
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setIsCalendarOpen(false);
            }}
            className="rounded-md border shadow"
          />
        </Box>
      </Modal>
    </div>
  );
};

export default ManageTransactions;
