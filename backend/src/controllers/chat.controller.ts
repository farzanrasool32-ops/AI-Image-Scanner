import type { RequestHandler } from "express";
import { answerImageQuestion, geminiFailure } from "../services/geminiService";
import { convertImageToJpeg } from "../services/imageProcessing";
import type { ChatTurn } from "../types/analysis";

function isChatTurn(value: unknown): value is ChatTurn {
  if (!value || typeof value !== "object") return false;
  const turn = value as Partial<ChatTurn>;
  return (
    (turn.role === "user" || turn.role === "assistant") &&
    typeof turn.text === "string"
  );
}

export const chatWithImage: RequestHandler = async (request, response) => {
  if (!request.file) {
    response
      .status(400)
      .json({ error: "Attach an image to start a conversation." });
    return;
  }
  const question =
    typeof request.body.question === "string"
      ? request.body.question.trim()
      : "";
  if (!question || question.length > 2000) {
    response
      .status(400)
      .json({ error: "Enter a question of 1–2,000 characters." });
    return;
  }

  let turns: unknown;
  try {
    turns = JSON.parse(request.body.turns || "[]");
  } catch {
    response
      .status(400)
      .json({ error: "Conversation history must be valid JSON." });
    return;
  }
  if (!Array.isArray(turns) || turns.length > 20 || !turns.every(isChatTurn)) {
    response
      .status(400)
      .json({ error: "Conversation history is invalid or too long." });
    return;
  }

  try {
    const jpeg = await convertImageToJpeg(request.file.buffer);
    const answer = await answerImageQuestion(jpeg, question, turns);
    response.json({ answer });
  } catch (error) {
    console.error("Image chat failed:", error);
    const failure = geminiFailure(error, "chat");
    response.status(failure.status).json({ error: failure.error });
  }
};
