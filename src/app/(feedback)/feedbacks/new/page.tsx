import { Metadata } from "next";
import NewFeedbackForm from "./NewFeedbackForm";
import { Role } from "@/lib/validation";
import { nanoid } from "nanoid";
import { auth } from "../../../../auth";

export const metadata: Metadata = {
  title: "Post a new feedback",
  description: "Feedback for DrWhere",
};

export default async function Page() {
  const session = await auth();

  const userId = session?.user?.id || "";

  return <NewFeedbackForm userId={userId} role={Role.User} />;
}
