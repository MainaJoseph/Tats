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
  id: number;
  fdcName: string;
  fdcNumber: string;
  fdcDateTime: string;
  productName: string;
  price: number;
  volume: number;
  amount: number;
}

const TransactionClient: React.FC = () => {
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
        `http://20.4.219.173:8800/transactions?fromDate=${formattedDate}`
      );
      // console.log("API response:", response.data);

      // Extract and map transactions data
      const mappedTransactions = response.data.map((item: any) => ({
        id: item.id,
        fdcName: item.fdcName,
        fdcNumber: item.fdcNumber,
        fdcDateTime: item.fdcDateTime,
        productName: item.productName,
        price: item.price,
        volume: item.volume,
        amount: item.amount,
      }));

      setTransactions(mappedTransactions);
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
    { field: "id", headerName: "ID", width: 100 },
    { field: "fdcName", headerName: "FDC Name", width: 150 },
    { field: "fdcNumber", headerName: "FDC Number", width: 100 },
    { field: "fdcDateTime", headerName: "FDC DateTime", width: 250 },
    { field: "productName", headerName: "Product Name", width: 150 },
    { field: "price", headerName: "Price", width: 150 },
    { field: "volume", headerName: "Volume", width: 150 },
    { field: "amount", headerName: "Amount", width: 150 },
  ];

  return (
    <div className="max-w-[1250px] m-auto text-xl">
      {isLoading && <Spinner />}
      <div className="mb-4 mt-4">
        <Heading title="Transactions" center />
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

export default TransactionClient;
