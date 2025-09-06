"use client";
import { Separator } from "@/components/ui/separator";
import { UserEmergencyContact, UserInfo } from "@prisma/client";
import { Conditions } from "@/app/(clinic)/clinic/[clinicId]/schedule/patient/[id]/helper";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { H2, H3, H4 } from "@/components/ui/hTags";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditUserInfoForm } from "./(forms)/EditUserInfoForm";
import { EditEmergecyContactInfoForm } from "./(forms)/EditEmergencyContactInfoForm";
import { EditPasswordForm } from "./(forms)/EditPasswordForm";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";

interface profilePageProps {
  userInfo: UserInfo;
  emergencyContactInfo: UserEmergencyContact;
}

export function ProfilePage({
  userInfo,
  emergencyContactInfo,
}: profilePageProps) {
  const userName = userInfo.firstname.concat(" ", userInfo.lastname.at(0), ".");
  const DOB = String(userInfo.dateOfBirth.getDate()).concat(
    "/",
    String(userInfo.dateOfBirth.getMonth() + 1),
    "/",
    String(userInfo.dateOfBirth.getFullYear()),
  );

  const [display, setDisplay] = useState<"Account" | "EmergencyContact">(
    "Account",
  );

  return (
    // <main className="mx-[2.5%] my-[1%] flex justify-between">
    <main className="m-auto my-10 flex max-w-7xl gap-4 space-y-10 px-3">
      <Card className="h-fit w-[30%] rounded-lg border bg-background md:w-[25%]">
        <CardHeader className="hidden md:block">
          <CardTitle className="text-center">{userName}</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="">
            <H3
              className={`${display === "Account" ? "bg-[#0f172a] text-white" : ""} py-3 pl-3`}
              onClick={() => setDisplay("Account")}
            >
              Account
            </H3>
            <Separator className="my-1" />
            <H3
              className={`${display === "EmergencyContact" ? "bg-[#0f172a] text-white" : ""} py-3 pl-3`}
              onClick={() => setDisplay("EmergencyContact")}
            >
              Emergency Contact
            </H3>
            <Separator className="my-1" />
            <Dialog>
              <DialogTrigger asChild>
                <H3 className="py-3 pl-3">Change Password</H3>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <EditPasswordForm userId={userInfo.userId} />
              </DialogContent>
            </Dialog>
            <Separator className="my-1" />
            <Link href={`/profile/${userInfo.userId}/appointment`}>
              <H3 className="py-3 pl-3">Appointments</H3>
            </Link>
          </div>
        </CardContent>
      </Card>

      {display == "Account" && (
        <Card className="w-[70%] max-w-[70%] rounded-xl border">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <div className="flex w-[50%] flex-col space-y-3">
                <div>
                  <Label>
                    <H3>First Name</H3>
                  </Label>
                  <H4>{userInfo.firstname}</H4>
                </div>
                <div>
                  <Label>
                    <H3>Gender</H3>
                  </Label>
                  <H4>{userInfo.gender}</H4>
                </div>
                <div>
                  <Label>
                    <H3>Phone Number</H3>
                  </Label>
                  <H4>{userInfo.phoneNumber}</H4>
                </div>
                <div>
                  <Label>
                    <H3>Postal Code</H3>
                  </Label>
                  <H4>{userInfo.postalCode}</H4>
                </div>
                <div>
                  <Label>
                    <H3>Address</H3>
                  </Label>
                  <H4>{userInfo.address}</H4>
                </div>
              </div>

              <div className="flex w-[50%] flex-col space-y-3">
                <div>
                  <Label>
                    <H3>Last Name</H3>
                  </Label>
                  <H4>{userInfo.lastname}</H4>
                </div>
                <div>
                  <Label>
                    <H3>Salutation</H3>
                  </Label>
                  <H4>{userInfo.salutation}</H4>
                </div>
                <div>
                  <Label>
                    <H3>Email</H3>
                  </Label>
                  <H4>{userInfo.email}</H4>
                </div>
                <div>
                  <Label>
                    <H3>Date of Birth</H3>
                  </Label>
                  <H4>{String(DOB)}</H4>
                </div>
              </div>
            </div>

            <Separator className="my-3" />
            <Conditions conditions={userInfo.existingConditions} />
          </CardContent>

          <CardFooter className="justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Edit</Button>
              </DialogTrigger>

              <DialogContent className="mt-2 max-h-[70vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Edit User Profile</DialogTitle>
                </DialogHeader>

                <EditUserInfoForm userInfo={userInfo} />
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      )}

      {display == "EmergencyContact" && (
        <Card className="w-[70%] rounded-xl border">
          <CardHeader>
            <CardTitle>Emergency Contact Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <div className="flex w-[50%] flex-col space-y-3">
                <div>
                  <Label>
                    <H3>First Name</H3>
                  </Label>
                  <H4>{emergencyContactInfo.firstname}</H4>
                </div>
                <div>
                  <Label>
                    <H3>Gender</H3>
                  </Label>
                  <H4>{emergencyContactInfo.gender}</H4>
                </div>
                <div>
                  <Label>
                    <H3>Phone Number</H3>
                  </Label>
                  <H4>{emergencyContactInfo.phoneNumber}</H4>
                </div>
                <div>
                  <Label>
                    <H3>Address</H3>
                  </Label>
                  <H4>{emergencyContactInfo.address}</H4>
                </div>
              </div>

              <div className="flex w-[50%] flex-col space-y-3">
                <div>
                  <Label>
                    <H3>Last Name</H3>
                  </Label>
                  <H4>{emergencyContactInfo.lastname}</H4>
                </div>
                <div>
                  <Label>
                    <H3>Salutation</H3>
                  </Label>
                  <H4>{emergencyContactInfo.salutation}</H4>
                </div>
                <div>
                  <Label>
                    <H3>Postal Code</H3>
                  </Label>
                  <H4>{emergencyContactInfo.postalCode}</H4>
                </div>
                <div>
                  <Label>
                    <H3>Relationship</H3>
                  </Label>
                  <H4>{emergencyContactInfo.relationship}</H4>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Edit</Button>
              </DialogTrigger>

              <DialogContent className="mt-2 max-h-[70vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle>Edit Emergency Contact Info</DialogTitle>
                </DialogHeader>

                <EditEmergecyContactInfoForm
                  emergencyContactInfo={emergencyContactInfo}
                />
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
