"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { startTransition, useTransition, useState } from "react";
import { useSession } from "next-auth/react";

import { SettingSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ScaleLoader } from "react-spinners";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormSuccess } from "@/app/components/form-success";
import { FormError } from "@/app/components/form-error";

const SettingsPage = () => {
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  console.log(user);

  //Define our form
  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
    },
  });

  //Call settings server action
  const onSubmit = (values: z.infer<typeof SettingSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }

          if (data.success) {
            update();
            setSuccess(data.success);
          }
        })
        .catch(() => setError("Something Went Wrong"));
    });
  };

  return (
    <div>
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className=" font-semibold">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Your name"
                      disabled={isPending}
                      className=" rounded-md"
                      style={{ borderRadius: "10px" }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {user?.isOAuth === false && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" font-semibold">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="youremail@example.com"
                          type="email"
                          disabled={isPending}
                          className=" rounded-md"
                          style={{ borderRadius: "10px" }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem
                      className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"
                      style={{ borderRadius: "10px" }}
                    >
                      <div className="space-y-0.5">
                        <FormLabel className="font-semibold">
                          Two Factor Authentication
                        </FormLabel>
                        <FormDescription>
                          Enable two factor authentication for your account
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          disabled={isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className=" border-slate-600"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
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
              "Save"
            )}
          </button>
        </form>
      </Form>
    </div>
  );
};

export default SettingsPage;
