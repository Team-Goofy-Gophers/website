import { deleteUserZ, getUserZ, updateUserZ } from "~/zod/user";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const userRouter = createTRPCRouter({
  getMe: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),

  getUser: protectedProcedure.input(getUserZ).query(async ({ ctx, input }) => {
    return await ctx.db.user.findUnique({
      where: {
        id: input.id,
      },
    });
  }),

  updateUser: protectedProcedure
    .input(updateUserZ)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          email: input.email,
        },
      });
    }),

  deleteUser: protectedProcedure
    .input(deleteUserZ)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.delete({
        where: {
          id: input.id,
        },
      });
    }),
});

export default userRouter;
