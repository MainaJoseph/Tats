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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
                </FormItem>
              )}
            />
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
