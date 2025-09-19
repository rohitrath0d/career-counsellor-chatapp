import { prisma } from "../prisma/prisma";
import type { Session } from "next-auth";
import { verify } from "jsonwebtoken";
import { IncomingMessage, ServerResponse } from "http";


interface CreateWSSContextOptions {
  req?: IncomingMessage & {
    // tRPC WebSocket adapter adds these properties
    connectionParams?: Record<string, unknown>;
  };
  // res?: any;
  // res?: ServerResponse;
  res?: any;

  // connectionParams?: {
  //   authToken?: string;
  // };

}



// Optional: if want to authenticate users via token passed over WS
// export async function createWSSContext(opts: { token?: string } = {}) {
// Extract session from WebSocket token
// export async function createWSSContext(opts: { req?: any; res?: any } = {}) {
export async function createWSSContext(opts: CreateWSSContextOptions = {}) {
  try {
    // For WebSocket connections, you might need to handle auth differently
    // This is a simplified version - you might need to adjust based on your auth setup
    let session: Session | null = null;

    // If you're using JWT tokens in WebSocket connections
    const token = opts.req?.headers?.authorization?.replace('Bearer ', '');
    if (token && process.env.NEXTAUTH_SECRET) {
      try {
        const decoded = verify(token, process.env.NEXTAUTH_SECRET) as { id: string };
        if (decoded) {
          // Get user from database
          const user = await prisma.user.findUnique({
            where: { id: decoded.id }
          });

          if (user) {
            session = {
              user: {
                id: user.id,
                email: user.email,
                name: user.name
              },
              expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
          }
        }
      } catch (error) {
        console.error('WebSocket token verification failed:', error);
      }
    }

    return {
      session,
      prisma,
    };
  } catch (error) {
    console.error('Error creating WebSocket context:', error);
    return {
      session: null,
      prisma,
    };
  }
}


// export type WSSContext = Awaited<ReturnType<typeof createWSSContext>>;
export type WSSContext = ReturnType<typeof createWSSContext>;
