"use server";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import { Search } from "lucide-react";
import { LogoutButton } from "./LogoutButton";
import { auth } from "@/auth";
import { Rabbit } from "lucide-react";
import { Role } from "@prisma/client";
import { LogOut, LogIn } from "lucide-react";
import { BookUp } from "lucide-react";
import { User } from "lucide-react";
import Login from "@/app/(auth)/login/page";

export default async function NavBar() {
  // useEffect(() => {}), [];

  const session = await auth();

  const userId = session?.user.id;

  return (
    <header className="sticky top-0 z-[999] border-b bg-white bg-opacity-30 backdrop-blur-lg backdrop-filter">
      <nav className=" m-auto flex max-w-7xl items-center justify-between px-3 py-5">
        <div className="flex flex-row gap-5">
          <Link href="/" className="flex items-center gap-3">
            <Image src={logo} alt="DrWhere logo" width={40} height={40} />
            <span className="text-xl font-bold tracking-tight ">DrWhere</span>
          </Link>

          <div>
            <Button variant="ghost" className="rounded-md" asChild>
              <Link href="/search/clinic" className="gap-3">
                <Search className="h-[1.2rem] w-[1.2rem] text-muted-foreground md:hidden" />
                <p className="hidden text-muted-foreground md:block">
                  Clinic Finder
                </p>
              </Link>
            </Button>

            {session && session.user.role === Role.User && (
              <UserNav userId={userId} />
            )}
            {session && session.user.role === Role.HealthFacility && (
              <ClinicNav userId={userId} />
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Check user/clinic session */}

          {!session && <DefaultNav />}

          {session && (
            <LogoutButton>
              <LogOut className="h-[1.2rem] w-[1.2rem]  md:hidden" />
              <p className="hidden  md:block">Logout</p>
            </LogoutButton>
          )}

          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}

function DefaultNav() {
  return (
    <>
      <Button asChild></Button>
      <Button asChild>
        <Link href="/login">
          <LogIn className="h-[1.2rem] w-[1.2rem]  md:hidden" />
          <p className="hidden  md:block">Login</p>
        </Link>
      </Button>
    </>
  );
}

interface userNavProps {
  userId: string;
}

function UserNav({ userId }: userNavProps) {
  // Remeber to include profile and stuff
  return (
    <>
      <Button variant="ghost" asChild>
        <Link href={`/profile/${userId}`}>
          <User className="h-[1.2rem] w-[1.2rem] text-muted-foreground md:hidden" />
          <p className="hidden text-muted-foreground md:block">Profile</p>
        </Link>
      </Button>
    </>
  );
}

interface clinicNavProps {
  userId: string;
}

function ClinicNav({ userId }: clinicNavProps) {
  // Remeber to include profile and stuff
  return (
    <>
      {/* schedule,  */}
      <Button variant="ghost" asChild>
        <Link href={`/clinic/${userId}`}>
          <Rabbit className="h-[1.2rem] w-[1.2rem] text-muted-foreground md:hidden" />
          <p className="hidden text-muted-foreground md:block">Upcoming</p>
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link href={`/clinic/${userId}/schedule`}>
          <BookUp className="h-[1.2rem] w-[1.2rem] text-muted-foreground md:hidden" />
          <p className="hidden text-muted-foreground md:block">Schedule</p>
        </Link>
      </Button>
    </>
  );
}
