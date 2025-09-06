"use client";
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CreateLoginValues, loginSchema } from "@/lib/validation";
import Select from "@/components/ui/select-improve";
import LoadingButton from "@/components/LoadingButton";
import { login } from "./actions";
import { useState } from "react";
import { FormError } from "@/components/FormError";
import { set } from "date-fns";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const form = useForm<CreateLoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const [errorMessage, setErrorMessage] = useState<string>("");
  const searchParams = useSearchParams();

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form;

  // const searchParams = useSearchParams();
  // const urlError = searchParams.get("error");

  const callbackUrl = searchParams.get("callbackUrl");

  async function onSubmit(values: CreateLoginValues) {
    try {
      await login(values, callbackUrl).then((data) => {
        if (data.error) {
          setErrorMessage(data.error);
        } else {
          setErrorMessage("");
        }
      });
    } catch (error) {
      // Since Next auth is forced to throw error in actions.ts cannot set it here!
      setErrorMessage("");
    }
  }

  return (
    <main className=" m-auto my-10 max-w-7xl space-y-10 px-3">
      <div className="flex justify-center">
        <Form {...form}>
          <form
            className="space-y-4 "
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <Card className=" w-full max-w-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Enter your username below to login to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className=" grid gap-4 ">
                <FormField
                  control={control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="username">Username</Label>
                      <FormControl>
                        <Input
                          id="username"
                          name="username"
                          placeholder="gem0816"
                          className=""
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="password">Password</Label>
                      <FormControl>
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <Label htmlFor="role">Role</Label>
                      <FormControl>
                        <Select id="role" name="role" {...field} required>
                          <option value="" hidden>
                            Select a role
                          </option>
                          <option value="User">User</option>
                          <option value="HealthFacility">
                            Health Facility
                          </option>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormError message={errorMessage} />
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <LoadingButton type="submit" loading={isSubmitting}>
                  Login
                </LoadingButton>

                <Link
                  href="/register"
                  className="text-muted-foreground underline"
                >
                  Dont have account? Register here.
                </Link>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </main>
  );
}
