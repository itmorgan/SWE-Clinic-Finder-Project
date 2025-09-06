import { Metadata } from "next";
import NewHealthFacRegistrationForm from "./NewHealthFacRegistrationForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Register account for DrWhere",
};

export default function Page() {
  return <NewHealthFacRegistrationForm />;
}
