"use client";

import { Clinic } from "@prisma/client";
import LoadingButton from "@/components/LoadingButton";
import H1 from "@/components/ui/h1";
import Select from "@/components/ui/select-improve";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  CreateScheduleAppointmentValues,
  scheduleAppointmentSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import symptomsList from "@/lib/symptoms-list";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn, formatTimeSlot } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar-improve";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { createUserAppointment, fetchUserData } from "./actions";
import { FormError } from "@/components/FormError";

interface formProps {
  clinic: Clinic;
  userId: string;
}

export default function NewAppointmentForm({ clinic, userId }: formProps) {
  const form = useForm<CreateScheduleAppointmentValues>({
    resolver: zodResolver(scheduleAppointmentSchema),
  });

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form;

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const selectedDate = watch("appointmentDate");

  async function fetchAvailableTimeSlots() {
    if (selectedDate) {
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");

        const response = await fetch(
          `/api/clinic/${clinic.id}/appointment/availabletimeslots?date=${formattedDate}`,
        );
        const data = await response.json();

        // Get current hour and filter out time slots that are less than current hour
        const currentHour = new Date().getHours();

        // Check if the current date is the selected date
        if (
          new Date().getDate() === selectedDate.getDate() &&
          new Date().getMonth() === selectedDate.getMonth() &&
          new Date().getFullYear() === selectedDate.getFullYear()
        ) {
          // Filter out the array of number less than current hour
          const filteredData = data.filter(
            (timeSlot) => timeSlot > currentHour,
          );

          setAvailableTimeSlots(filteredData);
        } else {
          setAvailableTimeSlots(data);
        }
      } catch (error) {
        console.error("Error fetching available time slots:", error);
      }
    } else {
      setAvailableTimeSlots([]);
    }
  }

  useEffect(() => {
    if (!selectedDate) return;

    fetchAvailableTimeSlots();
  }, [selectedDate]);

  async function onSubmit(values: CreateScheduleAppointmentValues) {
    try {
      await createUserAppointment(values, userId, clinic.id).then(
        (response) => {
          if (response?.error) {
            setErrorMessage(response.error);
          }
        },
      );
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const disabledDays = [{ before: new Date() }];

  return (
    <main className="m-auto my-10 max-w-3xl space-y-10">
      <div className="space-y-5 text-center">
        <H1>Book an appointment</H1>
        <p className="text-muted-foreground">
          Book an apointment with {clinic.name} to get your symptoms treated
        </p>
      </div>

      <div className="space-y-6 rounded-lg border p-4">
        <div>
          <h2 className="font-semibold">Appointment details</h2>
          <p className="text-muted-foreground">Provide appointment details</p>
        </div>

        <Form {...form}>
          <form
            className="space-y-4"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Appointment Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      {/* <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() ||
                          date >
                            new Date(
                              new Date().setMonth(new Date().getMonth() + 9),
                            )
                        }
                        initialFocus
                      /> */}
                      <Calendar
                        mode="single"
                        captionLayout="dropdown-buttons"
                        disabled={disabledDays}
                        // selected={date}
                        // onSelect={setDate}
                        fromYear={new Date("1900-01-01").getFullYear()}
                        toYear={new Date().getFullYear()}
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="appointmentTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Appointment Time</FormLabel>
                  <FormControl>
                    <Select {...field} disabled={!selectedDate}>
                      <option value="" hidden>
                        Select an option
                      </option>
                      {availableTimeSlots.map((timeSlot) => (
                        <option key={timeSlot} value={timeSlot}>
                          {formatTimeSlot(timeSlot)}
                        </option>
                      ))}

                      {/* {availableTimeSlots.map((timeSlot) => (
                        <option key={timeSlot.time} value={timeSlot.time}>
                          {timeSlot.time}
                        </option>
                      ))} */}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="symptoms"
              render={() => (
                <FormItem>
                  <FormLabel>Symptoms Facing</FormLabel>
                  <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                    {symptomsList.map((symptom) => (
                      <FormField
                        key={symptom.ID}
                        control={form.control}
                        name="symptoms"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={symptom.ID}
                              className="mb-3 flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(
                                    symptom.ID.toString(),
                                  )}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          symptom.ID.toString(),
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) =>
                                              value !== symptom.ID.toString(),
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {symptom.Name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </ScrollArea>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={isSubmitting}>
              Submit
            </LoadingButton>

            {errorMessage && <FormError message={errorMessage} />}
          </form>
        </Form>
      </div>
    </main>
  );
}
