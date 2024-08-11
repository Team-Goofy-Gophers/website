import { TRPCError } from "@trpc/server";
import { type z } from "zod";

import { db } from "~/server/db";

import { getMMRRatio } from "~/utils/mmr";
import { type addMMRZ, type removeMMRZ } from "~/zod/mmr";

const addMMR: (input: z.infer<typeof addMMRZ>) => Promise<void> = async (
  input,
) => {
  const user = await db.user.findUnique({
    where: {
      id: input.userId,
    },
  });

  if (!user)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });

  const mmrRatio = getMMRRatio(user.mmr);

  const additionalMMR =
    input.intensity === "low"
      ? 1 * mmrRatio
      : input.intensity === "medium"
        ? 2 * mmrRatio
        : 3 * mmrRatio;

  await db.user.update({
    where: {
      id: input.userId,
    },
    data: {
      mmr: user.mmr + additionalMMR,
    },
  });
};

const removeMMR: (input: z.infer<typeof removeMMRZ>) => Promise<void> = async (
  input,
) => {
  const user = await db.user.findUnique({
    where: {
      id: input.userId,
    },
  });

  if (!user)
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found",
    });

  const mmrRatio = getMMRRatio(user.mmr, false);

  const additionalMMR =
    input.intensity === "low"
      ? 1 * mmrRatio
      : input.intensity === "medium"
        ? 2 * mmrRatio
        : 3 * mmrRatio;

  await db.user.update({
    where: {
      id: input.userId,
    },
    data: {
      mmr: user.mmr - additionalMMR,
    },
  });
};

export { addMMR, removeMMR };
