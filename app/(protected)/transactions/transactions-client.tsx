"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Spinner from "@/app/components/Spinner";
import Heading from "@/app/components/Heading";
import { Calendar } from "@/components/ui/calendar";
import { IconButton, Modal, Box, Button } from "@mui/material";
import { MdCalendarToday } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  id: number;
  fdcName: string;
  fdcDateTime: string;
  productName: string;
  price: number;
  amount: number;
}

const TransactionClient: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const { toast } = useToast();

  const fetchTransactions = useCallback(async () => {
    if (!selectedDate) return;

    setIsLoading(true);
    const formattedDate = selectedDate.toISOString().split("T")[0];

    toast({
      title: "Fetching Transactions",
      description: `Please wait, fetching transactions for ${formattedDate}...`,
      className: "bg-slate-800 text-white",
    });

    try {
      console.log("Fetching transactions for date:", formattedDate);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/transactions?fromDate=${formattedDate}`
      );

      const mappedTransactions = response.data.map((item: any) => ({
        id: item.id,
        fdcName: item.fdcName,
        fdcDateTime: item.fdcDateTime,
        productName: item.productName,
        price: item.price,
        amount: item.amount,
      }));

      setTransactions(mappedTransactions);
      setCurrentPage(1);

      toast({
        title: "Transactions Fetched",
        description: `Successfully fetched transactions from ${formattedDate}`,
        className: "bg-slate-800 text-white",
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions.",
        variant: "destructive",
        className: "bg-slate-800 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="max-w-[1250px] m-auto text-xl">
      {isLoading ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">ID</TableHead>
                <TableHead className="font-bold">FDC Name</TableHead>
                <TableHead className="font-bold">FDC DateTime</TableHead>
                <TableHead className="font-bold">Product Name</TableHead>
                <TableHead className="font-bold">Price</TableHead>
                <TableHead className="font-bold">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: transactionsPerPage }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton
                      className="h-6 bg-slate-400 border border-slate-500 rounded-md"
                      style={{ borderRadius: "10px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      className="h-6 bg-slate-400 border border-slate-500 rounded-md"
                      style={{ borderRadius: "10px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      className="h-6 bg-slate-400 border border-slate-500 rounded-md"
                      style={{ borderRadius: "10px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      className="h-6 bg-slate-400 border border-slate-500 rounded-md"
                      style={{ borderRadius: "10px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      className="h-6 bg-slate-400 border border-slate-500 rounded-md"
                      style={{ borderRadius: "10px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Skeleton
                      className="h-6 bg-slate-400 border border-slate-500 rounded-md"
                      style={{ borderRadius: "10px" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <div className="mb-4 mt-4">
            <Heading title="Transactions" center />
          </div>
          <div className="mb-4 flex items-center">
            <IconButton onClick={() => setIsCalendarOpen(true)}>
              <MdCalendarToday size={24} />
            </IconButton>
            {selectedDate && (
              <span className="ml-2 text-sm text-gray-600">
                Showing data for: {selectedDate.toLocaleDateString()}
              </span>
            )}
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">ID</TableHead>
                  <TableHead className="font-bold">FDC Name</TableHead>
                  <TableHead className="font-bold">FDC DateTime</TableHead>
                  <TableHead className="font-bold">Product Name</TableHead>
                  <TableHead className="font-bold">Price</TableHead>
                  <TableHead className="font-bold">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.fdcName}</TableCell>
                    <TableCell>{transaction.fdcDateTime}</TableCell>
                    <TableCell>{transaction.productName}</TableCell>
                    <TableCell>{transaction.price}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between mt-4">
            <Button
              variant="contained"
              color="primary"
              disabled={currentPage === 1}
              onClick={handlePrevPage}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={indexOfLastTransaction >= transactions.length}
              onClick={handleNextPage}
            >
              Next
            </Button>
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
                initialFocus
                className="rounded-md border shadow"
                classNames={{
                  day_selected:
                    "bg-blue-600 text-white hover:bg-blue-600 hover:text-white rounded-full",
                }}
              />
            </Box>
          </Modal>
          <Toaster />
        </>
      )}
    </div>
  );
};

export default TransactionClient;
