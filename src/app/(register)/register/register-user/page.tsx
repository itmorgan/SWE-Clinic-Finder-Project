import { Metadata } from "next";
import NewUserRegistrationForm from "./NewUserRegistrationForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Register account for DrWhere",
};

export default function Page() {
  return <NewUserRegistrationForm />;
}
