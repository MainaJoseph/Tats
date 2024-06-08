"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export function UpdatedTabs() {
  const [activeTab, setActiveTab] = useState("account");

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
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
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
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
