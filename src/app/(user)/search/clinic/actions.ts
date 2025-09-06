"use server";

import { redirect } from "next/navigation";

export async function generateNewPageLinkWithGeo(
  q: string | undefined,
  programType: string | undefined,
  symptoms: string | undefined,
  address: string | undefined,
  gender: string | undefined,
  yob: string | undefined,
  lat: string,
  lng: string,
) {
  const searchParams: URLSearchParams = new URLSearchParams({
    q: q?.toString() ?? "",
    programType: programType?.toString() ?? "",
    symptoms: symptoms?.toString() ?? "",
    address: address?.toString() ?? "",
    lat: lat.toString(),
    lng: lng.toString(),
    gender: gender?.toString() ?? "",
    yob: yob?.toString() ?? "",
  });

  // console.log(`/search/clinic/?${searchParams.toString()}`);
  redirect(`/search/clinic/?${searchParams.toString()}`);
}
