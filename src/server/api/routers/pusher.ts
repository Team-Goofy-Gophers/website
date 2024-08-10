import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { pusher } from "~/utils/pusher";

export const pusherRouter = createTRPCRouter({
  getMessages: protectedProcedure
    .input(
      z.object({
        disasterId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await ctx.db.message.findMany({
        where: {
          disasterId: input.disasterId,
        },
        include: {
          User: true,
        },
      });
    }),
  send: protectedProcedure
    .input(
      z.object({
        message: z.string(),
        disasterId: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { message } = input;
      const { user } = ctx.session;

      const response = await pusher
        .trigger(`chat-${input.disasterId}`, "message-event", {
          message,
          sender: user.name,
          senderId: user.id,
        })
        .catch((error) => {
          console.error("Pusher trigger error:", error);
          throw new Error("Failed to trigger Pusher event");
        });

      await ctx.db.message.create({
        data: {
          message: input.message,
          disasterId: input.disasterId,
          userId: user.id,
        },
      });

      return response;
    }),
});
