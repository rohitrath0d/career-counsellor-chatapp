import { router } from "../trpc/trpc";
import { chatRouter } from "./chat";
import { userRouter } from "./user";

export const appRouter = router({
   user: userRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
