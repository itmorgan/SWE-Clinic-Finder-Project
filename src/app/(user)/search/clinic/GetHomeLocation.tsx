"use client";
import { Button } from "@/components/ui/button";
import { getUserAccountDetails } from "@/lib/data/account";
import { getLocationCord } from "@/lib/data/googleplaces";
import { Home } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { generateNewPageLinkWithGeo } from "./actions";

async function getLocation(address: string): Promise<{
  lat: number;
  lng: number;
}> {
  return new Promise(async (resolve, reject) => {
    const promise = await getLocationCord(address)
      .then((res) => {
        if (res.status === "OK") {
          resolve(res.result);
        } else {
          reject(res.status);
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

interface GetLocationPageProps {
  userId: string;
}

export default function GetHomeLocation({ userId }: GetLocationPageProps) {
  const params = useSearchParams();

  const q = params.get("q");
  const programType = params.get("programType");
  const symptoms = params.get("symptoms");
  const address = params.get("address");
  const gender = params.get("gender");
  const yob = params.get("yob");

  async function onClick() {
    try {
      const userAddress = await getUserAccountDetails(userId).then((result) => {
        return result.address;
      });
      getLocation(userAddress).then(async ({ lat, lng }) => {
        generateNewPageLinkWithGeo(
          q ? q : "",
          programType ? programType : "",
          symptoms ? symptoms : "",
          address ? address : "",
          gender ? gender : "",
          yob ? yob : "",
          lat.toString(),
          lng.toString(),
        );
      });
    } catch (e) {}
  }

  return (
    <Button onClick={onClick}>
      <Home />
    </Button>
  );
}
