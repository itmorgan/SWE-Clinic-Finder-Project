"use server";
import { v4 as uuidv4 } from "uuid";
import {
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
} from "./verificationtokens";
import prisma from "../prisma";
import { getUserAccountById, getUserAccountDetails } from "./account";
import { Role } from "@prisma/client";

export const generateVerificationToken = async (email: string, role: Role) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // 1 hours

  const existingToken = await getVerificationTokenByEmail(email, role);

  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      token: token,
      email: email,
      role: role,
      expires: expires,
    },
  });

  return verificationToken;
};
