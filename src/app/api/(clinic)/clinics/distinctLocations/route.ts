import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, context: any) {
  const healthFacId = await prisma.healthFacility.findMany({
    select: {
      id: true,
    },
  });

  const distinctLocations = (await prisma.clinic
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
    )) as string[];
  return NextResponse.json(distinctLocations);
}
