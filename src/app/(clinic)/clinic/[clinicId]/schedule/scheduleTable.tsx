"use client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChevronRightIcon, TrashIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import React, { useState } from "react";
import PreviousMap from "postcss/lib/previous-map";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment, User, UserInfo } from "@prisma/client";
import { format } from "date-fns";
import { acceptAppointment, rejectAppointment } from "./action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import symptomsList from "@/lib/symptoms-list";
import { getSymptoms } from "./patient/[id]/helper";
import RemarkForm from "./remarkForm";
const formSchema = z.object({
  remarks: z.string().min(1, {
    message: "Remarks must be at least 2 characters.",
  }),
});

interface CardProps {
  incoming: (Appointment & { user: User & { userinfo: UserInfo } })[];
  upcoming: (Appointment & { user: User & { userinfo: UserInfo } })[];
  clinicId: string;
}

const appointmentsPerPage = 3;

export default function CardDemo({ incoming, upcoming, clinicId }: CardProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      remarks: "",
    },
  });

  function onSubmit(appointmentId: string, values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const remarks: string = values.remarks as string;
    rejectAppointment(appointmentId, remarks);

    form.reset();
  }

  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * appointmentsPerPage;
  const endIndex = startIndex + appointmentsPerPage;

  const currentIncomingAppointments = incoming.slice(startIndex, endIndex);
  const currentUpcomingAppointments = upcoming.slice(startIndex, endIndex);

  const totalIncomingPages = Math.ceil(incoming.length / appointmentsPerPage);

  const totalUpcomingPages = Math.ceil(upcoming.length / appointmentsPerPage);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleIncomingNextPage = () => {
    setCurrentPage((nextPage) => Math.min(nextPage + 1, totalIncomingPages));
  };

  const handleUpcomingNextPage = () => {
    setCurrentPage((nextPage) => Math.min(nextPage + 1, totalUpcomingPages));
  };

  return (
    <Tabs defaultValue="incoming" className="w-[full]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="incoming" onClick={() => setCurrentPage(1)}>
          Incoming
        </TabsTrigger>
        <TabsTrigger value="upcoming" onClick={() => setCurrentPage(1)}>
          Upcoming
        </TabsTrigger>
      </TabsList>

      <TabsContent value="incoming">
        <Card className={cn("h-[600px] w-[full]", incoming)} {...CardDemo}>
          <CardHeader>
            <CardTitle>Incoming Appointments</CardTitle>
          </CardHeader>

          {/* content in the card */}
          <CardContent className="grid max-h-[900px] gap-4 overflow-hidden">
            {currentIncomingAppointments.length === 0 ? (
              <p className="h-24 text-center">No appointments available</p>
            ) : (
              <div>
                {currentIncomingAppointments.map((incoming, index) => (
                  <div
                    key={index}
                    className="mb-4  grid grid-cols-[25px_1fr]  items-center space-x-4 rounded-md border p-3 pb-8"
                  >
                    <span className="flex h-2 w-2 translate-y-1" />
                    <div className="h-150 flex flex-row justify-between">
                      <div className="w-100">
                        <div className="flex items-center justify-center">
                          <p className="text-big text-center font-medium">
                            Name: {incoming.user.userinfo.firstname}{" "}
                            {incoming.user.userinfo.lastname}
                          </p>
                          <p className=" p-4 text-muted-foreground">
                            Gender: {incoming.gender}
                          </p>
                          <Button asChild variant="link">
                            {/* FIX THE RREFF */}
                            <Link
                              href={`/clinic/${clinicId}/schedule/patient/${incoming.userId}`}
                            >
                              {" "}
                              View{" "}
                            </Link>
                          </Button>
                        </div>
                        <div className="p-1">
                          <Card>
                            <p className="text-big p-1 text-center font-medium">
                              {format(
                                incoming.appointmentStart,
                                "MM/dd/yyyy, h:mm:ss a",
                              )}
                            </p>
                          </Card>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          margin: "10px",
                          flexDirection: "row",
                        }}
                      >
                        <div className="pr-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button>Accept</Button>
                            </DialogTrigger>

                            <DialogContent className="border-4 sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="text-2xl">
                                  Name: {incoming.user.userinfo.firstname}{" "}
                                  {incoming.user.userinfo.lastname}
                                </DialogTitle>

                                <DialogDescription>
                                  Gender: {incoming.gender}
                                </DialogDescription>
                              </DialogHeader>
                              <span className="m-0 text-xl">Details:</span>
                              <div className="grid w-full gap-2">
                                <Card>
                                  <div className="p-2">
                                    <ul>
                                      Date & Time:{" "}
                                      {format(
                                        incoming.appointmentStart,
                                        "MM/dd/yyyy, h:mm:ss a",
                                      )}{" "}
                                    </ul>
                                    <ul>
                                      Symptoms:{" "}
                                      {
                                        // JSON.parse(JSON.stringify(incoming.symptoms)).map((symptom)=>(symptom))
                                        getSymptoms(incoming.symptoms).join(
                                          ", ",
                                        )
                                      }
                                    </ul>
                                  </div>
                                </Card>
                                <DialogFooter className="sm:justify-start">
                                  <DialogClose asChild>
                                    <Button
                                      onClick={() => {
                                        acceptAppointment(incoming.id);
                                      }}
                                      variant="outline"
                                      className="w-full"
                                    >
                                      Confirm Acceptance
                                    </Button>
                                  </DialogClose>
                                </DialogFooter>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div>
                          {/* implement form */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="secondary">Reject</Button>
                            </DialogTrigger>
                            <DialogContent className="border-4 sm:max-w-md">
                              <Form {...form}>
                                <form
                                  onSubmit={form.handleSubmit((values) =>
                                    onSubmit(incoming.id, values),
                                  )}
                                  className="space-y-8"
                                >
                                  <FormField
                                    control={form.control}
                                    name="remarks"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-2xl">
                                          Name:{" "}
                                          {incoming.user.userinfo.firstname}{" "}
                                          {incoming.user.userinfo.lastname}
                                        </FormLabel>
                                        <FormDescription>
                                          <span className="m-0 text-xl">
                                            Remarks:
                                          </span>
                                        </FormDescription>
                                        <FormControl>
                                          <Input type="remarks" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  <DialogFooter>
                                    <DialogClose className="w-full">
                                      <Button variant="outline">
                                        Confirm Rejection
                                      </Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* pagination part  */}
        <div className="flex justify-between p-4">
          <Link
            href="#"
            onClick={handlePreviousPage}
            className={cn(
              "flex items-center gap-2 font-semibold",
              currentPage <= 1 && "invisible",
            )}
          >
            <ArrowLeft size={16} />
            Previous Page
          </Link>
          <span
            className={cn(
              "font-semibold",
              totalIncomingPages === 0 && "invisible",
            )}
          >
            Page {currentPage} of {totalIncomingPages}
          </span>
          <Link
            href="#"
            onClick={handleIncomingNextPage}
            className={cn(
              "flex items-center gap-2 font-semibold",
              currentPage >= totalIncomingPages && "invisible",
            )}
          >
            Next page
            <ArrowRight size={16} />
          </Link>
        </div>
      </TabsContent>

      <TabsContent value="upcoming">
        <Card className={cn("h-[600px] w-[full]", upcoming)} {...CardDemo}>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>

          {/* content in the card */}
          <CardContent className="grid max-h-[900px] gap-4 overflow-hidden">
            {currentUpcomingAppointments.length === 0 ? (
              <p className="h-24 text-center">No appointments available</p>
            ) : (
              <div>
                {currentUpcomingAppointments.map((upcoming, index) => (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-center space-x-4 rounded-md border p-3 pb-8"
                  >
                    <span className="flex h-2 w-2 translate-y-1" />
                    <div className="h-150 flex flex-row justify-between">
                      <div>
                        <div className="flex items-center justify-center">
                          <p className="text-big text-center font-medium">
                            Name: {upcoming.user.userinfo.firstname}{" "}
                            {upcoming.user.userinfo.lastname}
                          </p>
                          <p className=" p-4 text-muted-foreground">
                            Gender: {upcoming.gender}
                          </p>
                          <Button asChild variant="link">
                            <Link
                              href={`/clinic/${clinicId}/schedule/patient/${upcoming.userId}`}
                            >
                              {" "}
                              View{" "}
                            </Link>
                          </Button>
                        </div>
                        <div className="p-1">
                          <Card>
                            <p className="text-big p-1 text-center font-medium">
                              {format(
                                upcoming.appointmentStart,
                                "MM/dd/yyyy, h:mm:ss a",
                              )}
                            </p>
                          </Card>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          margin: "10px",
                          flexDirection: "row",
                        }}
                      >
                        <RemarkForm appointment={upcoming}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          {/* pagination part  */}
        </Card>
        <div className="flex justify-between p-4">
          <Link
            href="#"
            onClick={handlePreviousPage}
            className={cn(
              "flex items-center gap-2 font-semibold",
              currentPage <= 1 && "invisible",
            )}
          >
            <ArrowLeft size={16} />
            Previous Page
          </Link>
          <span
            className={cn(
              "font-semibold",
              totalUpcomingPages === 0 && "invisible",
            )}
          >
            Page {currentPage} of {totalUpcomingPages}
          </span>
          <Link
            href="#"
            onClick={handleUpcomingNextPage}
            className={cn(
              "flex items-center gap-2 font-semibold",
              currentPage >= totalUpcomingPages && "invisible",
            )}
          >
            Next page
            <ArrowRight size={16} />
          </Link>
        </div>
      </TabsContent>
    </Tabs>
  );
}
