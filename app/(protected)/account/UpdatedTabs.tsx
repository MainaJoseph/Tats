"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas/index";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { newPasswordAccount } from "@/actions/new-password-account";
import { useState, useTransition } from "react";
import { ScaleLoader } from "react-spinners";
import { FormSuccess } from "@/app/components/form-success";

// Assuming you have a way to get the logged-in user's ID
import { useSession } from "next-auth/react";

export function UpdatedTabs() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("account");

  //for form submission
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  //For checking form errors
  const { errors } = form.formState;

  //Submit functionf
  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    //Validating and checking if user has logged in
    if (userId) {
      startTransition(() => {
        newPasswordAccount(values, userId).then((data) => {
          setError(data?.error);
          setSuccess(data?.success);
        });
      });
    } else {
      setError("User not logged in");
    }
  };

  return (
    <Tabs className="w-full" value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 gap-16 mb-8">
        <TabsTrigger
          value="account"
          style={{
            padding: "12px",
            borderRadius: "10px",
            backgroundColor: activeTab === "account" ? "black" : "transparent",
            color: activeTab === "account" ? "white" : "black",
            border: activeTab === "account" ? "none" : "1px solid #87CEEB",
          }}
          onClick={() => setActiveTab("account")}
        >
          Account
        </TabsTrigger>
        <TabsTrigger
          value="password"
          style={{
            padding: "12px",
            borderRadius: "10px",
            backgroundColor: activeTab === "password" ? "black" : "transparent",
            color: activeTab === "password" ? "white" : "black",
            border: activeTab === "password" ? "none" : "1px solid #87CEEB",
          }}
          onClick={() => setActiveTab("password")}
        >
          Password
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you are done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                style={{ borderRadius: "10px" }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Change your username"
                className="rounded-md"
                style={{ borderRadius: "10px" }}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full py-2 border-[1px] bg-black text-white hover:bg-slate-700"
              style={{ borderRadius: "10px" }}
            >
              Save changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you will be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
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
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={errors.confirmPassword ? "text-red-500" : ""}
                      >
                        Confirm Password
                      </FormLabel>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        disabled={isPending}
                        className={`rounded-md border-[1px] ${
                          errors.confirmPassword
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
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
