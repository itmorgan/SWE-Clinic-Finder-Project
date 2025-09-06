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
import { genderTypes, salutationTypes } from "@/lib/feature-types";
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
import { EditUserInfoValues, editUserInfoSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { UserInfo } from "@prisma/client";
import { FormError } from "@/components/FormError";

export function EditUserInfoForm<UserInfo>({ userInfo }) {
  const invalidInput = (error) => {
    console.log(error);
  };
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const userEditForm = useForm<EditUserInfoValues>({
    resolver: zodResolver(editUserInfoSchema),
    defaultValues: {
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      gender: userInfo.gender,
      salutation: userInfo.salutation,
      dateOfBirth: userInfo.dateOfBirth,
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber,
      postalCode: userInfo.postalCode,
      address: userInfo.address,
      existingConditions: JSON.parse(userInfo.existingConditions),
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = userEditForm;

  async function onUserInfoSubmit(values: EditUserInfoValues) {
    const temp = await editUserInfo(values, userInfo.userId, "user");
    if (temp===true) {
      setSuccessMessage("Update successful!");
      setErrorMessage("");
    }else{
      setErrorMessage(temp.error)
      setSuccessMessage("");
    }
  }

  const disabledDays = [{after:new Date()}]

  return (
    <Form {...userEditForm}>
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
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    captionLayout="dropdown-buttons"
                    disabled = {disabledDays}
                    // selected={date}
                    // onSelect={setDate}
                    fromYear={new Date("1900-01-01").getFullYear()}
                    toYear={new Date().getFullYear()}
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="e.g. john@drWhere.com"
                  {...field}
                />
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
          name="existingConditions"
          render={() => (
            <FormItem>
              <FormLabel>Existing Medical Condition</FormLabel>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                {symptomsList.map((symptom) => (
                  <FormField
                    key={symptom.ID}
                    control={control}
                    name="existingConditions"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={symptom.ID}
                          className="mb-3 flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                symptom.ID.toString(),
                              )}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...(field.value || []),
                                      symptom.ID.toString(),
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) =>
                                          value !== symptom.ID.toString(),
                                      ),
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {symptom.Name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </ScrollArea>
              <FormMessage />
            </FormItem>
          )}
        />
        {successMessage && (
          <div style={{ color: "green", marginBottom: "10px" }}>
            {successMessage}
          </div>
        )}
        {errorMessage && 
            <div className="mt-1">
                <FormError message={`${errorMessage}`} />
            </div>
        }
        <div className="mt-[2vh]">
          <LoadingButton type="submit" loading={isSubmitting}>
            Submit
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
