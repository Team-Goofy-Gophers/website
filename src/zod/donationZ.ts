import { z } from "zod";

const addDonationZ = z.object({
  disasterId: z.string(),
  amount: z.number().int().positive(),
  amount2: z.string().refine((val) => parseInt(val) > 0, {
    message: "Amount must be greater than 0",
  }),
});

export { addDonationZ };
