import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "../../../server/prisma/prisma"
import { compare, hash } from "bcryptjs";
// import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

// const prisma = new PrismaClient();

// export default NextAuth({
export const authOptions: NextAuthOptions =
// (
{
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Credentials (Email + Password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        name: { label: "Name", type: "text" }, // used only on signup
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          // throw new Error("Missing email or password");
          return null
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // if (!user) {
        //   throw new Error("User not found");
        // }



        // const isValid = await compare(credentials.password, user.password);
        // if (!isValid) {
        //   throw new Error("Invalid password");
        // }

        // return { id: user.id, email: user.email, name: user.name };


        if (existingUser) {
          // LOGIN flow
          // const validPassword = await bcrypt.compare(
          const validPassword = await compare(
            credentials.password,
            existingUser.password!
          );
          if (!validPassword) throw new Error("Invalid credentials");
          // return existingUser;
          return {
            id: existingUser.id,
            email: existingUser.email,
            name: existingUser.name,
            // password: existingUser.password,
          };
        } else {
          // SIGNUP flow
          if (!credentials.name) {
            throw new Error("Name required for signup");
          }
          // const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const hashedPassword = await hash(credentials.password, 10);
          const newUser = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.name,
              password: hashedPassword,
            },
          });
          // return newUser;
          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            // password: newUser.password,
          };
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth", // use your custom form
  },

  session: {
    strategy: "jwt",
    // strategy: "database"       // using DB sessions since i have PrismaAdapter
  },

  callbacks: {
    async jwt({ token, user }) {
      // if (user) token.id = user.id;
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token;
    },
    // async session({ session, token }) {
    async session({ session, token }) {
      // if (token) session.user.id = token.id as string;
      // attach token or user info to session
      if (token && session.user) {
        // session.user = {
        //   id: token.sub!,
        //   email: token.email!,
        //   name: token.name!,
        // }
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name
      }
      // if (session.user) {
      //   // session.user.id = token.id as string;
      //   session.user.id = user.id
      // }
      console.log("session data", session)
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
// );

export default NextAuth(authOptions);
