import H1 from "@/components/ui/h1";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select-improve";
import ReactStars from "react-stars";
import { featureTypes } from "@/lib/feature-types";
import LoadingButton from "@/components/LoadingButton";
import { Role } from "@/lib/validation";
import React, { useState } from "react";
import CardDemo from "./scheduleTable";

import { PrismaClient, Appointment as PrismaAppointment } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const today = new Date();
const singaporeTime = today.toLocaleString("en-US", {
  timeZone: "Asia/Singapore",
});
const singaporeDate = new Date(singaporeTime);
singaporeDate.setHours(0, 0, 0, 0); // Set the time component to midnight in Singapore time

export type Appointment = PrismaAppointment;
const prisma = new PrismaClient();
interface PageProps {
  params: { clinicId: string };
}

export default async function Page({ params: { clinicId } }: PageProps) {
  const session = await auth();

  if (!session || session.user.role !== Role.HealthFacility) {
    redirect("/");
  }

  const incoming = await prisma.appointment.findMany({
    where: {
      appointmentStatus: {
        status: "Pending",
      },
      healthFacilityId: clinicId,
      appointmentEnd: {
        gte: singaporeDate,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      user: {
        include: {
          userinfo: true,
        },
      },
    },
  });

  const upcoming = await prisma.appointment.findMany({
    where: {
      appointmentStatus: {
        status: "Approved",
      },
      healthFacilityId: clinicId,
      appointmentEnd: {
        gte: singaporeDate,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      user: {
        include: {
          userinfo: true,
        },
      },
    },
  });

  return (
    <main className="space-y-100 m-auto my-10 max-w-7xl px-3">
      <div>
        <CardDemo clinicId={clinicId} incoming={incoming} upcoming={upcoming} />
      </div>
    </main>
  );
}
