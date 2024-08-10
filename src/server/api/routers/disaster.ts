import { addDisasterZ, getDisasterZ } from "~/zod/disaster";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const disasterRouter = createTRPCRouter({
  addDisaster: protectedProcedure
    .input(addDisasterZ)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.disaster.create({
        data: {
          name: input.name,
          intensity: input.intensity,
        },
      });
    }),

  getAllDisasters: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.disaster.findMany();
  }),

  getDisaster: protectedProcedure
    .input(getDisasterZ)
    .query(async ({ ctx, input }) => {
      return await ctx.db.disaster.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  updateDisaster: protectedProcedure
    .input(updateDisasterZ)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.disaster.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          intensity: input.intensity,
        },
      });
    }),

  deleteDisaster: protectedProcedure
    .input(deleteDisasterZ)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.disaster.delete({
        where: {
          id: input.id,
        },
      });
    }),
});

export default disasterRouter;
