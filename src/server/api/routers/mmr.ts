import { addMMRZ, removeMMRZ } from "~/zod/mmr";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getMMRRatio, getRankFromMMR } from "~/utils/mmr";

const mmrRouter = createTRPCRouter({
  addMMR: protectedProcedure.input(addMMRZ).mutation(async ({ ctx, input }) => {
    const user = await ctx.db.user.findUnique({
      where: {
        id: input.userId,
      },
    });

    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });

    const mmrRatio = getMMRRatio(user.mmr);

    const additionalMMR =
      input.intensity === "low"
        ? 1 * mmrRatio
        : input.intensity === "medium"
          ? 2 * mmrRatio
          : 3 * mmrRatio;

    const newRank = getRankFromMMR(user.mmr + additionalMMR);

    await ctx.db.user.update({
      where: {
        id: input.userId,
      },
      data: {
        mmr: user.mmr + additionalMMR,
        rank: newRank,
      },
    });
  }),

  removeMMR: protectedProcedure
    .input(removeMMRZ)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.userId,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      const mmrRatio = getMMRRatio(user.mmr, false);

      const additionalMMR =
        input.intensity === "low"
          ? 1 * mmrRatio
          : input.intensity === "medium"
            ? 2 * mmrRatio
            : 3 * mmrRatio;

      const newRank = getRankFromMMR(user.mmr - additionalMMR);

      await ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          mmr: user.mmr - additionalMMR,
          rank: newRank,
        },
      });
    }),
});

export default mmrRouter;
