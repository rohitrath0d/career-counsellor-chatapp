import { initTRPC } from "@trpc/server";
import type { Context } from "../context/context";
import { observable } from "@trpc/server/observable";


// const t = initTRPC.create();

// creating trpc connection with context
const t = initTRPC.context<Context>().create();

export const router = t.router;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new Error("Not authenticated");
  }
  return next({
    ctx: {
      ...ctx,  
      // user: ctx.session.user,

      // make ctx.session.user guaranteed
      session: ctx.session,   // now with user.id properly typed
    },
  });
});

// Event emitter for realtime messages - sockets
import { EventEmitter } from "events";
export const ee = new EventEmitter();
export {observable};