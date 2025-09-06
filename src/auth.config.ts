import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { Role } from "@/lib/validation";
import { loginSchema } from "@/lib/validation";
import {
  getHealthFacilityAccountByUsername,
  getUserAccountByUsername,
} from "@/lib/data/account";

export default {
  secret: process.env.NEXT_PUBLIC_AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },

      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { username, password, role } = validatedFields.data;

          if (role == Role.User) {
            const user = await getUserAccountByUsername(username);

            if (user) {
              const passwordsMatch = await bcrypt.compare(
                password,
                user.password,
              );

              if (passwordsMatch) {
                return {
                  id: user.id,
                  username: user.username,
                  role: Role.User,
                };
              }
            }
          }

          if (role == Role.HealthFacility) {
            const healthFacility =
              await getHealthFacilityAccountByUsername(username);

            if (healthFacility) {
              const passwordsMatch = await bcrypt.compare(
                password,
                healthFacility.password,
              );

              if (passwordsMatch)
                return {
                  id: healthFacility.id,
                  username: healthFacility.username,
                  role: Role.HealthFacility,
                };
            }
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
