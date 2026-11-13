export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AppView =
  | "overview"
  | "scanner"
  | "results"
  | "history"
  | "assistant"
  | "settings";

export type ApiStatus = "checking" | "ready" | "needs-config" | "unavailable";
