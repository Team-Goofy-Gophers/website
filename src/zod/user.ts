import { z } from "zod";

const getUserZ = z.object({
  id: z.string(),
});

const updateUserZ = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});

const deleteUserZ = z.object({
  id: z.string(),
});

export { getUserZ, updateUserZ, deleteUserZ };
