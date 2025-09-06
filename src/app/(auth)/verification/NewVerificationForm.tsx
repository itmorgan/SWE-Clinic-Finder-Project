"use client";
import H1 from "@/components/ui/h1";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Loading from "@/app/loading";
import { Loader } from "lucide-react";
import { newVerification } from "./actions";
import { FormError } from "@/components/FormError";
import { set } from "date-fns";
import { FormSuccess } from "@/components/FormSuccess";

export default function NewVerificationForm() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const token = searchParams.get("token");

  const router = useRouter();

  const onSubmit = useCallback(() => {
    if (successMessage || errorMessage) return;
    if (!token) {
      setErrorMessage("Missing token");
      return;
    }
    newVerification(token)
      .then((data) => {
        if (data.error) {
          setErrorMessage(data.error);
          setSuccessMessage("");
        } else {
          setErrorMessage("");
          setSuccessMessage("Verification successful");
          router.push("/");
        }
      })
      .catch((error) => {
        setErrorMessage("Something went wrong");
      });
  }, [token, successMessage, errorMessage, router]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <main className="m-auto my-10 max-w-3xl space-y-10">
      <div className="space-y-5 text-center">
        <H1>Verfication</H1>
        {!errorMessage && (
          <div className="flex items-center justify-center gap-1">
            <p className="text-muted-foreground">
              Confirming your verification
            </p>
            <Loader size={20} className="animate-spin" />
          </div>
        )}

        <div className="flex items-center justify-center gap-1">
          <FormError message={errorMessage} />
          <FormSuccess message={successMessage} />
        </div>
      </div>
    </main>
  );
}
