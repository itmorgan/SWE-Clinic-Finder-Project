"use server";

import bcrypt from "bcryptjs";
import { CreateLoginValues, Role, loginSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";

import { signIn } from "../../../auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/utils";
import {
  getHealthFacilityAccountByUsername,
  getUserAccountByUsername,
} from "@/lib/data/account";
import { generateVerificationToken } from "@/lib/data/tokens";

export async function login(formData: CreateLoginValues, callbackUrl?: string) {
  const values = loginSchema.parse(formData);

  const { username, password, role } = loginSchema.parse(values);

  const hashedPassword = await bcrypt.hash(password, 10);

  if (role === Role.User) {
    const user = await getUserAccountByUsername(username);

    if (!user) {
      return { error: "Invalid username or password" };
    }

    const checkedPassword = await bcrypt.compare(password, user.password);

    if (!checkedPassword) {
      return { error: "Invalid username or password" };
    }
  }
  if (role === Role.HealthFacility) {
    const heatlhFacility = await getHealthFacilityAccountByUsername(username);

    if (!heatlhFacility) {
      return { error: "Invalid username or password" };
    }

    const checkedPassword = await bcrypt.compare(
      password,
      heatlhFacility.password,
    );

    if (!checkedPassword) {
      return { error: "Invalid username or password" };
    }
  }

  try {
    await signIn("credentials", {
      username,
      password,
      role,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid username or password" };
        case "AccessDenied":
          return { error: "Not verified" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
}
