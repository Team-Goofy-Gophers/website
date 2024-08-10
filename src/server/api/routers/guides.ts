import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const guidesRouter = createTRPCRouter({
  getAllGuides: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.guide.findMany();
  }),
  getGuide: publicProcedure
    .input(
      z.object({
        title: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.guide.findMany({
        where: {
          title: input.title,
        },
      });
    }),

  addGuide: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        data: z.string(),
        images: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.guide.create({
        data: {
          title: input.title,
          data: input.data,
          images: input.images,
        },
      });
    }),

  updateGuide: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        data: z.string(),
        images: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.guide.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          data: input.data,
          images: input.images,
        },
      });
    }),
  deleteGuide: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.guide.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
