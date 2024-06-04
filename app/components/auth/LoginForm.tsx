"use client";

import { z } from "zod";
import { CardWrapper } from "./CardWrapper";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/index";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/moving-border";
import { FormError } from "@/app/components/form-error";
import { FormSuccess } from "../form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with Different Provider"
      : "";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { errors } = form.formState;

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values)
        .then((data: { error?: string; success?: string }) => {
          if (data?.error) {
            console.error("Login error:", data.error);
            setError(data.error);
            setSuccess("");
          } else if (data?.success) {
            setError("");
            setSuccess(data.success);
          } else {
            setError("Unexpected response format.");
            setSuccess("");
          }
        })
        .catch((err) => {
          console.error("Unexpected error during login process:", err);
          setError("An unexpected error occurred.");
          setSuccess("");
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/sign-up"
      showSocial
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
                  placeholder="youremail@gmail.com"
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
          <FormError message={error || urlError || ""} />
          <FormSuccess message={success || ""} />
          <button
            type="submit"
            disabled={isPending}
            className="w-full hover:opacity-90 bg-black text-white py-3 rounded-md font-semibold text-sm"
            style={{ borderRadius: "10px" }}
          >
            {isPending ? "Loading..." : "Login"}
          </button>
        </form>
      </Form>
    </CardWrapper>
  );
};
