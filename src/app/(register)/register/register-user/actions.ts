"use server";

import { createUserAccountSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { CreateUserAccountValues } from "@/lib/validation";

import { Relationship, Salutation, Gender, Role } from "@prisma/client";
import { getUserAccountByUsername } from "@/lib/data/account";
import { generateVerificationToken } from "@/lib/data/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { redirect } from "next/navigation";

export async function createUserAccount(
  formData: CreateUserAccountValues,
  role: Role,
) {
  const values = createUserAccountSchema.safeParse(formData);

  if (!values.success) {
    return { error: "Invalid account creation" };
  }
  const { username, password, confirmPassword, ...userValues } = values.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  //We need to check that username is not taken
  const exisitngUser = await getUserAccountByUsername(username);

  if (exisitngUser) {
    return { error: "Username already taken" };
  }

  const existingEmail = await prisma.userInfo.findFirst({
    where: {
      email: userValues.email,
    },
  });

  if (existingEmail) {
    return { error: "Email already taken" };
  }

  let userid = "";
  await prisma.user
    .create({
      data: {
        username: username,
        password: hashedPassword,
      },
    })
    .then(async (user) => {
      // Wrap the arrow function with async
      await prisma.userInfo.create({
        data: {
          userId: user.id,
          dateOfBirth: userValues.dateOfBirth,
          firstname: userValues.firstName,
          lastname: userValues.lastName,
          salutation: userValues.salutation as Salutation,
          existingConditions: JSON.stringify(
            userValues.existingMedicalCondition,
          ),
          gender: userValues.gender as Gender,
          email: userValues.email,
          phoneNumber: userValues.phoneNumber,
          role: role,
          postalCode: userValues.postalCode,
          address: userValues.address,
        },
      });

      await prisma.userEmergencyContact.create({
        data: {
          userId: user.id,
          firstname: userValues.ecFirstName,
          lastname: userValues.ecLastName,
          salutation: userValues.ecSalutation as Salutation,
          gender: userValues.ecGender as Gender,
          relationship: userValues.ecRelationship as Relationship,
          phoneNumber: userValues.ecPhoneNumber,
          postalCode: userValues.ecPostalCode,
          address: userValues.ecAddress,
        },
      });
    });

  const verificationToken = await generateVerificationToken(
    values.data.email,
    Role.User,
  );

  await sendVerificationEmail(values.data.email, verificationToken.token);

  redirect("/register-submitted");
}
