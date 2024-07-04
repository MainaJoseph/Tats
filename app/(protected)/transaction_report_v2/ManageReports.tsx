"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Spinner from "@/app/components/Spinner";
import Heading from "@/app/components/Heading";
import { IconButton, Modal, Box, Button, TextField } from "@mui/material";
import { MdCalendarToday } from "react-icons/md";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDateRangePicker, DateRange } from "@mui/x-date-pickers-pro";
import dayjs, { Dayjs } from "dayjs";
import { useToast } from "@/components/ui/use-toast";

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

const ManageReports: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange<Dayjs>>([
    null,
    null,
  ]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    if (!selectedDateRange[0] || !selectedDateRange[1]) return;

    setIsLoading(true);
    toast({
      title: "Fetching transactions",
      description: "Please wait while we fetch the transactions data.",
      className: "bg-slate-800 text-white",
    });
    try {
      const formattedStartDate = selectedDateRange[0]?.format("YYYY-MM-DD");
      const formattedEndDate = selectedDateRange[1]?.format("YYYY-MM-DD");
      //   console.log(
      //     "Fetching transactions for date range:",
      //     formattedStartDate,
      //     formattedEndDate
      //   );

      const response = await axios.get(
        "http://20.4.219.173:8800/transactions",
        {
          params: {
            fromDateTime: `${formattedStartDate}T00:00:00`,
            toDateTime: `${formattedEndDate}T23:59:59`,
          },
        }
      );
      //   console.log("API response:", response.data);

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
      toast({
        title: "Data fetched successfully",
        description: "The transactions data has been successfully fetched.",
        className: "bg-slate-800 text-white",
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Failed to fetch transactions",
        description: "An error occurred while fetching the transactions data.",
        className: "bg-slate-800 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedDateRange, toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDateRangeChange = (newValue: DateRange<Dayjs>) => {
    setSelectedDateRange(newValue);
    setIsCalendarOpen(false);
  };

  const handlePresetClick = (
    preset:
      | "today"
      | "yesterday"
      | "thisWeek"
      | "lastWeek"
      | "thisMonth"
      | "lastMonth"
  ) => {
    const now = dayjs();
    let start: Dayjs;
    let end: Dayjs;

    switch (preset) {
      case "today":
        start = now.startOf("day");
        end = now.endOf("day");
        break;
      case "yesterday":
        start = now.subtract(1, "day").startOf("day");
        end = now.subtract(1, "day").endOf("day");
        break;
      case "thisWeek":
        start = now.startOf("week");
        end = now.endOf("week");
        break;
      case "lastWeek":
        start = now.subtract(1, "week").startOf("week");
        end = now.subtract(1, "week").endOf("week");
        break;
      case "thisMonth":
        start = now.startOf("month");
        end = now.endOf("month");
        break;
      case "lastMonth":
        start = now.subtract(1, "month").startOf("month");
        end = now.subtract(1, "month").endOf("month");
        break;
    }

    setSelectedDateRange([start, end]);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100 },
    { field: "fdcName", headerName: "FDC Name", width: 150 },
    { field: "fdcNumber", headerName: "FDC Number", width: 150 },
    { field: "fdcDateTime", headerName: "FDC DateTime", width: 150 },
    { field: "productName", headerName: "Product Name", width: 150 },
    { field: "price", headerName: "Price", width: 150 },
    { field: "volume", headerName: "Volume", width: 150 },
    { field: "amount", headerName: "Amount", width: 150 },
  ];

  return (
    <div className="max-w-[1250px] m-auto text-xl">
      {isLoading && <Spinner />}
      <div className="mb-4 mt-4">
        <Heading title="Transactions Report V2" center />
      </div>
      <div className="mb-4 flex items-center">
        <IconButton onClick={() => setIsCalendarOpen(true)}>
          <MdCalendarToday size={24} />
        </IconButton>
      </div>
      <div className="mb-4 flex space-x-2">
        <Button variant="contained" onClick={() => handlePresetClick("today")}>
          Today
        </Button>
        <Button
          variant="contained"
          onClick={() => handlePresetClick("yesterday")}
        >
          Yesterday
        </Button>
        <Button
          variant="contained"
          onClick={() => handlePresetClick("thisWeek")}
        >
          This Week
        </Button>
        <Button
          variant="contained"
          onClick={() => handlePresetClick("lastWeek")}
        >
          Last Week
        </Button>
        <Button
          variant="contained"
          onClick={() => handlePresetClick("thisMonth")}
        >
          This Month
        </Button>
        <Button
          variant="contained"
          onClick={() => handlePresetClick("lastMonth")}
        >
          Last Month
        </Button>
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
          pageSizeOptions={[9, 20, 50, 100, 200]}
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DesktopDateRangePicker
              value={selectedDateRange}
              onChange={handleDateRangeChange}
              slots={{
                textField: (params) => <TextField {...params} />,
              }}
            />
          </LocalizationProvider>
        </Box>
      </Modal>
    </div>
  );
};

export default ManageReports;
