"use client";
import { z } from "zod";
import { CardWrapper } from "./CardWrapper";
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
import { useTransition } from "react";

export const LoginForm = () => {
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
    startTransition(() => {
      login(values);
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
          <FormError message="" />
          <FormSuccess message="" />
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
