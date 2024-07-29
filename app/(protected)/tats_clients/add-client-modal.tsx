"use client";

import React, { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import {
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScaleLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { ClientSchema, ClientData } from "@/schemas";
import { FormErrorSecond } from "@/app/components/form-error-2";

interface Client {
  id: number;
  name: string;
  allowedscope: string | null;
  country: string;
  dateCreated: string;
}

const AddClientModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<ClientData>({
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      name: "",
      country: "",
      allowedscope: "",
    },
  });

  const onSubmit = async (data: ClientData) => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    setIsLoading(true);
    setFormError(null);

    try {
      // Check if client already exists
      const checkResponse = await axios.get<Client[]>(`${apiBaseUrl}/clients`);
      const existingClients = checkResponse.data;
      const clientExists = existingClients.some(
        (client: Client) =>
          client.name.toLowerCase() === data.name.toLowerCase()
      );

      if (clientExists) {
        setFormError("A client with this name already exists.");
        setIsLoading(false);
        return;
      }

      // If client doesn't exist, proceed with adding
      await axios.post<Client>(`${apiBaseUrl}/clients`, {
        ...data,
        id: 0,
        dateCreated: new Date().toISOString(),
      });
      form.reset();
      toast({
        title: "Client Added Successfully",
        description: `${data.name} has been added to the system.`,
        className: "bg-green-500 text-white",
      });
      onClose();
      router.refresh();
    } catch (error) {
      console.error("Error adding client:", error);
      toast({
        title: "Error Adding Client",
        description: "There was a problem adding the client. Please try again.",
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DialogTitle>Add New Client</DialogTitle>
        <DialogDescription>
          Fill in the details to add a new client to the system.
        </DialogDescription>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-row gap-1 font-semibold">
                Client Name<span className="text-red-500 font-bold">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter client name"
                  {...field}
                  style={{ borderRadius: "10px" }}
                />
              </FormControl>
              <FormMessage style={{ color: "red" }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex flex-row gap-1 font-semibold">
                Country <span className="text-red-500 font-bold">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter country"
                  {...field}
                  style={{ borderRadius: "10px" }}
                />
              </FormControl>
              <FormMessage style={{ color: "red" }} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="allowedscope"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Allowed Scope</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter allowed scope (optional)"
                  {...field}
                  value={field.value ?? ""}
                  style={{ borderRadius: "10px" }}
                />
              </FormControl>
              <FormMessage style={{ color: "red" }} />
            </FormItem>
          )}
        />

        {formError && <FormErrorSecond message={formError} />}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="hover:border-rose-400"
            style={{ borderRadius: "6px" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="border-[1px] bg-blue-500 hover:bg-blue-700 text-white"
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
              "Add Client"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddClientModal;
