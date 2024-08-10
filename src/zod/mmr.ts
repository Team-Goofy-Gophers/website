import { z } from "zod";

const addMMRZ = z.object({
  userId: z.string(),
  intensity: z.enum(["low", "medium", "high"]),
});

const removeMMRZ = z.object({
  userId: z.string(),
  intensity: z.enum(["low", "medium", "high"]),
});

export { addMMRZ, removeMMRZ };
