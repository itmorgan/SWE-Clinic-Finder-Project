"use server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    return verificationToken;
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (
  email: string,
  role: Role,
) => {
  try {
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        email,
        role,
      },
    });

    return verificationToken;
  } catch {
    return null;
  }
};
