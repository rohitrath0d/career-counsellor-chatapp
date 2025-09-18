import { z } from "zod";
import {
  router,
  protectedProcedure,
  ee,
  // publicProcedure ,
  observable
} from "../trpc/trpc";
// import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Message } from "@prisma/client"; // add this at the top


// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//  System prompt for consistent AI persona
const systemPrompt =
  "You are a helpful career counselor. Be empathetic, practical, and concise in your replies.";

export const chatRouter = router({
  // 1. Start a new chat session
  startChat: protectedProcedure
    .input(z.object({ title: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      // const userId = ctx.session.user.id
      const chat = await ctx.prisma.chat.create({
        data: {
          title: input.title ?? "New Chat",
          userId: ctx.session.user.id,
        },
      });
      return chat;
    }),

  // 2. Get all chats of logged-in user
  getChats: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.chat.findMany({
      where: {
        userId: ctx.session.user.id
      },
      include: {
        messages: true, // <-- this fixes it
      },
      orderBy: { updatedAt: "desc" },
    });
  }),

  // 3. Get messages of a chat
  // getMessages: protectedProcedure
  //   .input(z.object({ chatId: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     return ctx.prisma.message.findMany({
  //       where: { sessionId: input.chatId },
  //       orderBy: { createdAt: "asc" },
  //     });
  //   }),

  // This allows chat UI infinite scroll / lazy loading.
  getMessages: protectedProcedure
    .input(z.object({ chatId: z.string(), skip: z.number().default(0), take: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("Not authenticated");
      }

      return ctx.prisma.message.findMany({
        // where: { sessionId: input.chatId },
        where: { sessionId: ctx.session.user.id },
        orderBy: { createdAt: "desc" },
        skip: input.skip,
        take: input.take,
      });
    }),

  deleteChat: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.chat.delete({
        where: { id: input.chatId, userId: ctx.session.user.id },
      })
      return { success: true }
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
      // const pastMessages = await ctx.prisma.message.findMany({
      //   where: { sessionId: input.chatId },
      //   orderBy: { createdAt: "asc" },
      // });

      const pastMessages = await ctx.prisma.message.findMany({
        where: { sessionId: input.chatId },
        orderBy: { createdAt: "asc" },
        take: 20, // last 20 messages      take: -20 fetches last 20 messages. Keeps AI context relevant without overloading.
      });


      // format for AI
      // const aiContext = pastMessages.map((m) => ({
      //   role: m.sender === "user" ? "user" : "assistant",
      //   content: m.content,
      // }));

      const aiContext = pastMessages
        .reverse() // keep chronological order
        .map((m) => `${m.sender}: ${m.content}`)
        .join("\n");

      // // call AI API
      // const aiResponse = await openai.chat.completions.create({
      //   model: "gpt-4o-mini", // or together's free model
      //   messages: [
      //     { role: "system", content: "You are a helpful career counselor." },
      //     ...aiContext,
      //     { role: "user", content: input.content },
      //   ],
      // });

      // const prompt = `
      //   You are a helpful career counselor.
      //   The conversation so far:
      //   ${aiContext.map(m => `${m.role}: ${m.content}`).join("\n")}
      //   User: ${input.content}
      // `;
      const prompt = `
      You are a helpful career counselor.
      The conversation so far:
      ${aiContext}
      User: ${input.content}
    `;

      const result = await model.generateContent(prompt);

      const reply = result.response.text() ?? "Sorry, I couldn’t generate a response.";

      // const reply =
      //   aiResponse.choices[0]?.message?.content ??
      //   "Sorry, I couldn’t generate a response.";

      // // save AI reply
      // const aiMsg = await ctx.prisma.message.create({
      //   data: {
      //     sessionId: input.chatId,
      //     sender: "ai",
      //     content: reply,
      //   },
      // });

      // Call Gemini API
      let aiReply: string;
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        aiReply = result.response.text() ?? "Sorry, I couldn’t generate a response.";
      } catch (err) {
        console.error("Gemini error:", err);
        aiReply = "Something went wrong while generating advice.";
      }

      const aiMsg = await ctx.prisma.message.create({
        data: {
          sessionId: input.chatId,
          sender: "ai",
          content: reply,
        },
      });

      //  Emit new messages via EventEmitter
      ee.emit("newMessage", { chatId: input.chatId, user: userMsg, ai: aiMsg });



      // update chat timestamp
      await ctx.prisma.chat.update({
        where: { id: input.chatId },
        data: { updatedAt: new Date() },
      });

      return { user: userMsg, ai: aiMsg };
    }),

  // 5. Subscription for realtime messages

  newMessages: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .subscription(({ input }) => {
      return observable<{ user: Message; ai: Message }>((emit) => {
        const onMessage = (data: { chatId: string; user: Message; ai: Message }) => {
          if (data.chatId === input.chatId) {
            emit.next({ user: data.user, ai: data.ai });
          }
        };
        ee.on("newMessage", onMessage);
        return () => ee.off("newMessage", onMessage);
      });
    })
});