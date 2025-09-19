import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    // user?: {
    //   id: string;
    // } & DefaultSession["user"];
    user?: {
      id: string;
      name?: string | null;
      email?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    name?: string | null;
    email?: string;
    // password: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}

declare module "next" {
  interface NextApiRequest {
    // user?: {
    //   id: string;
    //   email?: string;
    //   name?: string;
    // };
    user?: DefaultUser & { id?: string };
  }
}

// This tells TypeScript: every session has a user with an id.