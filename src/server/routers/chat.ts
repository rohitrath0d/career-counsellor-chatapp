import { z } from "zod";
import {
  router,
  protectedProcedure,
  ee,
  // publicProcedure ,
  observable,
  publicProcedure
} from "../trpc/trpc";
// import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Message } from "@prisma/client"; // add this at the top
// import { redisPub, redisSub } from "../redis";


// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });


// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//  System prompt for consistent AI persona
const systemPrompt =
  "You are a helpful career counselor. Be empathetic, practical, and concise in your replies.";

export const chatRouter = router({
  // 1. Start a new chat session
  startChat: protectedProcedure  // since authentication is required for ctx hence protected
    // startChat: publicProcedure
    .input(z.object({ title: z.string().optional().default("New Career Chat") }))
    .mutation(async ({ ctx, input }) => {

      console.log("startChat called with input:", input);

      if (!ctx.session?.user?.id) {
        throw new Error("User must be authenticated to create a chat");
      }

      // const userId = ctx.session.user.id
      const chat = await ctx.prisma.chat.create({
        data: {
          title: input.title,
          userId: ctx.session!.user.id,
        },
      });
      console.log("Created chat:", chat);

      return chat;
    }),

  // 2. Get all chats of logged-in user
  getChats: protectedProcedure.query(async ({ ctx }) => {

    return ctx.prisma.chat.findMany({
      // const chats = await ctx.prisma.chat.findMany({
      where: {
        userId: ctx.session.user.id
      },
      include: {
        messages: true, // <-- this fixes it
      },
      orderBy: { updatedAt: "desc" },
    });
    // console.log("chats", chats)
    // return chats
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
    .input(z.object({
      chatId: z.string(),
      skip: z.number().default(0),
      take: z.number().default(50)
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new Error("Not authenticated");
      }

      // Return messages in chronological order (old -> new)
      return ctx.prisma.message.findMany({
        where: { sessionId: input.chatId },
        // where: { sessionId: ctx.session.user.id },
        // orderBy: { createdAt: "desc" },
        orderBy: { createdAt: "asc" },
        skip: input.skip,
        take: input.take,
      });
    }),

  deleteChat: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // delete only if belongs to user
      await ctx.prisma.chat.deleteMany({
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
        role: z.enum(['user', 'assistant'])   // this must match frontened  
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) throw new Error("Not authenticated");

      // save user message
      const userMsg = await ctx.prisma.message.create({
        data: {
          sessionId: input.chatId,
          // sender: "user",
          sender: input.role === "assistant" ? "ai" : "user",
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




      // Format conversation history for AI
      const conversationHistory = pastMessages
        .reverse() // Oldest first
        .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content}`)
        .join('\n');


      const prompt = `
      You are a helpful career counselor. Be empathetic, practical, and concise in your replies.
      Conversation history:
      ${conversationHistory}
      User: ${input.content}
      AI:`;

      // Call Gemini API
      let aiReply: string;
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-002" });
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

        const result = await model.generateContent(prompt);
        aiReply = result.response.text() ?? "Sorry, I couldn't generate a response at this time. Limit reached. Try again later.";

      } catch (err) {
        console.error("Gemini error:", err);
        aiReply = "I'm experiencing technical difficulties. Please try again shortly";
        console.error("Gemini error:", err);
      }

      // Save AI response
      const aiMsg = await ctx.prisma.message.create({
        data: {
          sessionId: input.chatId,
          sender: "ai",
          // content: reply,
          content: aiReply,

        },
      });

      // update chat timestamp
      await ctx.prisma.chat.update({
        where: { id: input.chatId },
        data: { updatedAt: new Date() },
      });

      // //  Emit new messages via EventEmitter
      // ee.emit("newMessage", {
      //   chatId: input.chatId,
      //   user: userMsg,
      //   ai: aiMsg
      // });

      // Publish to Redis
      const payload = JSON.stringify({ user: userMsg, ai: aiMsg });
      // await redisPub.publish(`chat:${input.chatId}`, payload);

      return { user: userMsg, ai: aiMsg };
    }),

  // 5. Subscription for realtime messages

  newMessages: protectedProcedure
    .input(z.object({ chatId: z.string() }))
    .subscription(({ input }) => {
      return observable<{ user: Message; ai: Message }>((emit) => {

        //   const onMessage = (data: { chatId: string; user: Message; ai: Message }) => {
        //     if (data.chatId === input.chatId) {
        //       emit.next({ user: data.user, ai: data.ai });
        //     }
        //   };
        //   ee.on("newMessage", onMessage);
        //   return () => ee.off("newMessage", onMessage);
        // });

        const channel = `chat:${input.chatId}`;

        const handler = (messageStr: string) => {
          try {
            const data = JSON.parse(messageStr);
            emit.next(data);
          } catch (err) {
            console.error("Redis parse error:", err);
          }
        };

        // redisSub.subscribe(channel, (err) => {
        //   if (err) console.error("Redis subscribe error:", err);
        // });

        // redisSub.on("message", (msgChannel, messageStr) => {
        //   if (msgChannel === channel) handler(messageStr);
        // });

        // return () => {
        //   redisSub.unsubscribe(channel);
        // };
      });
    }),

  // onMessageAdded: publicProcedure
  //   .input(z.object({ sessionId: z.string() }))
  //   .subscription(({ input }) => {
  //     return observable<Message>((emit) => {
  //       // const handler = (message: Message) => {
  //       const handler = (pair: { chatId: string; user: Message; ai: Message }) => {
  //         // if (message.sessionId === input.sessionId) {
  //         if (pair.chatId === input.sessionId) {
  //           // emit.next(message);
  //           emit.next(pair.ai);

  //         }
  //       };

  //       // messageEmitter.on('add', handler); // use an EventEmitter for pushing msgs
  //       ee.on("messageAdded", handler);
  //       return () => {
  //         // messageEmitter.off('add', handler);
  //         ee.off("messageAdded", handler);
  //       };
  //     });
  //   }),


});