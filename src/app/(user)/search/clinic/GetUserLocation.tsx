"use client";
import { ClinicFilterValues } from "@/lib/validation";
import { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Locate } from "lucide-react";
import { generateNewPageLinkWithGeo } from "./actions";

function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
}> {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          resolve({ latitude, longitude });
        },
        (error) => {
          reject(error);
        },
      );
    } else {
      reject(new Error("Geolocation is not available in this browser."));
    }
  });
}

interface GetLocationPageProps {
  currentValues: ClinicFilterValues;
}

export default function GetUserLocation() {
  // function generatePageLink(lat: string, lng: string) {
  //   const searchParams: URLSearchParams = new URLSearchParams({
  //     ...(q && { q }),
  //     ...(programType && { programType }),
  //     ...(address && { address }),
  //     ...(symptoms && { symptoms: symptoms.join(",") }),
  //     ...(page && { page }),
  //     lat: lat.toString(),
  //     lng: lng.toString(),
  //   });

  //   return `/search/clinic/?${searchParams.toString()}`;
  // }

  const params = useSearchParams();

  const q = params.get("q");
  const programType = params.get("programType");
  const symptoms = params.get("symptoms");
  const address = params.get("address");
  const gender = params.get("gender");
  const yob = params.get("yob");

  function onClick() {
    getCurrentLocation()
      .then(async ({ latitude, longitude }) => {
        generateNewPageLinkWithGeo(
          q ? q : "",
          programType ? programType : "",
          symptoms ? symptoms : "",
          address ? address : "",
          gender ? gender : "",
          yob ? yob : "",
          latitude.toString(),
          longitude.toString(),
        );
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <Button onClick={onClick}>
      <Locate />
    </Button>
  );
}
