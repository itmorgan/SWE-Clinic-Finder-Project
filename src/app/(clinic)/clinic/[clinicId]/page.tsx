import H1 from "@/components/ui/h1";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select-improve";
import ReactStars from "react-stars";
import { featureTypes } from "@/lib/feature-types";
import LoadingButton from "@/components/LoadingButton";
import { Role } from "@/lib/validation";
import { PrismaClient, Appointment as PrismaAppointment } from "@prisma/client";
import { CardDemo } from "./notifTable";
import { DataTable } from "./appointmentTable";
import { columns } from "./columns";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@/auth";
export type Appointment = PrismaAppointment;
import prisma from "@/lib/prisma";

interface PageProps {
  params: { clinicId: string };
}

export const metadata: Metadata = {
  title: "Clinic Dashboard",
  description: "Clinic page",
  robots: {
    index: true,
    follow: true,
  },
};

const today = new Date();
const singaporeTime = today.toLocaleString("en-US", {
  timeZone: "Asia/Singapore",
});
const singaporeDate = new Date(singaporeTime);
singaporeDate.setHours(0, 0, 0, 0); // Set the time component to midnight in Singapore time

async function getData({
  params: { clinicId },
}: PageProps): Promise<Appointment[]> {
  try {
    // Use Prisma client to fetch appointments from the database
    const appointments = await prisma.appointment.findMany({
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
        appointmentStart: "asc",
      },

      include: {
        user: {
          include: {
            userinfo: true,
          },
        },
      },
    });

    return appointments;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching data:", error);
    throw error;
  } finally {
    // Disconnect from the Prisma client
  }
}

export default async function Page({ params: { clinicId } }: PageProps) {
  const session = await auth();

  if (!session || session.user.role !== Role.HealthFacility) {
    redirect("/");
  }

  const data = await getData({ params: { clinicId } });

  return (
    <main className="space-y-100 space-between m-auto my-10 max-w-7xl px-3">
      <div className="justify-between pb-32">
        <DataTable columns={columns} data={data} />
      </div>
    </main>
  );
}
