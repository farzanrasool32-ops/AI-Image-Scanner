import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import UserModel from "../models/User";
import {
  authCookieName,
  authCookieOptions,
  createAuthToken,
  getAuthSecret,
} from "../services/authTokens";
import { isDatabaseReady } from "../services/database";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isDuplicateEmailError(error: unknown) {
  return (
    !!error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === 11000
  );
}

function unavailable(response: Parameters<RequestHandler>[1]) {
  if (!isDatabaseReady()) {
    response
      .status(503)
      .json({
        error: "Account services are unavailable until MongoDB is connected.",
      });
    return true;
  }
  if (!getAuthSecret()) {
    response
      .status(503)
      .json({ error: "Authentication is not configured on the server." });
    return true;
  }
  return false;
}

function publicUser(user: {
  _id: { toString(): string };
  name: string;
  email: string;
}) {
  return { id: user._id.toString(), name: user.name, email: user.email };
}

function setSessionCookie(
  response: Parameters<RequestHandler>[1],
  userId: string,
) {
  const secret = getAuthSecret();
  if (!secret) {
    response
      .status(503)
      .json({ error: "Authentication is not configured on the server." });
    return false;
  }
  response.cookie(
    authCookieName,
    createAuthToken(userId, secret),
    authCookieOptions,
  );
  return true;
}

export const signUp: RequestHandler = async (request, response, next) => {
  if (unavailable(response)) return;

  const body =
    request.body &&
    typeof request.body === "object" &&
    !Array.isArray(request.body)
      ? (request.body as Record<string, unknown>)
      : {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || name.length > 80) {
    response.status(400).json({ error: "Enter a name of 1–80 characters." });
    return;
  }
  if (email.length > 254 || !emailPattern.test(email)) {
    response.status(400).json({ error: "Enter a valid email address." });
    return;
  }
  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    response
      .status(400)
      .json({
        error:
          "Password must be at least 8 characters and no more than 72 bytes.",
      });
    return;
  }

  try {
    const existingUser = await UserModel.findOne({ email })
      .select("_id")
      .lean();
    if (existingUser) {
      response
        .status(409)
        .json({ error: "An account with this email already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await UserModel.create({ name, email, passwordHash });
    if (!setSessionCookie(response, user._id.toString())) return;
    response.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      response
        .status(409)
        .json({ error: "An account with this email already exists." });
      return;
    }
    next(error);
  }
};

export const logIn: RequestHandler = async (request, response, next) => {
  if (unavailable(response)) return;

  const body =
    request.body &&
    typeof request.body === "object" &&
    !Array.isArray(request.body)
      ? (request.body as Record<string, unknown>)
      : {};
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    response.status(400).json({ error: "Enter your email and password." });
    return;
  }

  try {
    const user = await UserModel.findOne({ email }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      response.status(401).json({ error: "Email or password is incorrect." });
      return;
    }
    if (!setSessionCookie(response, user._id.toString())) return;
    response.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

export const logOut: RequestHandler = (_request, response) => {
  response.clearCookie(authCookieName, {
    httpOnly: authCookieOptions.httpOnly,
    secure: authCookieOptions.secure,
    sameSite: authCookieOptions.sameSite,
    path: authCookieOptions.path,
  });
  response.json({ message: "Signed out." });
};

export const getCurrentUser: RequestHandler = async (
  request,
  response,
  next,
) => {
  if (unavailable(response)) return;
  try {
    const user = await UserModel.findById(request.user?.id);
    if (!user) {
      response.clearCookie(authCookieName, {
        httpOnly: authCookieOptions.httpOnly,
        secure: authCookieOptions.secure,
        sameSite: authCookieOptions.sameSite,
        path: authCookieOptions.path,
      });
      response
        .status(401)
        .json({ error: "Your account could not be found. Sign in again." });
      return;
    }
    response.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};
