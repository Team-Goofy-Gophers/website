import disasterRouter from "~/server/api/routers/disaster";
import mmrRouter from "~/server/api/routers/mmr";
import userRouter from "~/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { guidesRouter } from "./routers/guides";
import { pusherRouter } from "./routers/pusher";
import { geminiRouter } from "./routers/gemini";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  disaster: disasterRouter,
  mmr: mmrRouter,
  chat: pusherRouter,
  gemini: geminiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
