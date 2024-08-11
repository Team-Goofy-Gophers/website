import disasterRouter from "~/server/api/routers/disaster";
import { supportRouter } from "~/server/api/routers/support";
import userRouter from "~/server/api/routers/user";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

import { geminiRouter } from "./routers/gemini";
import { guidesRouter } from "./routers/guides";
import { pusherRouter } from "./routers/pusher";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  disaster: disasterRouter,
  chat: pusherRouter,
  guides: guidesRouter,
  support: supportRouter,
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
