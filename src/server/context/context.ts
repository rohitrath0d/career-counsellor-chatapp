
// trpc context

import { prisma } from "../prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]"; // your [...nextauth].ts options
// import NextAuth from "../../pages/api/auth/[...nextauth]"; // your [...nextauth].ts options
import { NextApiRequest, NextApiResponse } from "next";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

// export async function createContext({ req, res }: any) {
// export async function createContext({ req, res }: { req: NextApiRequest; res: NextApiResponse }) {
export async function createContext({ req, res }: CreateNextContextOptions
) {
// export async function createContext({ req, res }: { req: any; res: any }) {

  const session = await getServerSession(req, res, authOptions);

  // We need a function that builds the context for each request, including:
  // prisma client
  // session (from getServerSession)


  return {
    session,
    prisma,
  }
}

// This ensures ctx.prisma and ctx.session exist in all routers.
// export type Context = ReturnType<typeof createContext> extends Promise<infer T> ? T : never;     // That’s basically reimplementing Awaited by hand . Both do the same job, but Awaited is cleaner and built into modern TypeScript.
// export type Context = ReturnType<typeof createContext>;
export type Context = Awaited<typeof createContext> ;    // Instead of manually writing the conditional type, you can just use Awaited (built-in TS utility): This unwraps the promise and gives you the actual shape.This unwraps the promise and gives you the actual shape.


