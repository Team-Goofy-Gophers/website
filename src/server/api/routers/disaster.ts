import { addMMR, removeMMR } from "~/server/api/routers/mmr";

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
      const da = await ctx.db.disasterAlert.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });

      const users = await ctx.db.disasterReport.findMany({
        where: {
          DisasterAlert: {
            id: input.id,
          },
        },
        include: {
          User: true,
        },
      });

      if (input.status === "RESOLVED")
        for (const user of users)
          await addMMR({
            userId: user.User.id,
            intensity:
              da.intensity > 7 ? "high" : da.intensity > 4 ? "medium" : "low",
          });
      else if (input.status === "FAKE")
        for (const user of users)
          await removeMMR({
            userId: user.User.id,
            intensity:
              da.intensity > 7 ? "high" : da.intensity > 4 ? "medium" : "low",
          });
    }),

  getAllDisasterAlerts: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.disasterAlert.findMany({
      include: {
        Disaster: true,
      },
    });
  }),

  getAllDisasterReports: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.disasterReport.findMany({
      include: {
        DisasterAlert: {
          include: {
            Disaster: true,
          },
        },
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
                lte: input.long + 10,
                gte: input.long - 10,
              },
            },
            {
              lat: {
                lte: input.lat + 10,
                gte: input.lat - 10,
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
          intensity: input.intensity,
          Disaster: {
            connect: {
              id: input.disasterId,
            },
          },
          DisasterReport: {
            create: {
              description: input.description,
              status: input.status,
              intensity: input.intensity,
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

      if (report.status === "RESOLVED") return;

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
      let accumulatedBadIntensity = 0;

      disasterReports.forEach((ele) => {
        if (ele.status === "ONGOING")
          accumulatedIntensity += (ele.intensity * ele.User.mmr) / 100;
        else if (ele.status === "FAKE")
          accumulatedBadIntensity += (ele.intensity * ele.User.mmr) / 100;
      });

      if (accumulatedBadIntensity > 1.5 * accumulatedIntensity) {
        if (accumulatedBadIntensity >= report.intensity)
          await ctx.db.disasterAlert.update({
            where: {
              id: report.id,
            },
            data: {
              status: "UNRELIABLE",
            },
          });
      } else if (accumulatedIntensity >= report.intensity) {
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
          intensity: input.intensity,
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

      await ctx.db.disasterAlert.update({
        where: {
          id: report.DisasterAlert.id,
        },
        data: {
          intensity: Math.floor(
            (report.DisasterAlert.intensity + report.intensity) / 2,
          ),
        },
      });

      if (report.DisasterAlert.status === "RESOLVED") return;

      const disasterReports = await ctx.db.disasterReport.findMany({
        where: {
          DisasterAlert: {
            id: report.DisasterAlert.id,
          },
        },
        include: {
          User: true,
        },
      });

      let accumulatedIntensity = 0;
      let accumulatedBadIntensity = 0;

      disasterReports.forEach((ele) => {
        if (ele.status === "ONGOING")
          accumulatedIntensity += (ele.intensity * ele.User.mmr) / 100;
        else if (ele.status === "FAKE")
          accumulatedBadIntensity += (ele.intensity * ele.User.mmr) / 100;
        else console.log("WHY NOT\n");
      });

      if (accumulatedBadIntensity > 1.5 * accumulatedIntensity) {
        if (accumulatedBadIntensity >= report.DisasterAlert.intensity)
          await ctx.db.disasterAlert.update({
            where: {
              id: report.id,
            },
            data: {
              status: "UNRELIABLE",
            },
          });
      } else if (accumulatedIntensity >= report.DisasterAlert.intensity) {
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
