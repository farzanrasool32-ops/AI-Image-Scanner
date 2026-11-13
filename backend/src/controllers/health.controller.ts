import type { RequestHandler } from "express";
import { connectDatabase } from "../services/database";

export const getHealth: RequestHandler = async (_request, response) => {
  const databaseConnected = await connectDatabase();
  response.json({
    status: "ok",
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    databaseConfigured: Boolean(process.env.MONGODB_URI?.trim()),
    databaseConnected,
  });
};
