import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import authConfig from "./auth.config"
import { db } from "./lib/db";
import { getAccountByUserId, getUserById } from "@/features/auth/actions";

 

 
export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    // No custom signIn callback needed here. The PrismaAdapter already
    // handles creating new users and linking/looking up OAuth accounts
    // automatically on every sign-in. A hand-rolled version of that logic
    // duplicates the adapter's job and (worse) silently auto-links accounts
    // by email without the provider having verified that email - which is
    // the exact security hole Auth.js's own "OAuthAccountNotLinked" check
    // exists to prevent. If you need to gate who's allowed to sign in, add
    // a `signIn({ user, account })` callback that only returns true/false -
    // don't write to the DB inside it.

    async jwt({ token, user, account }) {
      if(!token.sub) return token;
      const existingUser = await getUserById(token.sub)

      if(!existingUser) return token;

      const exisitingAccount = await getAccountByUserId(existingUser.id);

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;

      return token;
    },

    async session({ session, token }) {
      // Attach the user ID from the token to the session
    if(token.sub  && session.user){
      session.user.id = token.sub
    } 

    if(token.sub && session.user){
      session.user.role = token.role
    }

    return session;
    },
  },
  
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
})