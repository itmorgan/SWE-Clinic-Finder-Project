"use server";
import prisma from "../prisma";

export async function getAllHealthFacilityId() {
  return await prisma.healthFacility.findMany({
    select: {
      id: true,
    },
  });
}

export async function getClinicDistinctLocations() {
  const healthFacId = await prisma.healthFacility.findMany({
    select: {
      id: true,
    },
  });

  return await prisma.clinic
    .findMany({
      where: {
        id: {
          in: healthFacId.map((id) => id.id), // THIS RIGHT HERE IS TO FILTER ONLY THOSE HEALTH FAC THAT IS REGISTERED WITH US
        },
      },
      orderBy: {
        address: "asc",
      },
      select: { address: true },
      distinct: ["address"],
    })
    .then((locations) =>
      locations.map((location) => location.address).filter(Boolean),
    );
}
