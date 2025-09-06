// Purpose of checking symptoms is so that
//-> we can conclude what kind of sickness the patient have
//-> then verify against red flag in api medic then we know
//if yes show ER screen if not show the waiting.

import prisma from "@/lib/prisma";
import medicAuthToken from "@/lib/data/apimedic";
import { cache } from "react";
import { Link } from "lucide-react";

interface SymptomsAlertProps {
  symptoms?: string[];
  gender?: string;
  yob?: string;
  message?: string;
}

interface Issue {
  ID: number;
  Name: string;
  Accuracy: number;
  Icd: string;
  IcdName: string;
  ProfName: string;
  Ranking: number;
}

interface Specialisation {
  // Since Specialisation is an array of objects, we can't define its specific structure here.
  // You might have a separate interface for the objects within Specialisation if needed.
  [key: string]: any; // This allows any properties within the objects
}

type DiagnosisData =
  | {
      Issue: Issue;
      Specialisation: Specialisation[];
    }[]
  | null;

async function getDiagnosis(
  symptoms?: string[],
  gender?: string,
  yob?: string,
  message?: string,
) {
  if (message && !symptoms && !gender && !yob) {
    return null;
  }

  try {
    const diagnosis = await medicAuthToken().then(async (data) => {
      //return data.Token

      const promises = [];

      const diagnosisParams = new URLSearchParams({
        token: data.Token,
        language: "en-gb",
        format: "json",
        gender: gender || "male",
        year_of_birth: yob || "2000",
      });

      // symptoms: ("[" + symptoms?.join(",") + "]") as string,

      const diagnosisPromise = fetch(
        `https://sandbox-healthservice.priaid.ch/diagnosis?symptoms=[${symptoms?.join(",")}]&` +
          diagnosisParams.toString(),
        {
          method: "GET",
        },
      );

      promises.push(diagnosisPromise);

      for (const symptom of symptoms ?? []) {
        const redflagParams = new URLSearchParams({
          token: data.Token,
          language: "en-gb",
          format: "json",
          symptomId: symptom,
        });

        const redflagPromise = fetch(
          "https://sandbox-healthservice.priaid.ch/redflag?" +
            redflagParams.toString(),
          {
            method: "GET",
          },
        );

        promises.push(redflagPromise);
      }

      const responses = await Promise.all(promises);

      const dataRes = await Promise.all(
        responses.map(async (response) => {
          // Add to dataJson
          const data = await response.json();
          return data[0];
        }),
      );

      return dataRes;
    });

    return diagnosis;
  } catch (error) {
    return null;
  }
}

async function getRedFlag(
  symptoms?: string[],
  gender?: string,
  yob?: string,
  message?: string,
) {
  if (message && !symptoms && !gender && !yob) {
    return null;
  }
  var isEmergency = false;

  try {
    await medicAuthToken().then(async (data) => {
      const promises = [];

      for (const symptom of symptoms ?? []) {
        const redflagParams = new URLSearchParams({
          token: data.Token,
          language: "en-gb",
          format: "json",
          symptomId: symptom,
        });

        const redflagPromise = fetch(
          "https://sandbox-healthservice.priaid.ch/redflag?" +
            redflagParams.toString(),
          {
            method: "GET",
          },
        );

        promises.push(
          redflagPromise.then(async (response) => {
            const responseData = await response.json();
            return responseData.includes(
              "You have selected a symptom which requires a prompt check with a medical doctor.",
            );
          }),
        );
      }

      // Wait for all emergency checks to complete and combine results
      const results = await Promise.all(promises);

      // Check if any emergency flag was found
      isEmergency = results.some((result) => result);
    });

    return isEmergency;
  } catch (error) {
    return null;
  }
}

export default async function SymptomsAlert({
  symptoms,
  gender,
  yob,
  message,
}: SymptomsAlertProps) {
  if (message && !symptoms && !gender && !yob) {
    return (
      <p className="my-4 w-full rounded-lg border bg-destructive p-3 text-lg text-white">
        {decodeURIComponent(message)}
      </p>
    );
  } else {
    const diagnosis: DiagnosisData = await getDiagnosis(
      symptoms,
      gender,
      yob,
      message,
    );
    const isEmergency = await getRedFlag(symptoms, gender, yob, message);

    if (isEmergency) {
      return (
        <p className="my-4 w-full rounded-lg border bg-destructive p-3 text-lg text-white">
          This is an emergency.{" "}
          <a href="tel:test" className="underline">
            {" "}
            Please call 911 now
          </a>
          .
        </p>
      );
    } else if (diagnosis == null || diagnosis[0] == undefined) {
      return (
        <p className="my-4 w-full rounded-lg border bg-muted p-3 text-lg">
          Diagnosis cannot be determined. Please visit a clinic.
        </p>
      );
    } else if (diagnosis && diagnosis[0] && diagnosis[0].Issue) {
      //@ts-ignore
      return (
        <p className="my-4 w-full rounded-lg border bg-muted p-3 text-lg">
          You probably have {diagnosis[0].Issue.Name}. Please visit a clinic.
        </p>
      );
    } else {
      return <></>;
    }
  }
}
