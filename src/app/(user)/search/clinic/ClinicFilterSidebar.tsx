import { genderTypes, programmeCodeTypes } from "@/lib/feature-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Select from "@/components/ui/select-improve";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import symptomsList from "@/lib/symptoms-list";
import { ClinicFilterValues, clinicFilterSchema } from "@/lib/validation";
import { redirect } from "next/navigation";
import FormSubmitButton from "@/components/FormSubmitButton";

// This sidebar will only show those clinics that is registered in the system

async function filterClinics(formData: FormData) {
  "use server";

  const values = Object.fromEntries(formData.entries());

  // Remove all keys that has the word "symptoms"
  const clinicFilter = Object.fromEntries(
    Object.entries(values).filter(([key]) => !key.includes("symptoms")),
  );

  // Check if values any key has the word "symptoms" and put them as array as integer
  const symptoms = Object.keys(values)
    .filter((key) => key.includes("symptoms"))
    .map((key) => values[key]);

  // Combine the clinicFilter and symptoms
  const query = {
    ...clinicFilter,
    symptoms,
  };

  const parseResult = clinicFilterSchema.parse(query);

  // Check if symptoms is not empty then gender and yob should not be empty
  const hasSymptoms = symptoms.length > 0;
  const hasGender =
    parseResult.gender !== undefined && parseResult.gender.trim() !== "";
  const hasYob = parseResult.yob !== undefined && parseResult.yob.trim() !== "";

  if (
    (hasSymptoms || hasGender || hasYob) &&
    (!hasSymptoms || !hasGender || !hasYob)
  ) {
    // Write a message to the user to fill in all fields
    const message = encodeURIComponent(
      "Please fill in all fields for symptoms, gender, and year of birth",
    );

    // Keep first
    // const searchParams = new URLSearchParams(
    //   parseResult as Record<string, string>,
    // );

    redirect(`/search/clinic/?message=${message}`);
  }

  const searchParams = new URLSearchParams(
    parseResult as Record<string, string>,
  );

  redirect(`/search/clinic/?${searchParams.toString()}`);
}

interface ClinicFilterSidebarProps {
  defaultValues: ClinicFilterValues;
  userId: string;
}

export default async function ClinicFilterSidebar({
  defaultValues,
  userId,
}: ClinicFilterSidebarProps) {
  const currentYear = new Date().getFullYear();
  const yearOfBirth = Array.from({ length: 99 }, (_, i) => currentYear - i);

  const userInfo = userId
    ? await prisma.userInfo.findFirst({
        where: {
          userId: userId,
        },
      })
    : null;

  const healthFacId = await prisma.healthFacility.findMany({
    select: {
      id: true,
    },
  });

  const distinctLocations = (await prisma.clinic
    .findMany({
      where: {
        id: {
          in: healthFacId.map((id) => id.id), // THIS RIGHT HERE IS TO FILTER ONLY THOSE HEALTH FAC THAT IS REGISTERED WITH US
        },
      },
      orderBy: {
        address: "asc",
      },
      select: { address: true },
      distinct: ["address"],
    })
    .then((locations) =>
      locations.map((location) => location.address).filter(Boolean),
    )) as string[];

  return (
    <aside className="h-fit rounded-lg border bg-background p-4 md:w-[350px]">
      <form action={filterClinics} key={JSON.stringify(defaultValues)}>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="q">Search</Label>
            <Input
              id="q"
              name="q"
              placeholder="Name, address, etc."
              defaultValue={defaultValues.q}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="programType">Type</Label>
            <Select
              id="programType"
              name="programType"
              defaultValue={defaultValues.programType || ""}
            >
              <option value="">All Types</option>
              {programmeCodeTypes.map((programmeCodeType) => (
                <option key={programmeCodeType} value={programmeCodeType}>
                  {programmeCodeType}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="symptoms">Symptoms</Label>
            <ScrollArea className="h-[200px] w-full rounded-lg border p-4 ">
              {symptomsList.map((symptom, index) => (
                <div
                  key={index}
                  className="mb-3 flex flex-row items-start space-x-3 space-y-0"
                >
                  <input
                    id={symptom.ID.toString()}
                    name={"symptoms-" + symptom.Name.toString()}
                    key={symptom.ID.toString()}
                    value={symptom.ID.toString()}
                    className="scale-100 accent-black"
                    defaultChecked={
                      defaultValues.symptoms?.includes(symptom.ID.toString()) ||
                      false
                    }
                    type="checkbox"
                  />
                  <Label
                    htmlFor={symptom.ID.toString()}
                    className="font-normal"
                  >
                    {symptom.Name}
                  </Label>
                </div>
              ))}
            </ScrollArea>
          </div>

          {userInfo && (
            <div>
              <input
                name="gender"
                id="gender"
                value={userInfo.gender}
                hidden
              ></input>
              <input
                name="yob"
                id="yob"
                value={String(userInfo.dateOfBirth.getFullYear())}
                hidden
              ></input>
            </div>
          )}

          {!userInfo && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="gender">User&apos;s Gender</Label>
              <Select
                id="gender"
                name="gender"
                defaultValue={defaultValues.gender || ""}
              >
                <option value="">Select a gender</option>
                {genderTypes.map((gender) => (
                  <option
                    key={gender.toLowerCase()}
                    value={gender.toLowerCase()}
                  >
                    {gender.toLowerCase()}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {!userInfo && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="yob">User&apos;s year of birth</Label>
              <Select
                id="yob"
                name="yob"
                defaultValue={defaultValues.yob || ""}
              >
                <option value="">Select your birth year</option>
                {yearOfBirth.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="address">Location Of Registered Facility</Label>
            <Select
              id="address"
              name="address"
              defaultValue={defaultValues.address || ""}
            >
              <option value="">All locations</option>
              {distinctLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </Select>
          </div>
          <FormSubmitButton className="w-full" type="submit">
            Filter Clinics | Query Symptoms
          </FormSubmitButton>
        </div>
      </form>
    </aside>
  );
}
