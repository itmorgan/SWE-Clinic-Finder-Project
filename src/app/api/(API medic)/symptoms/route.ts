import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import medicAuthToken from "@/lib/data/apimedic";

export async function GET(request: Request, context: any) {
  const authInfo = await medicAuthToken();

  const response = async () => {
    try {
      const symptoms = await fetch(
        "https://sandbox-healthservice.priaid.ch/symptoms?token=" +
          authInfo.Token +
          "&language=en-gb&format=json",
        {
          method: "GET",
        },
      );

      return symptoms.json();
    } catch (error) {
      return NextResponse.json({
        Symptoms: "undefined",
      });
    }
  };

  const symptoms = await response();

  return NextResponse.json({
    Symptoms: symptoms,
  });
}
