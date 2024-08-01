"use client";

import { z } from "zod";
import { CardWrapper } from "./CardWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas/index";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormError } from "@/app/components/form-error";
import { FormSuccess } from "../form-success";
import { reset } from "@/actions/reset";
import { useState, useTransition } from "react";
import { ScaleLoader } from "react-spinners";

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const { errors } = form.formState;

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    // console.log("Values>>>", values);

    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgoten Password?"
      backButtonLabel="Back to login?"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={errors.email ? "text-red-500" : ""}>
                  Email
                </FormLabel>
                <Input
                  {...field}
                  placeholder="john.doe@example.com"
                  type="email"
                  disabled={isPending}
                  className={`rounded-md border-[1px] ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "focus:border-sky-300"
                  }`}
                  style={{ borderRadius: "10px" }}
                />
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormError message={error || ""} />
          {/* Add 2FA */}
          <FormSuccess message={success || ""} />
          <button
            type="submit"
            disabled={isPending}
            className="w-full hover:opacity-90 bg-slate-800 text-white py-3 rounded-md font-semibold text-sm"
            style={{ borderRadius: "10px" }}
          >
            {isPending ? (
              <ScaleLoader
                height={15}
                width={2}
                radius={2}
                margin={2}
                color="white"
              />
            ) : (
              "Send reset Email"
            )}
          </button>
        </form>
      </Form>
    </CardWrapper>
  );
};
