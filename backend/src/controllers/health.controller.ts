import type { RequestHandler } from "express";
import { isDatabaseReady } from "../services/database";

export const getHealth: RequestHandler = (_request, response) => {
  response.json({
    status: "ok",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    databaseConnected: isDatabaseReady(),
  });
};
