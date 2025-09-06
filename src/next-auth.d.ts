import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import { Role } from "@prisma/client";

// export type ExtendedUser = DefaultSession["user"] & {
//   role: Role;
// };

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's postal address. */
      role: string;
      id: string;
      username: string;
    };
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    role: Role;
  }
}
