"use client";

import { FormSuccess } from "@/components/FormSuccess";
import H1 from "@/components/ui/h1";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  // Redirect to home page after 5 seconds

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="m-auto my-10 max-w-7xl items-center space-y-5 px-3 text-center">
      <H1>Account Registered</H1>

      <p className="text-muted-foreground">
        Thank you for registering an account with DrWhere
      </p>

      <p className="rounded-mdtext-sm text-emerald-500">
        Check your email for verification
      </p>
    </main>
  );
}
