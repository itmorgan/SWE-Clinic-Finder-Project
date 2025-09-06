"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import H1 from "@/components/ui/h1";
import { CreateFeedbackValues, createFeedbackSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select-improve";
import ReactStars from "react-stars";
import { featureTypes } from "@/lib/feature-types";
import LoadingButton from "@/components/LoadingButton";
import { Role } from "@/lib/validation";
import { createFeedbackPosting } from "./actions";

export default function NewFeedbackForm({
  userId,
  role,
}: {
  userId: string;
  role: Role;
}) {
  const form = useForm<CreateFeedbackValues>({
    resolver: zodResolver(createFeedbackSchema),
  });

  const {
    handleSubmit,
    watch,
    trigger,
    control,
    setValue,
    setFocus,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: CreateFeedbackValues) {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    try {
      await createFeedbackPosting(formData, userId, role);
    } catch (error) {
      console.error("Failed to submit feedback");
    }
  }

  return (
    <main className="m-auto my-10 max-w-3xl space-y-10">
      <div className="space-y-5 text-center">
        <H1>Leave a feedback for us</H1>
        <p className="text-muted-foreground">
          Have your feedback give us the chance to improve our site
        </p>
      </div>

      <div className="space-y-6 rounded-lg border p-4">
        <div>
          <h2 className="font-semibold">Feedback Form</h2>
          <p className="text-muted-foreground">Fill the form below</p>
        </div>

        <Form {...form}>
          <form
            className="space-y-4"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={control}
              name="ratings"
              defaultValue="0"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ratings of site</FormLabel>
                  <FormControl>
                    <ReactStars
                      count={5}
                      size={32}
                      half={false}
                      color2={"#3b82f6"}
                      onChange={(newRating) => {
                        field.onChange(newRating.toString());
                      }}
                      value={parseInt(field.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="feature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feature</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <option value="" hidden>
                        Select an option
                      </option>
                      {featureTypes.map((featureType) => (
                        <option key={featureType} value={featureType}>
                          {featureType}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormDescription>
                    Describe the feature that you face problems using.
                  </FormDescription>
                  <FormControl>
                    <Input
                      placeholder="e.g ඞ"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        trigger("feature");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="problemFaced"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Faced</FormLabel>
                  <FormDescription>
                    Are there other problems you faced when using this website?
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="e.g ඞ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="suggestion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suggestion</FormLabel>
                  <FormDescription>
                    What else would you like to see on our website?
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="e.g ඞ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={isSubmitting}>
              Submit
            </LoadingButton>
          </form>
        </Form>
      </div>
    </main>
  );
}
