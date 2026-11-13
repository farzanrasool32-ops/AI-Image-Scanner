import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { authCookieName, getAuthSecret } from "../services/authTokens";

export const requireAuth: RequestHandler = (request, response, next) => {
  const secret = getAuthSecret();
  if (!secret) {
    response
      .status(503)
      .json({ error: "Authentication is not configured on the server." });
    return;
  }

  const token = request.cookies?.[authCookieName];
  if (typeof token !== "string") {
    response.status(401).json({ error: "Sign in to continue." });
    return;
  }

  try {
    const payload = jwt.verify(token, secret);
    if (typeof payload === "string" || typeof payload.sub !== "string") {
      response
        .status(401)
        .json({ error: "Your session is invalid. Sign in again." });
      return;
    }
    const authenticatedRequest = request as typeof request & {
      user?: { id: string };
    };

    authenticatedRequest.user = { id: payload.sub };
    next();
  } catch {
    response
      .status(401)
      .json({ error: "Your session has expired. Sign in again." });
  }
};
