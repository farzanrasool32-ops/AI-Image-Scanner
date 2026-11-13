import type { RequestHandler } from "express";

export const getHealth: RequestHandler = (_request, response) => {
  response.json({
    status: "ok",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
};
