import NextAuth from "next-auth";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "@/features/auth/actions";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // Find existing user
      let existingUser = await db.user.findUnique({
        where: {
          email: user.email,
        },
      });

      // Create user if first login
      if (!existingUser) {
        existingUser = await db.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
          },
        });
      }

      // Link OAuth account if not already linked
      if (account) {
        const existingAccount = await db.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });

        if (!existingAccount) {
          await db.account.create({
            data: {
              userId: existingUser.id,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              type: account.type,
            },
          });
        }
      }

      return true;
    },

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;

      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (session.user) {
        session.user.role = token.role;
      }

      return session;
    },
  },

  secret: process.env.AUTH_SECRET,



  session: {
    strategy: "jwt",
  },

  ...authConfig,
});