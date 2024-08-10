import { z } from "zod";

const addDisasterZ = z.object({
  name: z.string(),
  intensity: z
    .number()
    .refine((intensity) => intensity >= 0 && intensity <= 100, {
      message: "Intensity must be between 0 and 100",
    }),
});

const getDisasterZ = z.object({
  id: z.string(),
});

const updateDisasterZ = z.object({
  id: z.string(),
  name: z.string(),
  intensity: z
    .number()
    .refine((intensity) => intensity >= 0 && intensity <= 100, {
      message: "Intensity must be between 0 and 100",
    }),
});

const deleteDisasterZ = z.object({
  id: z.string(),
});

export { addDisasterZ, getDisasterZ, updateDisasterZ, deleteDisasterZ };
