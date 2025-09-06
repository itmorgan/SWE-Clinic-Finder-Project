import LoginForm from "./LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login for DrWhere",
  robots: {
    index: true,
    follow: true,
  },
};

export default function Login() {
  return <LoginForm />;
}
