import Image from "next/image";
import { Button } from "../components/ui/button";
import Link from "next/link";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import H1 from "@/components/ui/h1";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Separator } from "@/components/ui/separator";

import card1 from "@/assets/card1.png";
import card2 from "@/assets/card2.png";
import card3 from "@/assets/card3.png";
import { auth } from "../auth";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import coverLanding from "@/assets/cover.png";

export default async function Home() {
  const session = await auth();

  const url = new URL("/search/clinic", process.env.NEXT_PUBLIC_APP_URL);

  return (
    <main className="m-auto my-10 max-w-7xl space-y-10 px-3">
      <MacbookScroll
        title={
          <div className="space-y-5 text-center">
            <H1>Welcome to DrWhere</H1>
            <p className="text-muted-foreground">
              Discover the perfect clinic, tailored to your needs. Simple
              search. Customized matches. Your healthcare, simplified.
            </p>
          </div>
        }
        src={coverLanding.src}
      />

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl">
            Difficulty in Managing?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            Accept and reject appointments with just a click!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl">
            Last Minute Changes?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            Edit appointment details easily!
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl">
            Is it Accessible?
          </AccordionTrigger>
          <AccordionContent className="text-base">
            Information of all your patients at your fingertips!
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </main>
  );
}
