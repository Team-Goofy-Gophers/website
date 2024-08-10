import {
  GoogleGenerativeAI,
  FunctionDeclarationSchemaType,
} from "@google/generative-ai";
import { z } from "zod";

import { env } from "~/env";

import { createTRPCRouter, protectedProcedure } from "../trpc";

// Model
const model = new GoogleGenerativeAI(env.GEMINI_API_KEY).getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are a disaster response coordinator. You are tasked with creating a list of essential actions to take before, during, and after a natural disaster and other tasks related to disaster management. You will also given chats to respond to.",
});

// Config for json response
const generatorConfig = {
  responseMimeType: "application/json",
  responseSchema: {
    type: FunctionDeclarationSchemaType.ARRAY,
    items: {
      type: FunctionDeclarationSchemaType.OBJECT,
      properties: {
        action: {
          type: FunctionDeclarationSchemaType.STRING,
        },
        phase: {
          type: FunctionDeclarationSchemaType.STRING, // Can be enum: 'before', 'during', 'after'
        },
        description: {
          type: FunctionDeclarationSchemaType.STRING,
        },
        importance: {
          type: FunctionDeclarationSchemaType.STRING, // Can be enum: 'critical', 'important', 'optional'
        },
      },
    },
  },
};

// Zod types
const GuideInput = z.object({
  language: z.string().optional().default("english"),
  disaster: z.string(),
  phase: z.string().optional().default("during"),
});
const promptInput = z.object({
  text: z.string().optional().default("What can you do?"),
  language: z.string().optional().default("english"),
});
const ChatInput = z.object({
  text: z.string(),
  language: z.string().optional().default("english"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        parts: z.array(
          z.object({
            text: z.string(),
          }),
        ),
      }),
    )
    .optional()
    .default([]),
});

const geminiRouter = createTRPCRouter({
  // Json route
  guide: protectedProcedure
    .input(GuideInput)
    .mutation(async ({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const prompt = `List all essential actions to take ${input.phase} a ${input.disaster} in ${input.language} language.`;

      const jsonModel = model;
      jsonModel.generationConfig = generatorConfig;

      const result = await jsonModel.generateContent(prompt);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(result.response.text());
    }),

  // Single prompt route
  prompt: protectedProcedure
    .input(promptInput)
    .mutation(async ({ ctx, input }) => {
      const prompt = input.text;
      const result = await model.generateContent(prompt);
      return result.response.text();
    }),

  // Chat route
  chat: protectedProcedure.input(ChatInput).mutation(async ({ ctx, input }) => {
    const chat = model.startChat({
      history: input.history,
    });
    const result = await chat.sendMessage(
      input.text + "\n respond in " + input.language,
    );
    return result.response.text();
  }),
});

export { geminiRouter };
