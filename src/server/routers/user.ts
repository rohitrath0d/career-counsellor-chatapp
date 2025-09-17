import { z } from "zod";
import { router, publicProcedure } from "../trpc/trpc";
import { hash, compare } from "bcryptjs";
// import { PrismaClient } from "@prisma/client";
import {prisma} from "../prisma/prisma"

// const prisma = new PrismaClient();

export const userRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({ where: { email: input.email } });
      if (!user) throw new Error("User not found");

      const valid = await compare(input.password, user.password!);
      if (!valid) throw new Error("Invalid credentials");

      return { 
        id: user.id, 
        email: user.email, 
        name: user.name 
      };
    }),

  signup: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await prisma.user.findUnique({ where: { email: input.email } });
      if (existing) throw new Error("User already exists");

      const hashed = await hash(input.password, 10);
      const newUser = await prisma.user.create({
        data: { 
          email: input.email, 
          password: hashed, 
          name: input.name 
        },
      });

      return { 
        id: newUser.id, 
        email: newUser.email, 
        name: newUser.name 
      };
    }),
});
