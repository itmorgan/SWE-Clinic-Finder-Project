import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, context: any) {
  const { searchParams } = new URL(request.url);

  var id = searchParams.get("name");

  const clinicInfo = id
    ? await prisma.clinic.findUnique({ where: { id: id } })
    : await prisma.clinic.findMany({
        take: 5,
        orderBy: { name: "asc" },
      });

  //Dynamic route
  const items = Object.fromEntries(searchParams.entries());

  return NextResponse.json({
    message: [
      {
        clinicInfo,
      },
    ],
  });
}
