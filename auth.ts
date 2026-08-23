import NextAuth from "next-auth";

import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "@/features/auth/actions";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      let existingUser = await db.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        existingUser = await db.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
          },
        });
      }

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

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await db.user.findUnique({ where: { email: user.email } });
        if (dbUser) {
          token.sub = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.role = dbUser.role;
        }
        return token;
      }

      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (existingUser) {
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role;
      }

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
  }, // <-- closes `callbacks` — this was missing

  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  ...authConfig,
});