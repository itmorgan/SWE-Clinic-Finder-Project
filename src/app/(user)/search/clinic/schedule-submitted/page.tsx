"use client";

import H1 from "@/components/ui/h1";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  // Redirect to home page after 5 seconds

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="m-auto my-10 max-w-7xl space-y-5 px-3 text-center">
      <H1>Appointment scheduled</H1>
      <p className="text-muted-foreground">Hope you get well soon!</p>
    </main>
  );
}
