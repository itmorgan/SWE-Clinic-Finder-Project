"use server";

import {
  createHealthFacilityAccountSchema,
  createUserAccountSchema,
} from "@/lib/validation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { CreateHealthFacilityAccountValues } from "@/lib/validation";

import { redirect } from "next/navigation";

import { Relationship, Salutation, Gender, Role } from "@prisma/client";
import {
  getHealthFacilityAccountById,
  getHealthFacilityAccountByUsername,
  getUserAccountByUsername,
} from "@/lib/data/account";

import { generateVerificationToken } from "@/lib/data/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function createHealthFacAccount(
  formData: CreateHealthFacilityAccountValues,
  role: Role,
  id: string | undefined,
) {
  const values = createHealthFacilityAccountSchema.safeParse(formData);

  if (!values.success) {
    return { error: "Invalid account creation" };
  }

  const { password, ...userValues } = values.data;

  const hashedPassword = await bcrypt.hash(password, 10);

  //We need to check that the clinic account is not created twice
  if (id) {
    const existingHealthFacility = await getHealthFacilityAccountById(id);
    if (existingHealthFacility) {
      return { error: "Clinic account already exists" };
    }
  }

  //We need to check that username is not taken
  if (values.data.username) {
    const exisitngUser = await getHealthFacilityAccountByUsername(
      values.data.username,
    );
    if (exisitngUser) {
      return { error: "Username already taken" };
    }
  }

  const existingEmail = await prisma.healthFacilityInfo.findFirst({
    where: {
      email: values.data.facilityEmail,
    },
  });

  if (existingEmail) {
    return { error: "Email already taken" };
  }

  await prisma.healthFacility
    .create({
      data: {
        id: id,
        username: values.data.username,
        password: hashedPassword,
      },
    })
    .then(async (healthFacility) => {
      await prisma.healthFacilityInfo.create({
        data: {
          healthFacilityId: healthFacility.id,
          name: values.data.facilityName,
          email: values.data.facilityEmail,
          phoneNumber: values.data.facilityPhoneNumber,
          streetName: values.data.facilityStreetName,
          postalCode: values.data.facilityPostalCode,
          website: values.data.facilityWebsite,
          blockNumber: values.data.facilityBlockNumber,
          buildingName: values.data.facilityBuildingName,
          floorNumber: values.data.facilityFloorNumber,
          unitNumber: values.data.facilityUnitNumber,
          role: role,
        },
      });

      if (values.data.facilityDoctors) {
        await Promise.all(
          values.data.facilityDoctors.map(async (doctor) => {
            await prisma.doctor.create({
              data: {
                healthFacilityId: healthFacility.id,
                firstname: doctor.doctorFirstName,
                lastname: doctor.doctorLastName,
                phoneNumber: doctor.doctorPhoneNumber,
                address: doctor.doctorAddress,
                salutation: doctor.doctorSalutation as Salutation,
                gender: doctor.doctorGender as Gender,
              },
            });
          }),
        );
      }
    });

  const verificationToken = await generateVerificationToken(
    values.data.facilityEmail,
    Role.HealthFacility,
  );

  await sendVerificationEmail(
    values.data.facilityEmail,
    verificationToken.token,
  );

  redirect("/register-submitted");
}
