"use client";

import LoadingButton from "@/components/LoadingButton";
import H1 from "@/components/ui/h1";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select-improve";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateHealthFacilityAccountValues,
  Role,
  createHealthFacilityAccountSchema,
} from "@/lib/validation";
import HealthFacLocationInput from "@/components/HealthFacLocationInput";
import { useEffect, useState } from "react";
import { set } from "date-fns";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { salutationTypes, genderTypes } from "@/lib/feature-types";
import { createHealthFacAccount } from "./actions";
import Loading from "@/app/loading";
import { FormError } from "@/components/FormError";

type Clinics = {
  clinicInfo: {
    id: string;
    lat: number;
    lng: number;
    name: string;
    phone_number: string | null;
    postal_code: string;
    block_no: string | null;
    floor_no: string | null;
    unit_no: string | null;
    street_name: string | null;
    building_name: string | null;
    address: string;
  }[];
} | null;

type Clinic = {
  id: string;
  lat: number;
  lng: number;
  name: string;
  phone_number: string | null;
  postal_code: string;
  block_no: string | null;
  floor_no: string | null;
  unit_no: string | null;
  street_name: string | null;
  building_name: string | null;
  address: string;
} | null;

export default function NewHealthFacRegistrationForm() {
  const form = useForm<CreateHealthFacilityAccountValues>({
    resolver: zodResolver(createHealthFacilityAccountSchema),
    defaultValues: {
      facilityDoctors: [
        {
          doctorFirstName: "",
          doctorLastName: "",
          doctorPhoneNumber: "",
          doctorAddress: "",
          doctorGender: "",
          doctorSalutation: "",
        },
      ],
    },
  });

  const [clinics, setClinics] = useState<Clinics>(null);
  const [facility, setFacility] = useState<Clinic>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [deletionError, setDeletionError] = useState<string>("");

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form;

  //Use field array for doctors
  const { fields, append, remove } = useFieldArray({
    control,
    name: "facilityDoctors",
  });

  const handleAppend = () => {
    append({
      doctorSalutation: "",
      doctorFirstName: "",
      doctorLastName: "",
      doctorPhoneNumber: "",
      doctorAddress: "",
      doctorGender: "",
    });
  };

  const handleRemove = (index: number) => {
    if (fields.length == 1) {
      setDeletionError("Health Facility must have at least 1 doctor");
      setTimeout(() => {
        setDeletionError("");
      }, 2000);
      return;
    }
    remove(index);
  };

  async function getAllclinics() {
    try {
      const response = await fetch("/api/clinics", {
        method: "GET",
      });

      if (response) {
        const data = await response.json();
        setClinics(data);
      }
    } catch (error) {
      console.error("Failed to get clinics");
    }
  }

  useEffect(() => {
    getAllclinics();
  }, []);

  async function onSubmit(values: CreateHealthFacilityAccountValues) {
    try {
      await createHealthFacAccount(
        values,
        Role.HealthFacility,
        facility?.id,
      ).then((response) => {
        if (response?.error) {
          setErrorMessage(response.error);
        }
      });
    } catch (error) {
      setErrorMessage("Error to create health facility account");
    }
  }
  return (
    <main>
      {clinics && (
        <main className="m-auto my-10 max-w-3xl space-y-10">
          <div className="space-y-5 text-center">
            <H1>Welcome! Create your account</H1>
            <p className="text-muted-foreground">
              Register for an account to get started
            </p>
          </div>

          <div className="space-y-6 rounded-lg border p-4">
            <div>
              <h2 className="font-semibold">Account details</h2>
              <p className="text-muted-foreground">Provide account details</p>
            </div>

            <Form {...form}>
              <form
                className="space-y-4"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <FormField
                  control={control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. gem0816 " {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="e.g ඞ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="e.g ඞ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="facilityEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g john@drWhere.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="facilityWebsite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website Link (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g https://www.iamgem.com/"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Idea is to select the clinic then autofill */}
                <FormField
                  control={control}
                  name="facilityAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Location</FormLabel>
                      <FormControl>
                        <HealthFacLocationInput
                          clinicsList={clinics.clinicInfo}
                          onLocationSelected={(location) => {
                            if (location) {
                              setFacility(location);
                              setValue(
                                "facilityAddress",
                                `${location.name}, ${location.address}`,
                              );
                              setValue("facilityName", location.name);
                              setValue(
                                "facilityPhoneNumber",
                                location.phone_number ?? "",
                              );
                              setValue(
                                "facilityStreetName",
                                location.street_name ?? "",
                              );
                              setValue(
                                "facilityBuildingName",
                                location.building_name ?? "",
                              );
                              setValue(
                                "facilityBlockNumber",
                                location.block_no ?? "",
                              );
                              setValue(
                                "facilityFloorNumber",
                                location.floor_no ?? "",
                              );
                              setValue(
                                "facilityUnitNumber",
                                location.unit_no ?? "",
                              );
                              setValue(
                                "facilityPostalCode",
                                location.postal_code,
                              );
                            }
                          }}
                          ref={field.ref}
                        />
                      </FormControl>
                      {watch("facilityAddress") && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setValue("facilityAddress", "", {
                                shouldValidate: true,
                              });
                              setFacility(null);
                              setValue("facilityName", "");
                              setValue("facilityPhoneNumber", "");
                              setValue("facilityStreetName", "");
                              setValue("facilityBuildingName", "");
                              setValue("facilityBlockNumber", "");
                              setValue("facilityFloorNumber", "");
                              setValue("facilityUnitNumber", "");
                              setValue("facilityPostalCode", "");
                            }}
                          >
                            <X size={20} />
                          </button>
                          <span className="text-sm">
                            {watch("facilityAddress")}
                          </span>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="facilityName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Gem's Clinic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="facilityPhoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 61234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="facilityStreetName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Street Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. SHENTON WAY" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="facilityBuildingName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Building Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. RIVERVALE PLAZA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="facilityBlockNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Block Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 888" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="facilityFloorNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Floor Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="facilityUnitNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Unit Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 32" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="facilityPostalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 531371" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <h2 className="font-semibold">Doctor details</h2>
                  <p className="text-muted-foreground">
                    Provide doctor details
                  </p>
                </div>

                <Button asChild type="button" onClick={handleAppend}>
                  Add Doctor
                </Button>

                {fields.map((field, index) => {
                  return (
                    <Card key={field.id}>
                      <CardHeader>
                        <CardTitle>Doctor {index + 1}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <FormField
                          control={control}
                          name={`facilityDoctors.${index}.doctorSalutation`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Salutation</FormLabel>
                              <FormControl>
                                <Select {...field}>
                                  <option value="" hidden>
                                    Select an option
                                  </option>
                                  {salutationTypes.map((salutation) => (
                                    <option key={salutation} value={salutation}>
                                      {salutation}
                                    </option>
                                  ))}
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`facilityDoctors.${index}.doctorFirstName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. gloria " {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`facilityDoctors.${index}.doctorLastName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. tang " {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`facilityDoctors.${index}.doctorPhoneNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g. 91234567" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`facilityDoctors.${index}.doctorGender`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <FormControl>
                                <Select {...field}>
                                  <option value="" hidden>
                                    Select an option
                                  </option>
                                  {genderTypes.map((gender) => (
                                    <option key={gender} value={gender}>
                                      {gender}
                                    </option>
                                  ))}
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name={`facilityDoctors.${index}.doctorAddress`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Blk 371 Hougang St 42 #01-219 Singapore 531371"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {index == 0 ? (
                          <FormError message={deletionError} />
                        ) : (
                          <></>
                        )}
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => handleRemove(index)}
                        >
                          Remove Doctor &nbsp; <X className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
                <Button variant="default" type="button" onClick={handleAppend}>
                  Add Doctor
                </Button>

                <FormError message={errorMessage} />

                <LoadingButton type="submit" loading={isSubmitting}>
                  Submit
                </LoadingButton>
              </form>
            </Form>
          </div>
        </main>
      )}
      {!clinics && Loading()}
    </main>
  );
}
