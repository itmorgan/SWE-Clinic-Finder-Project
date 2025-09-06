import ClinicFilterSidebar from "@/app/(user)/search/clinic/ClinicFilterSidebar";
import ClinicResults from "@/app/(user)/search/clinic/ClinicResults";
import H1 from "@/components/ui/h1";
import { ClinicFilterValues } from "@/lib/validation";
import { Label } from "@/components/ui/label";
import SymptomsAlert from "@/components/SymptomsAlert";
import { Metadata } from "next";
import GetUserLocation from "./GetUserLocation";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import GetHomeLocation from "./GetHomeLocation";
import { getUserAccountDetails } from "@/lib/data/account";
import { userInfo } from "os";

interface PageProps {
  searchParams: {
    q?: string;
    programType?: string;
    symptoms?: string;
    address?: string;
    gender?: string;
    yob?: string; //year of birth
    message?: string;
    lat?: string;
    lng?: string;
    page?: string;
  };
}

export const revalidate = 300; // 5 minutes

export function generateMetadata({
  searchParams: { q, programType, symptoms, address, page },
}: PageProps): Metadata {
  return {
    title: `${getTitle({ q, programType, symptoms, address })}`,
    description: `Find the clinic that is near you`,
  };
}

function getTitle({
  q,
  programType,
  symptoms,
  address,
}: PageProps["searchParams"]) {
  const titlePrefix = q
    ? `${q}`
    : programType
      ? `${programType}`
      : "Search Clinic";

  const titleSuffix = address ? ` at ${address}` : "";

  return `${titlePrefix}${titleSuffix}`;
}

export default async function Page({
  searchParams: {
    q,
    programType,
    symptoms,
    gender,
    yob,
    message,
    address,
    page,
    lat,
    lng,
  },
}: PageProps) {
  const session = await auth();

  const isUser = session && session.user.role === "User";

  const userId = isUser ? session.user.id : null;

  const filterValues: ClinicFilterValues = {
    q,
    programType,
    symptoms: symptoms ? symptoms.split(",") : undefined,
    address,
    gender,
    yob,
    message,
    lat,
    lng,
  };

  return (
    <main className="m-auto my-10 max-w-7xl space-y-10 px-3">
      <div className="space-y-5 text-center">
        {/* <H1 className="flex items-center justify-center gap-4 ">
          Clinics <GetUserLocation />
        </H1>
        <p className="text-lg text-muted-foreground">
          Find the clinic that is near you
        </p> */}

        <H1 className="flex items-center justify-center gap-4 ">Clinics</H1>
        <div className="flex flex-row justify-center gap-10">
          {isUser && (
            <div className="flex flex-col justify-center gap-2">
              <H1>
                <GetHomeLocation userId={session.user.id} />
              </H1>
              <p>Find clinics near your home</p>
            </div>
          )}
          <div className="flex flex-col justify-center gap-2">
            <H1>
              <GetUserLocation />
            </H1>
            <p>Find clinics where you are</p>
          </div>
        </div>
        <SymptomsAlert
          symptoms={filterValues.symptoms}
          gender={filterValues.gender}
          yob={filterValues.yob}
          message={filterValues.message}
        />
      </div>
      <section className="flex flex-col gap-4 md:flex-row">
        <ClinicFilterSidebar defaultValues={filterValues} userId={userId} />
        <ClinicResults
          filterValues={filterValues}
          page={page ? parseInt(page) : undefined}
        />
      </section>
    </main>
  );
}
