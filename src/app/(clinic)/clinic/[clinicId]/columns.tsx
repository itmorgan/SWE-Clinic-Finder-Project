"use client";

import {
  User,
  PrismaClient,
  Appointment as PrismaAppointment,
} from "@prisma/client";
import prisma from "@/lib/prisma";
// import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Appointment = PrismaAppointment;

interface ColumnDef<T> {
  accessorKey: keyof T | any; //  string;
  header: string;
}

export const columns: ColumnDef<Appointment & { user: User }>[] = [
  {
    accessorKey: "user.userinfo.firstname" ,
    header: "First Name",
  },
  {
    accessorKey: "user.userinfo.lastname" ,
    header: "Last Name",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "appointmentStart",
    header: "Appointment Start",
  },
  {
    accessorKey: "appointmentEnd",
    header: "Appointment End",
  },
];
