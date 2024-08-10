import {
  addDisasterReportExistingZ,
  addDisasterReportNewZ,
  addDisasterZ,
  deleteDisasterZ,
  getAllDisasterAlertsZ,
  getDisasterZ,
  markDisasterAlertAsZ,
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

  markDisasterAlertAs: protectedProcedure
    .input(markDisasterAlertAsZ)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.disasterAlert.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),

  getDisasterAlerts: protectedProcedure
    .input(getAllDisasterAlertsZ)
    .query(async ({ ctx, input }) => {
      return await ctx.db.disasterAlert.findMany({
        where: {
          AND: [
            {
              status:
                typeof input.status === "string"
                  ? input.status
                  : {
                      in: input.status,
                    },
            },
            {
              long: {
                lte: input.long + 0.5,
                gte: input.long - 0.5,
              },
            },
            {
              lat: {
                lte: input.lat + 0.5,
                gte: input.lat - 0.5,
              },
            },
          ],
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
          lat: input.lat,
          long: input.long,
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
        include: {
          Disaster: true,
        },
      });

      const disasterReports = await ctx.db.disasterReport.findMany({
        where: {
          DisasterAlert: {
            id: report.id,
          },
        },
        include: {
          User: true,
        },
      });

      let accumulatedIntensity = 0;

      disasterReports?.map((ele) => {
        accumulatedIntensity += ele.User.mmr / 100;
      });

      if (accumulatedIntensity >= report.Disaster.intensity) {
        await ctx.db.disasterAlert.update({
          where: {
            id: report.id,
          },
          data: {
            status: "ONGOING",
          },
        });
      }
    }),

  addDisasterReportExisting: protectedProcedure
    .input(addDisasterReportExistingZ)
    .mutation(async ({ ctx, input }) => {
      const report = await ctx.db.disasterReport.create({
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
        include: {
          DisasterAlert: {
            include: {
              Disaster: true,
            },
          },
        },
      });

      const disasterReports = await ctx.db.disasterReport.findMany({
        where: {
          DisasterAlert: {
            id: report.id,
          },
        },
        include: {
          User: true,
        },
      });

      let accumulatedIntensity = 0;

      disasterReports?.map((ele) => {
        accumulatedIntensity += ele.User.mmr / 100;
      });

      if (accumulatedIntensity >= report.DisasterAlert.Disaster.intensity) {
        await ctx.db.disasterAlert.update({
          where: {
            id: report.id,
          },
          data: {
            status: "ONGOING",
          },
        });
      }
    }),
});

export default disasterRouter;
