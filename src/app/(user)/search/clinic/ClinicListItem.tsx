import Badge from "@/components/Badge";
import { Clinic } from "@prisma/client";
import Link from "next/link";
import { Bird, MapPin, Phone, ClipboardX, Globe, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClinicListItemProps {
  crowdness: string;
  clinic: Clinic;
}

// Use best time here

function translateCrowd(crowdness: string) {
  switch (crowdness) {
    case "g":
      return "Not crowded";
    case "y":
      return "Moderate crowd";
    case "r":
      return "Crowded";
    default:
      return "No data";
  }
}

export default function ClinicListItem({
  clinic,
  crowdness,
}: ClinicListItemProps) {
  //const uriComp = clinic.name.replace(/\s/g, "+");
  const uriComp =
    clinic.name.replace(/\s/g, "+") + clinic.address.replace(/\s/g, "+");
  const googleMapLink = `https://www.google.com/maps?q=${uriComp}`;

  return (
    <article className="flex gap-3 rounded-lg border p-5 ">
      <Bird className="shrink-0 self-center rounded-lg" size={100} />
      <div className="flex-grow space-y-3">
        <div>
          <h2 className="text-xl font-medium">{clinic.name}</h2>
          <p className="text-muted-foreground">{clinic.hci_code}</p>
        </div>

        <div className="text-muted-foreground">
          <p className="flex items-center gap-1.5 md:hidden">
            <Globe size={16} className="shrink-0" />

            {translateCrowd(crowdness)}
          </p>
          <p className="flex items-center gap-1.5 ">
            <MapPin size={16} className="shrink-0" />
            {clinic.address}
          </p>
          <p className="flex items-center gap-1.5 ">
            <Phone size={16} className="shrink-0" />
            {clinic.phone_number || "No phone number available"}
          </p>
          <p className="flex items-center gap-1.5 ">
            <ClipboardX size={16} className="shrink-0" />
            {clinic.clinic_prog_code
              ? JSON.parse(clinic.clinic_prog_code.toString())
              : "No clinic program code available"}
          </p>

          <p className="z-100 flex items-center gap-1.5">
            <Monitor size={16} className="shrink-0" />

            <Link
              href={googleMapLink}
              target="_blank"
              className="hover:underline"
            >
              Google map link (Click me)
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden shrink-0 flex-col items-end justify-between md:flex">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Badge>{translateCrowd(crowdness)}</Badge>
        </span>
      </div>
    </article>
  );
}
