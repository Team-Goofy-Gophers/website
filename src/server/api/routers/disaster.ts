import {
  addDisasterReportExistingZ,
  addDisasterReportNewZ,
  addDisasterZ,
  deleteDisasterZ,
  getDisasterZ,
  updateDisasterZ,
} from "~/zod/disaster";
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

  addDisasterReportNew: protectedProcedure
    .input(addDisasterReportNewZ)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.disasterAlert.create({
        data: {
          description: input.disaster.description,
          location: input.disaster.location,
          status: input.disaster.status,
          Disaster: {
            connect: {
              id: input.disaster.id,
            },
          },
          DisasterReport: {
            create: {
              description: input.disaster.description,
              status: input.disaster.status,
              User: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          },
        },
      });
    }),

  addDisasterReportExisting: protectedProcedure
    .input(addDisasterReportExistingZ)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.disasterReport.create({
        data: {
          description: input.description,
          status: input.status,
          User: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          DisasterAlert: {
            connect: {
              id: input.disasterAlertId,
            },
          },
        },
      });
    }),
});

export default disasterRouter;
