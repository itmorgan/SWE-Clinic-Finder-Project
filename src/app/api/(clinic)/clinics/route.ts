import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
export async function GET(request: Request, context: any) {
  // const { searchParams } = new URL(request.url);

  const url = new URL(request.url);
  const hasParams = url.search.length > 0;

  if (!hasParams) {
    const clinicInfo = await prisma.clinic.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        lat: true,
        lng: true,
        name: true,
        phone_number: true,
        postal_code: true,
        block_no: true,
        floor_no: true,
        unit_no: true,
        street_name: true,
        building_name: true,
        address: true,
      },
    });

    return NextResponse.json({
      clinicInfo,
    });
  } else {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const programType = searchParams.get("programType");
    const symptoms = searchParams.get("symptoms");
    const address = searchParams.get("address");
    const skip = searchParams.get("skip");
    const take = searchParams.get("take");

    const searchString = (q as string)
      ?.split(" ")
      .filter((word) => word.length > 0)
      .join(" & ");

    const searchFilter: Prisma.ClinicWhereInput = searchString
      ? {
          OR: [
            { name: { search: searchString } },
            { address: { search: searchString } },
            { street_name: { search: searchString } },
            { building_name: { search: searchString } },
            { clinic_prog_code: { array_contains: searchString } },
          ],
        }
      : {};

    const where: Prisma.ClinicWhereInput = {
      AND: [
        searchFilter,
        address ? { address: address as string } : {},
        programType
          ? {
              clinic_prog_code: {
                string_contains: programType as string,
              },
            }
          : {},
      ],
    };

    const clinicsPromise = await prisma.clinic.findMany({
      where,
      orderBy: { name: "asc" },
      take: take ? parseInt(take as string) : undefined,
      skip: skip ? parseInt(skip as string) : undefined,
    });

    const countPromise = prisma.clinic.count({ where });

    const [clinics, totalResults] = await Promise.all([
      clinicsPromise,
      countPromise,
    ]);

    return NextResponse.json({ clinics, totalResults });
  }
}

// var id = searchParams.get("name");

//   const clinicInfo = id
//     ? await prisma.clinic.findUnique({ where: { id: parseInt(id) } })
//     : await prisma.clinic.findMany({
//         orderBy: { name: "asc" },
//       });

//Dynamic route
//   const items = Object.fromEntries(searchParams.entries());
