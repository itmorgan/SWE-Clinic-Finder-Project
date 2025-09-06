import NextAuth, { NextAuthConfig, DefaultSession } from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import authConfig from "./auth.config";
import { AdapterUser } from "next-auth/adapters";
import jwt from "jsonwebtoken";
import {
  getHealthFacilityAccountById,
  getHealthFacilityAccountDetails,
  getUserAccountById,
  getUserAccountDetails,
} from "./lib/data/account";
import { Role } from "@prisma/client";
import Error from "./app/error";
import { NextResponse } from "next/server";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma), //PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      const exisitngUser = await getUserAccountById(user.id);

      if (!exisitngUser) {
        const existingHealthFacility = await getHealthFacilityAccountById(
          user.id,
        );

        if (!existingHealthFacility) {
          return false;
        }

        if (!existingHealthFacility.emailVerified) {
          return false;
        }
      } else {
        if (!exisitngUser.emailVerified) {
          return false;
        }
      }

      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as Role;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUserRole = await getUserAccountById(token.sub).then(
        async (user) => {
          if (!user) return null;

          const role = await getUserAccountDetails(user.id).then((user) => {
            return user.role;
          });
          return role;
        },
      );

      if (!existingUserRole) {
        const existingHealthFacilityRole = await getHealthFacilityAccountById(
          token.sub,
        ).then(async (facility) => {
          if (!facility) return null;

          const role = await getHealthFacilityAccountDetails(facility.id).then(
            (facility) => {
              if (!facility) return null;
              return facility.role;
            },
          );

          return role;
        });

        token.role = existingHealthFacilityRole;

        return token;
      }

      token.role = existingUserRole;

      return token;
    },
  },

  ...authConfig,
});
