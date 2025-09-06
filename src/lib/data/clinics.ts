"use server";
import prisma from "@/lib/prisma";

export const getAllClinics = async () => {
  // try {
  return await prisma.clinic.findMany({
    orderBy: { name: "asc" },
    // select: {
    //   id: true,
    //   lat: true,
    //   lng: true,
    //   name: true,
    //   phone_number: true,
    //   postal_code: true,
    //   block_no: true,
    //   floor_no: true,
    //   unit_no: true,
    //   street_name: true,
    //   building_name: true,
    //   address: true,
    // },
  });
  // } catch (error) {}
};
