import ClinicListItem from "@/app/(user)/search/clinic/ClinicListItem";
import { Clinic } from "@prisma/client";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ClinicFilterValues } from "@/lib/validation";
import { getAllClinics } from "@/lib/data/clinics";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getForecast } from "@/lib/data/foottraffic";

interface ClinicResultsProps {
  filterValues: ClinicFilterValues;
  page?: number;
}

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

export default async function ClinicResults({
  filterValues,
  page = 1,
}: ClinicResultsProps) {
  const { q, programType, symptoms, address, lat, lng } = filterValues;

  const clinicPerPage = 5;
  const skip = (page - 1) * clinicPerPage;

  const searchString = q
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
      address ? { address } : {},
      programType
        ? {
            clinic_prog_code: {
              string_contains: programType,
            },
          }
        : {},
    ],
  };

  const clinicsPromise = prisma.clinic.findMany({
    where,
    // orderBy: { name: "asc" },
    // take: clinicPerPage,
    // skip,
  });

  const countPromise = prisma.clinic.count({ where });

  const [allClinics, totalResults] = await Promise.all([
    clinicsPromise,
    countPromise,
  ]);

  // Calculate distance for each clinic
  const clinicsWithDistance = allClinics.map((clinic) => {
    const distance = calculateDistance(
      clinic.lat,
      clinic.lng,
      lat ? parseFloat(lat) : 1.3521,
      lng ? parseFloat(lng) : 103.8198,
    );
    return { ...clinic, distance };
  });

  // Sort clinics by distance
  clinicsWithDistance.sort((a, b) => a.distance - b.distance);

  // Apply pagination
  const paginatedClinics = clinicsWithDistance.slice(
    skip,
    skip + clinicPerPage,
  );

  const crowdnessPromises = paginatedClinics.map(async (clinic) => {
    const data = await getForecast(
      clinic.name,
      clinic.address,
      clinic.lat.toString(),
      clinic.lng.toString(),
    );

    return data;
  });

  const crowdness = await Promise.all(crowdnessPromises);

  return (
    <div className="grow space-y-4">
      {paginatedClinics.map((clinic, index) => (
        <Card key={clinic.id} className="block">
          <ClinicListItem clinic={clinic} crowdness={crowdness[index]} />
          <Button
            className="w-full hover:bg-muted/60"
            variant="secondary"
            asChild
          >
            <Link href={`/search/clinic/${clinic.id}`}>View Clinic</Link>
          </Button>
        </Card>
      ))}
      {clinicsWithDistance.length === 0 && (
        <p className="m-auto text-center">
          No clinics found. Try changing your search criteria.
        </p>
      )}
      {clinicsWithDistance.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalResults / clinicPerPage)}
          filterValues={filterValues}
        />
      )}
    </div>
  );
}

/* Pagination Component */

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  filterValues: ClinicFilterValues;
}
function Pagination({
  currentPage,
  totalPages,
  filterValues: { q, programType, symptoms, address, lat, lng },
}: PaginationProps) {
  function generatePageLink(page: number) {
    const searchParams: URLSearchParams = new URLSearchParams({
      ...(q && { q }),
      ...(programType && { programType }),
      ...(address && { address }),
      ...(symptoms && { symptoms: symptoms.join(",") }),
      ...(lat && { lat }),
      ...(lng && { lng }),
      page: page.toString(),
    });

    return `/search/clinic/?${searchParams.toString()}`;
  }

  return (
    <div className="flex justify-between">
      <Link
        href={generatePageLink(currentPage - 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage <= 1 && "invisible",
        )}
      >
        <ArrowLeft size={16} />
        Previous page
      </Link>
      <span className="font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={generatePageLink(currentPage + 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage >= totalPages && "invisible",
        )}
      >
        Next page
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
