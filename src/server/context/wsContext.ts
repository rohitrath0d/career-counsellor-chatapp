import { prisma } from "../prisma/prisma";
import type { Session } from "next-auth";


// Optional: if want to authenticate users via token passed over WS
// export async function createWSSContext(opts: { token?: string } = {}) {
export async function createWSSContext() {
  // TODO: extract session from token if you use JWT or custom token
  const session: Session | null = null; // replace with real auth if needed

  return {
    session: null,
    prisma,
  };
}

export type WSSContext = Awaited<ReturnType<typeof createWSSContext>>;
