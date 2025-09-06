import {Role, UserEmergencyContact, UserInfo } from "@prisma/client";
import { ProfilePage } from "./ProfilePage";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

async function getUserInfo(userId): Promise<UserInfo> {
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

export default async function profilePage({ params }: any) {
  const session = await auth();

  if (!session || session.user.role !== Role.User) {
    redirect("/");
  }


  const userId: string = params.userId;
  let userInfo = await getUserInfo(userId);
  let emergencyContactInfo = await getEmergencyContactInfo(userId);
  return (
    <ProfilePage
      userInfo={userInfo}
      emergencyContactInfo={emergencyContactInfo}
    />
  );
}
