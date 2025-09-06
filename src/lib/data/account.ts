"use server";
import prisma from "@/lib/prisma";

export const getUserAccountById = async (id: string) => {
  try {
    return await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    return null;
  }
};

export const getUserAccountByUsername = async (username: string) => {
  try {
    return await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
  } catch (error) {
    return null;
  }
};

export const getUserAccountDetails = async (id: string) => {
  try {
    const userInfo = await prisma.userInfo.findUnique({
      where: {
        userId: id,
      },
    });

    return userInfo;
  } catch (error) {
    return null;
  }
};

export const getHealthFacilityAccountById = async (id: string) => {
  try {
    return await prisma.healthFacility.findUnique({
      where: {
        id: id,
      },
    });
  } catch (error) {
    return null;
  }
};

export const getHealthFacilityAccountByUsername = async (username: string) => {
  try {
    return await prisma.healthFacility.findUnique({
      where: {
        username: username,
      },
    });
  } catch (error) {
    return null;
  }
};

export const getHealthFacilityAccountDetails = async (id: string) => {
  try {
    return await prisma.healthFacilityInfo.findUnique({
      where: {
        healthFacilityId: id,
      },
    });
  } catch (error) {
    return null;
  }
};
