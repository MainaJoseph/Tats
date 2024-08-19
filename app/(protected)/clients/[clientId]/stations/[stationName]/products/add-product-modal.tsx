// components/AddProductModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlus } from "react-icons/fa";

interface AddProductModalProps {
  stationId: string;
  onProductAdded: () => void;
}

export function AddProductModal({
  stationId,
  onProductAdded,
}: AddProductModalProps) {
  const [productId, setProductId] = useState("");
  const [label, setLabel] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Submit button clicked");
    // console.log("Product ID:", productId);
    // console.log("Label:", label);

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    // console.log("API Base URL:", apiBaseUrl);

    try {
      const url = `${apiBaseUrl}/stations/${stationId}/products`;
      //   console.log("Request URL:", url);

      const body = JSON.stringify({
        productId: parseInt(productId),
        label: label,
      });
      console.log("Request body:", body);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to add product");
      }

      const responseData = await response.json();
      console.log("Response data:", responseData);

      onProductAdded();
      setIsOpen(false);
      setProductId("");
      setLabel("");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
          style={{ borderRadius: "6px" }}
          onClick={() => setIsOpen(true)}
        >
          <FaPlus className="mr-2" /> Add product
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px] bg-white text-slate-800"
        style={{ borderRadius: "6px" }}
      >
        <DialogHeader>
          <DialogTitle className="font-bold">Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="productId" className="text-right font-semibold">
                Product ID
              </Label>
              <Input
                id="productId"
                type="number"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="col-span-3"
                style={{ borderRadius: "6px" }}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="label" className="text-right font-semibold">
                Label
              </Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="col-span-3"
                style={{ borderRadius: "6px" }}
                required
              />
            </div>
          </div>
          <div className="flex flex-row justify-end">
            <Button
              type="submit"
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
              style={{ borderRadius: "6px" }}
            >
              <FaPlus className="mr-2" /> Add Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
