
import cors from "cors";
import cookieParser from "cookie-parser";
import express, { type ErrorRequestHandler } from "express";
import apiRoutes from "./routes";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));

app.get("/", (_request, response) => {
  response.json({
    message: "AI Image Scanner Backend is running!",
    status: "OK",
  });
});

app.use("/api", apiRoutes);

const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  console.error("API request failed:", error);
  if (response.headersSent) return;
  response
    .status(500)
    .json({ error: "The server could not complete this request." });
};

app.use(errorHandler);

export default app;
