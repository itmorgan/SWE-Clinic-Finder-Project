import { cache } from "react";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ClinicPage from "./ClinicPage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ClinicReview from "./ClinicReview";
import {
  getGooglePlaceId,
  getGooglePlaceImage,
  getGooglePlaceReviews,
  getGooglePlaceWebsite,
} from "@/lib/data/googleplaces";
import Image from "next/image";
import { auth } from "../../../../../auth";

interface PageProps {
  params: { clinicId: string };
}

const getClinic = cache(async (clinicId: string) => {
  const clinic = await prisma.clinic.findUnique({
    where: {
      id: clinicId,
    },
  });

  if (!clinic) {
    notFound();
  }

  return clinic;
});

async function isClinicRegistered(clinicId: string): Promise<boolean> {
  const clinic = await prisma.healthFacility.findUnique({
    where: {
      id: clinicId,
    },
  });

  if (!clinic) {
    return false;
  }

  return true;
}

// Static cache for the healthFacility
// export async function generateStaticParams() {
//   const clinics = await prisma.clinic.findMany({
//     select: {
//       id: true,
//     },
//   });

//   return clinics.map(({ id }) => ({
//     params: { clinicId: id },
//   }));
// }

export async function generateMetadata({
  params: { clinicId },
}: PageProps): Promise<Metadata> {
  const clinic = await prisma.clinic.findUnique({
    where: {
      id: clinicId,
    },
  });
  return {
    title: clinic?.name,
    description: clinic?.name + " Information",
  };
}

export default async function Page({ params: { clinicId } }: PageProps) {
  const session = await auth();

  let isUser = true;

  if (!session || session.user.role !== "User") {
    isUser = false;
  }

  const clinic = await getClinic(clinicId);

  const isRegistered = await isClinicRegistered(clinicId);

  const googlePlaceId = await getGooglePlaceId(
    clinic.name + " " + clinic.address,
  );

  if (googlePlaceId.status === "OK") {
    const googlePlaceImagePromise = await getGooglePlaceImage(
      googlePlaceId.result.photo_reference,
    );

    const googlePlaceReviewsPromise = await getGooglePlaceReviews(
      googlePlaceId.result.place_id,
    );

    const googlePlaceWebsitePromise = await getGooglePlaceWebsite(
      googlePlaceId.result.place_id,
    );

    const [googlePlaceImage, googlePlaceReviews, googlePlaceWebsite] =
      await Promise.all([
        googlePlaceImagePromise,
        googlePlaceReviewsPromise,
        googlePlaceWebsitePromise,
      ]);

    if (
      googlePlaceImage.status === "OK" &&
      googlePlaceReviews.status === "OK" &&
      googlePlaceWebsite.status === "OK"
    ) {
      // Success section

      return (
        <main className="m-auto my-10 flex max-w-7xl flex-col items-center gap-5 space-y-10 px-3 md:items-start">
          <div className="relative h-[240px] w-full drop-shadow-md md:h-[480px]">
            <Image
              src={googlePlaceImage.result.image}
              alt="Clinic Image"
              fill
              sizes="(max-width: 640px) 100vw,  100vw"
              className="w-full shrink-0 rounded-lg"
            />
          </div>
          <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start">
            <ClinicPage
              website={googlePlaceWebsite.result.website}
              clinic={clinic}
              rating={googlePlaceId.result.rating.toString()}
            />
            {isUser && isRegistered && (
              <aside className="w-full md:w-fit" hidden={!isRegistered}>
                <Button asChild>
                  <Link
                    href={`/search/clinic/schedule/${clinicId}`}
                    className="w-full"
                  >
                    Schedule an appointment
                  </Link>
                </Button>
              </aside>
            )}
          </div>

          <ClinicReview
            reviews={googlePlaceReviews.result.reviews}
            clinic={clinic}
          />
        </main>
      );
    }
  }

  return (
    <main className="m-auto my-10 flex max-w-7xl flex-col items-center gap-5 space-y-10 px-3 md:items-start">
      <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start">
        <ClinicPage website={""} clinic={clinic} rating="Not found" />
        <aside className="w-full md:w-fit" hidden={!isRegistered}>
          <Button>
            <Link
              href={`/search/clinic/schedule/${clinicId}`}
              className="w-full"
            >
              Schedule an appointment
            </Link>
          </Button>
        </aside>
      </div>
    </main>
  );
}
