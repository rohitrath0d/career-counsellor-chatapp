import { router, publicProcedure } from "../trpc/trpc"
import { z } from "zod"
import { prisma } from "../prisma/prisma";



export const chatRouter = router({
  createSession: publicProcedure
    .input(z.object({ userId: z.string(), title: z.string() }))
    .mutation(async ({ input }) => {
      // return prisma.chatSession.create({
      return prisma.chat.create({
        data: { userId: input.userId, title: input.title },
      })
    }),


  getSessions: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      // return prisma.chatSession.findMany({
      return prisma.chat.findMany({
        where: { userId: input.userId },
        orderBy: { createdAt: "desc" },
      });
    }),

  getMessages: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(({ input }) => {
      return prisma.message.findMany({
        where: { sessionId: input.sessionId },
        orderBy: { createdAt: "asc" },
      });
    }),

})

