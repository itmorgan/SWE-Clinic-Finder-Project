"use client";

import H1 from "@/components/ui/h1";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error() {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 3000);
    return () => clearTimeout(timer);
  });

  return (
    <main className="m-auto my-10 max-w-7xl space-y-5 px-3 text-center">
      <H1>Error</H1>
      <p className="text-muted-foreground"> An unexpected error occured</p>
    </main>
  );
}
