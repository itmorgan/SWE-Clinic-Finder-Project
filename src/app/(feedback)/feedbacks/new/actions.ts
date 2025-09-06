"use server";

import { Role, createFeedbackSchema } from "@/lib/validation";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createFeedbackPosting(
  formData: FormData,
  userId: string,
  role: Role,
) {
  const values = Object.fromEntries(formData.entries());

  if (userId === "") userId = "anonymous";

  const { ratings, feature, description, problemFaced, suggestion } =
    createFeedbackSchema.parse(values);

  await prisma.feedback.create({
    data: {
      userId,
      ratings: parseInt(ratings),
      feature,
      description: description?.trim(),
      problemFaced: problemFaced?.trim(),
      suggestion: suggestion?.trim(),
      role,
    },
  });

  redirect("/feedback-submitted");
}
