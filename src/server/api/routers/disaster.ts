import {
  addDisasterReportExistingZ,
  addDisasterReportNewZ,
  addDisasterZ,
  deleteDisasterZ,
  getAllDisasterAlertsZ,
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

  getDisasterAlerts: protectedProcedure
    .input(getAllDisasterAlertsZ)
    .query(async ({ ctx, input }) => {
      // TOD) implement location radius
      return await ctx.db.disasterAlert.findMany({
        where: {
          status:
            typeof input.status === "string"
              ? input.status
              : {
                  in: input.status,
                },
        },
        include: {
          Disaster: true,
        },
      });
    }),

  addDisasterReportNew: protectedProcedure
    .input(addDisasterReportNewZ)
    .mutation(async ({ ctx, input }) => {
      const report = await ctx.db.disasterAlert.create({
        data: {
          description: input.description,
          location: input.location,
          status: input.status,
          Disaster: {
            connect: {
              id: input.disasterId,
            },
          },
          DisasterReport: {
            create: {
              description: input.description,
              status: input.status,
              User: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          },
        },
      });

      const disasterAlert = await ctx.db.disasterAlert.findUnique({
        where: {
          id: report.id,
        },
        include: {
          Disaster: true,
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
