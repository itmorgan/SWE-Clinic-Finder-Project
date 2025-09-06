"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { logout } from "@/app/(auth)/logout/actions";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = () => {
    logout();
  };

  return (
    <Button onClick={onClick} className="cursor-pointer">
      {children}
    </Button>
  );
};
