"use client";

import { z } from "zod";
import { CardWrapper } from "./CardWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas/index";
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

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const { errors } = form.formState;

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values).then((data: { error?: string; success?: string }) => {
        if (data.error) {
          setError(data.error);
          setSuccess("");
        } else {
          setError("");
          setSuccess(data.success);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={errors.email ? "text-red-500" : ""}>
                  Name
                </FormLabel>
                <Input
                  {...field}
                  placeholder="Your Name"
                  disabled={isPending}
                  className={`rounded-md border-[1px] ${
                    errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "focus:border-sky-300"
                  }`}
                />
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

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
                />
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormError message={error || ""} />
          <FormSuccess message={success || ""} />
          <Button
            type="submit"
            disabled={isPending}
            className="w-full hover:opacity-90 bg-black"
          >
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
