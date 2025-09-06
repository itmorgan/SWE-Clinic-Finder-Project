import { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Stethoscope } from "lucide-react";
import H1 from "@/components/ui/h1";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register",
  description: "Register account for DrWhere",
};

export default function Page() {
  return (
    <main className="m-auto my-10 min-w-[350px] max-w-7xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        <H1>Create an account</H1>
        <p className="text-muted-foreground">
          Select the type of account you want to create
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-5 lg:flex-row">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">
              Create an account as a user
            </CardTitle>
            <CardDescription className="text-center">
              Click to register as a user
            </CardDescription>
            <CardContent>
              <div className="m-auto justify-items-center">
                <div className="flex items-center justify-center">
                  <User size={100} className="shrink-0" />
                </div>
              </div>
            </CardContent>
          </CardHeader>

          <CardFooter>
            <Button asChild className="m-auto w-full">
              <Link href="/register/register-user">Create user account</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">
              Create an account as a health facility
            </CardTitle>
            <CardDescription className="text-center">
              Click to register as a health facility to manage your patients
              appointment
            </CardDescription>
            <CardContent>
              <div className="m-auto justify-items-center">
                <div className="flex items-center justify-center">
                  <Stethoscope size={100} className="shrink-0" />
                </div>
              </div>
            </CardContent>
          </CardHeader>

          <CardFooter>
            <Button asChild className="m-auto w-full">
              <Link href="/register/register-healthfac">
                Create a heatlh facility account
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>

    // Idea here is to create 2 cards, for user to select creating account as health facility or as a user
    // Grab image from lucide react and make sure to get one in light mode and one in dark mode
  );
}
