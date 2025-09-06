"use client";

import H1 from "@/components/ui/h1";
import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <main className="m-auto my-10 max-w-7xl space-y-5 px-3 text-center">
      <H1>Loading...</H1>
      <div className="flex items-center justify-center gap-1">
        <p className="text-muted-foreground">Please wait</p>
        <Loader size={16} className="animate-spin" />
      </div>
    </main>
  );
}
