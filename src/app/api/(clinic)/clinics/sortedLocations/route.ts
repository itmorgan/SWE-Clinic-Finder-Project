import { NextResponse, type NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const GET = async (request: NextRequest) => {
  const {
    q,
    programType,
    symptoms,
    address,
    userLatitude,
    userLongitude,
    take,
    skip,
  } = Object.fromEntries(request.nextUrl.searchParams.entries());

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

  // Parse latitude and longitude to floats
  const userLatitudeFloat = parseFloat(userLatitude as string);
  const userLongitudeFloat = parseFloat(userLongitude as string);

  // Fetch all clinics from the database
  const allClinics = await prisma.clinic.findMany({ where });

  // Calculate distance for each clinic
  const clinicsWithDistance = allClinics.map((clinic) => {
    const distance = calculateDistance(
      clinic.lat,
      clinic.lng,
      userLatitudeFloat,
      userLongitudeFloat,
    );
    return { ...clinic, distance };
  });

  // Sort clinics by distance
  clinicsWithDistance.sort((a, b) => a.distance - b.distance);

  // Apply pagination
  const paginatedClinics = clinicsWithDistance.slice(
    skip ? parseInt(skip as string) : undefined,
    take ? parseInt(take as string) : undefined,
  );

  const totalResults = clinicsWithDistance.length;

  return NextResponse.json({ clinics: paginatedClinics, totalResults });
};

// Function to calculate distance using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance;
};
