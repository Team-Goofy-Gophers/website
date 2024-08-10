import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const supportRouter = createTRPCRouter({
  submitSupport: protectedProcedure
    .input(
      z.object({
        amount: z.number(),
        disasterId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.disasterAlert.update({
        where: {
          id: input.disasterId,
        },
        data: {
          totalSupportAmount: {
            increment: input.amount,
          },
          Support: {
            create: {
              amount: input.amount,
              userId: ctx.session.user.id,
            },
          },
        },
      });
    }),
  getSupportAmount: publicProcedure
    .input(
      z.object({
        disasterId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.disasterAlert.findUnique({
        where: {
          id: input.disasterId,
        },
        select: {
          totalSupportAmount: true,
        },
      });
    }),
});
