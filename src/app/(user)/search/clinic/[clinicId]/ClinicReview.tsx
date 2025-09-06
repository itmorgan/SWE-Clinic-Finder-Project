"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Review } from "@/lib/data/googleplaces";
import { Clinic } from "@prisma/client";
import { Globe2, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";

interface ClinicPageProps {
  clinic: Clinic;
  reviews: Review[];
}

export default function ClinicReview({
  clinic: { name, address, phone_number, license_type },
  reviews,
}: ClinicPageProps) {
  return (
    <section className="w-full grow">
      <Carousel
        opts={{
          align: "start",
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
        className=" w-full"
      >
        <CarouselContent>
          {reviews.map((review) => (
            <CarouselItem
              key={review.author_name}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-row gap-2">
                    <Image
                      src={review.profile_photo_url}
                      alt="profile"
                      width={50}
                      height={50}
                    />
                    <div className="flex flex-col gap-3">
                      <p className="flex items-center gap-2">
                        <Link
                          href={review.author_url}
                          target="_blank"
                          className="flex flex-row hover:underline"
                        >
                          {review.author_name}
                        </Link>
                      </p>
                      <CardDescription className="flex flex-row items-center ">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            fill={
                              index + 1 <= review.rating ? "#f7d154" : "#ffffff"
                            }
                            size={16}
                            className="shrink-0"
                          />
                        ))}
                      </CardDescription>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{review.text}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
