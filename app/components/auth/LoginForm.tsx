"use client";

import { z } from "zod";
import { CardWrapper } from "./CardWrapper";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/index";
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
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScaleLoader } from "react-spinners";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with Different Provider"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
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
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          // Check for two-factor requirement
          if (data?.twoFactor) {
            setShowTwoFactor(true); // Show the 2FA field
          }
        })
        .catch(() => setError("Something went Wrong"));
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
          {showTwoFactor && (
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={errors.email ? "text-red-500" : ""}>
                    Two Factor Code
                  </FormLabel>
                  <Input
                    {...field}
                    placeholder="123456"
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
          )}
          {!showTwoFactor && (
            <>
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={errors.password ? "text-red-500" : ""}
                    >
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
                    <FormControl />
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal"
                    >
                      <Link href="/auth/reset">Forgot Password?</Link>
                    </Button>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </>
          )}
          <FormError message={error || urlError || ""} />
          {/* Add 2FA */}
          <FormSuccess message={success || ""} />
          <button
            type="submit"
            disabled={isPending}
            className="w-full hover:opacity-90 bg-black text-white py-3 rounded-md font-semibold text-sm"
            style={{ borderRadius: "10px" }}
          >
            {
              isPending ? (
                <ScaleLoader
                  height={15}
                  width={2}
                  radius={2}
                  margin={2}
                  color="white"
                />
              ) : showTwoFactor ? (
                "Confirm"
              ) : (
                "Login"
              ) // Updated button label logic
            }
          </button>
        </form>
      </Form>
    </CardWrapper>
  );
};
