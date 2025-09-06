import { Clinic } from "@prisma/client";
import Image from "next/image";
import hospital from "@/assets/hospital.jpg";
import Link from "next/link";
import {
  Clock,
  Globe,
  ClipboardX,
  Monitor,
  MapPin,
  Phone,
  Globe2,
  Star,
} from "lucide-react";

interface ClinicPageProps {
  clinic: Clinic;
  website: string;
  rating: string;
}

//TODO: IF THE CLINIC IS NOT REGISTERED THEN THEY CANT SCHEDULE FOR APPOINTMNT IS DISABLED

export default function ClinicPage({
  clinic: {
    name,
    address,
    phone_number,
    license_type,
    clinic_prog_code,
    hci_code,
  },
  website,
  rating,
}: ClinicPageProps) {
  const uriComp = name.replace(/\s/g, "+") + address.replace(/\s/g, "+");
  const googleMapLink = `https://www.google.com/maps?q=${uriComp}`;
  return (
    <section className="w-full grow space-y-5">
      <div className="flex flex-col items-start gap-3">
        <div>
          <div>
            <h1 className="text-xl font-bold">{name}</h1>
            <p className="font-semibold">HCI: {hci_code}</p>
          </div>
          <div className="text-muted-foreground">
            <p className="flex items-center gap-1.5">
              <Clock size={16} className="shrink-0" />
              0900 - 2100
            </p>

            <p className="flex items-center gap-1.5">
              <Star size={16} className="shrink-0" />
              {rating}
            </p>

            <p className="flex items-center gap-1.5 text-muted-foreground">
              <Globe2 size={16} className="shrink-0" />
              {website ? (
                <Link
                  href={new URL(website).origin}
                  target="_blank"
                  className="text-muted-foreground hover:underline"
                >
                  {website}
                </Link>
              ) : (
                <>No website available</>
              )}
            </p>

            <p className="flex items-center gap-1.5">
              <Phone size={16} className="shrink-0" />
              {phone_number || "No phone number available"}
            </p>
            <p className="flex items-center gap-1.5">
              <Monitor size={16} className="shrink-0" />

              {clinic_prog_code
                ? JSON.parse(clinic_prog_code.toString())
                : "No clinic program code available"}
            </p>
            <p className="flex items-center gap-1.5">
              <MapPin size={16} className="shrink-0" />
              <Link
                href={googleMapLink}
                target="_blank"
                className="hover:underline"
              >
                {address}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod
        justo ac massa efficitur tempor. Mauris vitae velit sit amet nisi dictum
        fermentum. Nulla facilisi. Vestibulum ante ipsum primis in faucibus orci
        luctus et ultrices posuere cubilia Curae; Cras aliquet ante id interdum
        dictum. Nullam quis risus justo. In hac habitasse platea dictumst.
      </div>
    </section>
  );
}
