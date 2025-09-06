import { Prisma } from "@prisma/client";
import { cache } from "react";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import NewAppointmentForm from "./NewAppointmentForm";
import { auth } from "../../../../../../auth";

interface PageProps {
  params: { clinicId: string };
}

const getClinic = cache(async (clinicId: string) => {
  const clinic = await prisma.clinic.findUnique({
    where: {
      id: clinicId,
    },
  });

  if (!clinic) {
    notFound();
  }

  return clinic;
});

export async function generateMetadata({
  params: { clinicId },
}: PageProps): Promise<Metadata> {
  const clinic = await prisma.clinic.findUnique({
    where: {
      id: clinicId,
    },
  });
  return {
    title: clinic?.name,
    description: "Schedule an appointment",
  };
}

export default async function Page({ params: { clinicId } }: PageProps) {
  const session = await auth();

  if (!session || session.user.role !== "User") {
    redirect("/");
  }

  const clinic = await getClinic(clinicId);

  const userId = session.user.id;

  return (
    <main>
      <NewAppointmentForm clinic={clinic} userId={userId} />
    </main>
  );
}
