"use server";
import prisma from "@/lib/prisma";
import {
  CreateScheduleAppointmentValues,
  scheduleAppointmentSchema,
} from "@/lib/validation";
import { Gender } from "@prisma/client";
import { redirect } from "next/navigation";

export async function fetchUserData(userId: string) {
  const user = await prisma.user
    .findUnique({
      where: {
        id: userId,
      },
    })
    .then(async (user) => {
      // Get the user info
      const userInfo = await prisma.userInfo.findUnique({
        where: {
          userId: userId,
        },
      });

      if (!userInfo) {
        return null;
      }

      return {
        ...user,
        userInfo: {
          ...userInfo,
        },
      };
    });

  if (!user) {
    return null;
  }

  return user;
}

export async function createUserAppointment(
  formData: CreateScheduleAppointmentValues,
  userId: string,
  clinicId: string,
) {
  const values = scheduleAppointmentSchema.safeParse(formData);

  if (!values.success) {
    return { error: "Invalid account creation" };
  }

  //Replace the appointmentDate hour with the appointmentTime hour
  const appointmentStart = new Date(formData.appointmentDate);
  const appointmentTime = formData.appointmentTime;
  appointmentStart.setHours(parseInt(appointmentTime));

  const appointmentDuration = 1;

  const appointmentEnd = new Date(appointmentStart);
  appointmentEnd.setHours(appointmentStart.getHours() + appointmentDuration);

  const userData = await fetchUserData(userId);

  const age =
    new Date().getFullYear() -
    new Date(userData.userInfo.dateOfBirth).getFullYear();

  const gender = userData.userInfo.gender;

  const hasAlreadyMadeAppointment = await prisma.appointment.findFirst({
    where: {
      userId: userId,
      appointmentStart: {
        gte: appointmentStart,
        lte: appointmentEnd,
      },
    },
  });

  if (hasAlreadyMadeAppointment) {
    return { error: "You already have an appointment at this time" };
  }

  await prisma.appointment
    .create({
      data: {
        gender: gender as Gender,
        age: age,
        userId: userId,
        healthFacilityId: clinicId,
        symptoms: formData.symptoms,
        appointmentDuration: appointmentDuration,
        appointmentStart: appointmentStart,
        appointmentEnd: appointmentEnd,
      },
    })
    .then(async (appointment) => {
      await prisma.appointmentStatus.create({
        data: {
          appointmentId: appointment.id,
        },
      });
    });

  redirect(`/search/clinic/schedule-submitted`);
}
