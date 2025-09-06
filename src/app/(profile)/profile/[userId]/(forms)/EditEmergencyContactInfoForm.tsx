"use client";
import {
  Form,
  FormLabel,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import Select from "@/components/ui/select-improve";
import {
  genderTypes,
  relationshipTypes,
  salutationTypes,
} from "@/lib/feature-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import symptomsList from "@/lib/symptoms-list";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar-improve";
import { format } from "date-fns";
import { editUserInfo } from "../actions";
import {
  EditEmergecyContactInfoValues,
  EditUserInfoValues,
  editEmergecyContactInfoSchema,
  editUserInfoSchema,
} from "@/lib/validation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export function EditEmergecyContactInfoForm({ emergencyContactInfo }) {
  const invalidInput = (error) => {
    console.log(error);
  };
  const [successMessage, setSuccessMessage] = useState("");

  const emergencyContactEditForm = useForm<EditEmergecyContactInfoValues>({
    resolver: zodResolver(editEmergecyContactInfoSchema),
    defaultValues: {
      firstname: emergencyContactInfo.firstname,
      lastname: emergencyContactInfo.lastname,
      gender: emergencyContactInfo.gender,
      salutation: emergencyContactInfo.salutation,
      phoneNumber: emergencyContactInfo.phoneNumber,
      postalCode: emergencyContactInfo.postalCode,
      address: emergencyContactInfo.address,
      relationship: String(emergencyContactInfo.relationship),
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = emergencyContactEditForm;

  async function onUserInfoSubmit(values: EditUserInfoValues) {
    const temp = await editUserInfo(
      values,
      emergencyContactInfo.userId,
      "emergencyContact",
    );
    if (temp) {
      setSuccessMessage("Update successful!");
    }
  }
  return (
    <Form {...emergencyContactEditForm}>
      <form noValidate onSubmit={handleSubmit(onUserInfoSubmit, invalidInput)}>
        <div className="flex justify-between">
          <FormField
            control={control}
            name="firstname"
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
            name="lastname"
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
        </div>

        <FormField
          control={control}
          name="gender"
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
          name="salutation"
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
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 91234567 " {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="e.g. 531371" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="address"
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
        <FormField
          control={control}
          name="relationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relationship</FormLabel>
              <FormControl>
                <Select {...field}>
                  <option value="" hidden>
                    Select an option
                  </option>
                  {relationshipTypes.map((relationship) => (
                    <option key={relationship} value={relationship}>
                      {relationship}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {successMessage && (
          <div style={{ color: "green", marginBottom: "10px" }}>
            {successMessage}
          </div>
        )}
        <div className="mt-[2vh]">
          <LoadingButton type="submit" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
