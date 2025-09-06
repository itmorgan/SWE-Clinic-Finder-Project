import { UserInfoPanel } from "./helper";
import {
  Appointment,
  HealthFacilityInfo,
  Role,
  Status,
  UserEmergencyContact,
  UserInfo,
} from "@prisma/client";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

async function getPatientInfo(userId): Promise<UserInfo> {
  const userInfo = await prisma.userInfo.findFirst({
    where: { userId: userId },
  });
  return userInfo;
}
async function getEmergencyContactInfo(userId): Promise<UserEmergencyContact> {
  const emergencyContacInfo = await prisma.userEmergencyContact.findFirst({
    where: { userId: userId },
  });
  return emergencyContacInfo;
}
async function getAppointmentInfo(userId): Promise<Appointment[]> {
  const appointmentInfo = await prisma.appointment.findMany({
    where: { userId: userId },
  });
  return appointmentInfo;
}
async function getHealthFacilityInfo(
  healthFacilityId,
): Promise<HealthFacilityInfo> {
  const healthFacilityInfo = await prisma.healthFacilityInfo.findFirst({
    where: { healthFacilityId: healthFacilityId },
  });
  return healthFacilityInfo;
}
async function getPastAppointmentInfos(userId): Promise<Appointment[]> {
  const today = new Date();
  const appointmentInfo = await prisma.appointment.findMany({
    where: {
      userId: userId,
      appointmentStart: {
        lte: today,
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
    where: {
      userId: userId,
      appointmentStart: {
        gt: today,
      },
      appointmentStatus: {
        status: {
          in: [Status.Approved], // in:[Status.Pending, Status.Approved]
        },
      },
    },
  });
  return appointmentInfo;
}

export default async function patientInfo({ params }: any) {
  const session = await auth();

  if (!session || session.user.role !== Role.HealthFacility) {
    redirect("/");
  }

  const userId: string = params.id;
  let patientInfo = await getPatientInfo(userId);
  let emergencyContacInfo = await getEmergencyContactInfo(userId);
  let pastAppointmentInfos = await getPastAppointmentInfos(userId);
  let upcomingAppointmentInfos = await getUpcomingAppointmentInfos(userId);
  let pastHealthFacilityInfos = [];
  let upcomingHealthFacilityInfos = [];

  for (const appointment of pastAppointmentInfos) {
    const facilityInfo = await getHealthFacilityInfo(
      appointment.healthFacilityId,
    );
    pastHealthFacilityInfos.push(facilityInfo);
  }

  for (const appointment of upcomingAppointmentInfos) {
    const facilityInfo = await getHealthFacilityInfo(
      appointment.healthFacilityId,
    );
    upcomingHealthFacilityInfos.push(facilityInfo);
  }

  return (
    <UserInfoPanel
      userInfo={patientInfo}
      emergencyContactInfo={emergencyContacInfo}
      pastAppointmentInfos={pastAppointmentInfos}
      pastHealthFacilityInfos={pastHealthFacilityInfos}
      upcomingAppointmentInfos={upcomingAppointmentInfos}
      upcomingHealthFacilityInfos={upcomingHealthFacilityInfos}
    />
  );
}
