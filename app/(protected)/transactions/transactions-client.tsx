"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";

import Spinner from "@/app/components/Spinner";
import Heading from "@/app/components/Heading";

interface Transaction {
  isPosted: boolean;
  transactionId: string;
  fdcName: string;
  rdgId: string;
  pumpAddress: string;
  nozzle: string;
  fromDate: string;
}

const TransactionsClient: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://20.4.219.173:8800/Transactions/fetchTransactions"
      );
      setTransactions(response.data);
    } catch (error) {
      toast.error("Failed to fetch transactions.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    </div>
  );
};

export default TransactionsClient;
