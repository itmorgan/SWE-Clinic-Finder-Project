"use server";

import { getVerificationTokenByToken } from "@/lib/data/verificationtokens";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  if (existingToken.role === Role.User) {
    const existingUser = await prisma.userInfo.findFirst({
      where: { email: existingToken.email },
    });

    if (!existingUser) {
      return { error: "User does not exist!" };
    }

    await prisma.userInfo.update({
      where: { userId: existingUser.userId },
      data: {
        email: existingToken.email,
      },
    });

    await prisma.user.update({
      where: { id: existingUser.userId },
      data: {
        emailVerified: true,
      },
    });
  }

  if (existingToken.role === Role.HealthFacility) {
    const existingHealthFacility = await prisma.healthFacilityInfo.findFirst({
      where: { email: existingToken.email },
    });

    if (!existingHealthFacility) {
      return { error: "User does not exist!" };
    }

    await prisma.healthFacility.update({
      where: { id: existingHealthFacility.healthFacilityId },
      data: {
        emailVerified: true,
      },
    });

    await prisma.healthFacilityInfo.update({
      where: { id: existingHealthFacility.id },
      data: {
        email: existingToken.email,
      },
    });
  }

  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified!" };
};
