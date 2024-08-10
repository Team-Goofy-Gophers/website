import { z } from "zod";

export const getMessagesZ = z.object({
  disasterId: z.string(),
});

export const sendMessageZ = z.object({
  content: z.string(),
  disasterId: z.string(),
});
