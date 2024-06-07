"use client";

import { z } from "zod";
import { CardWrapper } from "./CardWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas/index";
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
import { newPassword } from "@/actions/new-password";
import { useState, useTransition } from "react";
import { ScaleLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

export const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const { errors } = form.formState;

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password"
      backButtonLabel="Back to login?"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={errors.password ? "text-red-500" : ""}>
                  Password
                </FormLabel>
                <Input
                  {...field}
                  placeholder="******"
                  type="password"
                  disabled={isPending}
                  className={`rounded-md border-[1px] ${
                    errors.password
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
            className="w-full hover:opacity-90 bg-black text-white py-3 rounded-md font-semibold text-sm"
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
              "Reset Password"
            )}
          </button>
        </form>
      </Form>
    </CardWrapper>
  );
};
