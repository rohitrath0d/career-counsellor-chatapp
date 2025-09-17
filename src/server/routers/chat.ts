// src/server/routers/chat.ts
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc/trpc";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatRouter = router({
  // 1. Start a new chat session
  startChat: protectedProcedure
    .input(z.object({ title: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      // const userId = ctx.session.user.id
      const chat = await ctx.prisma.chat.create({
        data: {
          title: input.title ?? "New Chat",
          userId:  ctx.session.user.id,
        },
      });
      return chat;
    }),

  // 2. Get all chats of logged-in user
  getChats: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.chat.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { updatedAt: "desc" },
    });
  }),

  // 3. Get messages of a chat
  getMessages: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.message.findMany({
        where: { sessionId: input.chatId },
        orderBy: { createdAt: "asc" },
      });
    }),

  // 4. Send user message -> AI reply
  sendMessage: protectedProcedure
    .input(
      z.object({
        chatId: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // save user message
      const userMsg = await ctx.prisma.message.create({
        data: {
          sessionId: input.chatId,
          sender: "user",
          content: input.content,
        },
      });

      // fetch past messages to maintain context
      const pastMessages = await ctx.prisma.message.findMany({
        where: { sessionId: input.chatId },
        orderBy: { createdAt: "asc" },
      });

      // format for AI
      const aiContext = pastMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.content,
      }));

      // call AI API
      const aiResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini", // or together's free model
        messages: [
          { role: "system", content: "You are a helpful career counselor." },
          ...aiContext,
          { role: "user", content: input.content },
        ],
      });

      const reply =
        aiResponse.choices[0]?.message?.content ??
        "Sorry, I couldn’t generate a response.";

      // save AI reply
      const aiMsg = await ctx.prisma.message.create({
        data: {
          sessionId: input.chatId,
          sender: "ai",
          content: reply,
        },
      });

      // update chat timestamp
      await ctx.prisma.chat.update({
        where: { id: input.chatId },
        data: { updatedAt: new Date() },
      });

      return { user: userMsg, ai: aiMsg };
    }),
});
