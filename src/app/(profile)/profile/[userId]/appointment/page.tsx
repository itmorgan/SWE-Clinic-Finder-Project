import prisma from "@/lib/prisma";
import { Appointment, Role, Status } from "@prisma/client";
import { AppointmentComponent } from "./helper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function getHealthFacilityInfo(healthFacilityId){
  const healthFacilityInfo = await prisma.healthFacilityInfo.findFirst({
    where:{
      healthFacilityId: healthFacilityId
    }
  })
  return healthFacilityInfo
}

async function getPendingAppointments(userId){
    const today = new Date();
    const appointmentInfo = await prisma.appointment.findMany({
      orderBy:{
        appointmentStart:'asc'
      },
      where: {
        userId: userId,
        appointmentStart: {
          gt: today,
        },
        appointmentStatus: {
          status: Status.Pending,
        },
      },
    });
    return appointmentInfo;
}

async function getRejectedAppointments(userId){
    const today = new Date();
    const appointmentInfo = await prisma.appointment.findMany({
      orderBy:{
        appointmentStart:'desc'
      },
      where: {
        userId: userId,
        appointmentStatus: {
          status: Status.Rejected,
        },
      },
    });
    return appointmentInfo;
}

async function getPastAppointmentInfos(userId): Promise<Appointment[]> {
    const today = new Date();
    const appointmentInfo = await prisma.appointment.findMany({
      orderBy:{
        appointmentStart:'desc'
      },
      where: {
        userId: userId,
        appointmentStart: {
          lt: today,
        },
        appointmentStatus: {
          status: Status.Approved,
        },
      },
    });
    return appointmentInfo;
}

async function getUpcomingAppointmentInfos(userId): Promise<Appointment[]> {
    const today = new Date();
    const appointmentInfo = await prisma.appointment.findMany({
      orderBy:{
        appointmentStart:'asc'
      },
      where: {
        userId: userId,
        appointmentStart: {
          gte: today,
        },
        appointmentStatus: {
          status: Status.Approved,
        },
      },
    });
    return appointmentInfo;
}


export default async function Page({params:{userId}}){
  const session = await auth();

  if (!session || session.user.role !== Role.User) {
    redirect("/");
  }

    const pastAppointmentInfos = await getPastAppointmentInfos(userId)
    const rejectedAppointmentsInfos = await getRejectedAppointments(userId)
    const upcomingAppointmentInfos = await getUpcomingAppointmentInfos(userId)
    const pendingAppointmentsInfos = await getPendingAppointments(userId)
    const pastHF = []
    const rejectedHF = []
    const upcomingHF = []
    const pendingHF = []

    for (const appointment of pastAppointmentInfos) {
      const facilityInfo = await getHealthFacilityInfo(
        appointment.healthFacilityId,
      );
      pastHF.push(facilityInfo);
    }

    for (const appointment of rejectedAppointmentsInfos) {
      const facilityInfo = await getHealthFacilityInfo(
        appointment.healthFacilityId,
      );
      rejectedHF.push(facilityInfo);
    }

    for (const appointment of upcomingAppointmentInfos) {
      const facilityInfo = await getHealthFacilityInfo(
        appointment.healthFacilityId,
      );
      upcomingHF.push(facilityInfo);
    }

    for (const appointment of pendingAppointmentsInfos) {
      const facilityInfo = await getHealthFacilityInfo(
        appointment.healthFacilityId,
      );
      pendingHF.push(facilityInfo);
    }

    return(
        <AppointmentComponent 
          upcomingAppointments={upcomingAppointmentInfos}
          rejectedAppointments={rejectedAppointmentsInfos}
          pendingAppointments={pendingAppointmentsInfos}
          pastAppointments={pastAppointmentInfos}

          pastHF={pastHF}
          rejectedHF={rejectedHF}
          upcomingHF={upcomingHF}
          pendingHF={pendingHF}
        />
    )
}