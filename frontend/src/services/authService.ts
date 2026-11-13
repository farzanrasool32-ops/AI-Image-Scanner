import type { AuthCredentials, User } from "../types/user.types";
import { apiBase } from "./api";
import { fetchApi, getApiError } from "./apiErrors";

function isUser(value: unknown): value is User {
  if (!value || typeof value !== "object") return false;
  const user = value as Partial<User>;
  return (
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string"
  );
}

async function requestUser(path: string, body?: object): Promise<User> {
  const response = await fetchApi(`${apiBase}/api/auth/${path}`, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) throw new Error(await getApiError(response));

  const payload: unknown = await response.json();
  if (
    !payload ||
    typeof payload !== "object" ||
    !("user" in payload) ||
    !isUser(payload.user)
  ) {
    throw new Error("The server returned an invalid account response.");
  }
  return payload.user;
}

export async function register(name: string, credentials: AuthCredentials) {
  return requestUser("signup", { ...credentials, name });
}

export async function logIn(credentials: AuthCredentials) {
  return requestUser("login", credentials);
}

export async function getCurrentUser(): Promise<User | null> {
  const response = await fetchApi(`${apiBase}/api/auth/me`);
  if (response.status === 401) return null;
  if (!response.ok) throw new Error(await getApiError(response));

  const payload: unknown = await response.json();
  if (
    !payload ||
    typeof payload !== "object" ||
    !("user" in payload) ||
    !isUser(payload.user)
  ) {
    throw new Error("The server returned an invalid account response.");
  }
  return payload.user;
}

export async function logOut() {
  const response = await fetchApi(`${apiBase}/api/auth/logout`, {
    method: "POST",
  });
  if (!response.ok) throw new Error(await getApiError(response));
}
