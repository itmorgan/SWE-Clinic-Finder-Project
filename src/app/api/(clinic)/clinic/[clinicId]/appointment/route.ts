import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function GET(request: Request, context: any) {
  return notFound();
}
