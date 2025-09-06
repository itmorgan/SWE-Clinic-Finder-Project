"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Appointment, HealthFacilityInfo } from "@prisma/client";
import { format } from "date-fns";
import H1 from "@/components/ui/h1";
import { Button } from "@/components/ui/button";
import { H2, H3, H4 } from "@/components/ui/hTags";
import Link from "next/link";
import { getSymptoms } from "@/lib/getSymptoms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { deleteAppointment } from "./actions";
import Badge from "@/components/Badge";
import { useState } from "react";

interface AppointmentComponentProps {
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  pendingAppointments: Appointment[];
  rejectedAppointments: Appointment[];

  pastHF: HealthFacilityInfo[];
  rejectedHF: HealthFacilityInfo[];
  upcomingHF: HealthFacilityInfo[];
  pendingHF: HealthFacilityInfo[];
}

export function AppointmentComponent({
  upcomingAppointments,
  pastAppointments,
  pendingAppointments,
  rejectedAppointments,
  pastHF,
  rejectedHF,
  upcomingHF,
  pendingHF,
}: AppointmentComponentProps) {
  return (
    // <main className="m-[1%] flex justify-center">
    <main className="m-auto my-10 flex max-w-7xl gap-4 space-y-10 px-3">
      <Tabs defaultValue="Upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="Upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Past">Past</TabsTrigger>
          <TabsTrigger value="Rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="Upcoming">
          <Card>
            <CardTitle className="px-5 py-5">Upcoming Appointments</CardTitle>
            <CardContent>
              {upcomingAppointments.length == 0 ? (
                <div className="text-center">No appointments available</div>
              ) : (
                upcomingAppointments.map((upcoming, index) => {
                  return (
                    <UserAppointment
                      key={index}
                      HF={upcomingHF[index]}
                      appointment={upcoming}
                      variant="upcoming"
                    />
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Past">
          <Card>
            <CardTitle className="px-5 py-5">Past Appointments</CardTitle>
            <CardContent>
              {pastAppointments.length == 0 ? (
                <div className="text-center">No appointments available</div>
              ) : (
                pastAppointments.map((past, index) => {
                  return (
                    <UserAppointment
                      key={index}
                      HF={pastHF[index]}
                      appointment={past}
                    />
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Pending">
          <Card>
            <CardTitle className="px-5 py-5">Pending Appointments</CardTitle>
            <CardContent>
              {pendingAppointments.length == 0 ? (
                <div className="text-center">No appointments available</div>
              ) : (
                pendingAppointments.map((pending, index) => {
                  return (
                    <UserAppointment
                      key={index}
                      HF={pendingHF[index]}
                      appointment={pending}
                      variant="pending"
                    />
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Rejected">
          <Card>
            <CardTitle className="px-5 py-5">Rejected Appointments</CardTitle>
            <CardContent>
              {rejectedAppointments.length == 0 ? (
                <div className="text-center">No appointments available</div>
              ) : (
                rejectedAppointments.map((rejected, index) => {
                  return (
                    <UserAppointment
                      key={index}
                      HF={rejectedHF[index]}
                      appointment={rejected}
                    />
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}

interface UserAppointmentProps {
  appointment: Appointment;
  HF: HealthFacilityInfo;
  variant?: string;
}

function UserAppointment({
  appointment,
  HF,
  variant = "normal",
}: UserAppointmentProps) {
  const [open, setOpen] = useState(false);
  const symptoms = getSymptoms(appointment.symptoms);
  return (
    <div className="mb-4 flex w-full justify-between rounded-md border p-3">
      <div className="flex flex-col items-start">
        <div className="flex">
          <H3 className="">{HF.name}</H3>
          <Button asChild variant="link">
            <Link href={`/search/clinic/${HF.healthFacilityId}`}>
              View Clinic
            </Link>
          </Button>
        </div>

        {symptoms.length === 0 ? (
          <></>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link"> View All Symptoms</Button>
            </DialogTrigger>

            <DialogContent className="max-h-[70vh]">
              <DialogHeader>
                <DialogTitle>Symptoms</DialogTitle>
              </DialogHeader>
              <div className="max-h-[55vh] overflow-auto rounded-md border p-2">
                {symptoms.map((symptom, index) => (
                  <>
                    <div key={index}>{symptom}</div>
                    <Separator className="my-2" />
                  </>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        )}

        <div className="text-big w-auto rounded-md border px-10 py-1 text-center font-medium">
          {format(appointment.appointmentStart, "dd MMM yyyy, h:mm:ss a")}
        </div>
      </div>
      {variant === "upcoming" || variant === "pending" ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">Cancel</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle></DialogTitle>
            </DialogHeader>
            <div className="text-center font-semibold">
              Are you sure you want to cancel the appointment?
            </div>
            <div className="flex w-full">
              <Button
                className="w-[45%] rounded-lg"
                variant="destructive"
                onClick={async () => {
                  await deleteAppointment(appointment);
                  setOpen(false);
                }}
              >
                Yes
              </Button>
              <DialogClose asChild>
                <Button className="ml-[5%] w-[45%] rounded-lg">No</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <></>
      )}
    </div>
  );
}
