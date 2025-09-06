import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface PageProps {
  params: { clinicId: string };
}

export async function GET(
  request: Request,
  { params: { clinicId } }: PageProps,
) {
  const { searchParams } = new URL(request.url);

  var date = searchParams.get("date");

  const getexistingAppointments = await prisma.appointment.findMany({
    where: {
      AND: [
        {
          healthFacilityId: clinicId,
        },
        {
          appointmentStart: {
            gte: new Date(date + "T09:00:00"),
            lte: new Date(date + "T21:00:00"),
          },
        },
      ],
    },

    select: {
      appointmentStart: true,
      appointmentEnd: true,
    },
  });

  // Get the count
  const doctorsId = await prisma.doctor.findMany({
    where: {
      healthFacilityId: clinicId,
    },
    select: {
      id: true,
    },
  });

  const numberOfDoctors = doctorsId.length;

  //After getting exisitng apoointments we will check the count of the appointmentStart at 0900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900, 2000 and make sure that the count is less than 3
  // if the count is less than 3 then we will append it to the list of available time slots

  const getAvailableTimeSlots = {
    9: { time: "0900", hour: 9, available: true, count: 0 },
    10: { time: "1000", hour: 10, available: true, count: 0 },
    11: { time: "1100", hour: 11, available: true, count: 0 },
    12: { time: "1200", hour: 12, available: true, count: 0 },
    13: { time: "1300", hour: 13, available: true, count: 0 },
    14: { time: "1400", hour: 14, available: true, count: 0 },
    15: { time: "1500", hour: 15, available: true, count: 0 },
    16: { time: "1600", hour: 16, available: true, count: 0 },
    17: { time: "1700", hour: 17, available: true, count: 0 },
    18: { time: "1800", hour: 18, available: true, count: 0 },
    19: { time: "1900", hour: 19, available: true, count: 0 },
    20: { time: "2000", hour: 20, available: true, count: 0 },
  };

  getexistingAppointments.forEach((appointment) => {
    const hour = appointment.appointmentStart.getHours().toString();

    // Add count and if count is 3 then set available to false
    getAvailableTimeSlots[hour].count++;

    if (getAvailableTimeSlots[hour].count >= numberOfDoctors) {
      getAvailableTimeSlots[hour].available = false;
    }
  });

  // Get all the available time from the getAvailableTimeSlots object if available is true
  // Return an array of objects with time and hour
  const availableTimeSlots = Object.values(getAvailableTimeSlots)
    .filter((timeSlot) => timeSlot.available)
    .map((timeSlot, index) => {
      return timeSlot.hour;
    });

  return NextResponse.json(availableTimeSlots);
}
