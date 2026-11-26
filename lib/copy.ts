import type { Mood } from "./types";

// All user-facing sentences and allowed emoji live here so they are easy to edit in one place
export const HOME_COPY = {
  logoEmoji: "🌸",
  pitch: "Splitwise tells you who owes what. FairShare tells you whose turn it is.",
};

export const RING_CAPTIONS: Record<Mood, string> = {
  calm: "everything's soft and even ✨",
  tense: "a small cloud has appeared ☁️",
  dramatic: "episode 7: someone is covering for everyone 🎬",
};

export const TURN_FOOD_EMOJIS = ["🍜", "🧋", "🍰", "🥟", "🍢"];

export const WHOSE_TURN_LINES = [
  "they've been coasting (lovingly)",
  "the wallet has been resting long enough",
  "a gentle hint from the universe",
  "the group chat has noticed",
  "karma says it's their round",
  "their turn to be the favourite friend",
];

export const TURN_COPY = {
  yourTurnLine: "you're up next when the next round lands",
  emptyState: "Nobody has covered a round yet. Be the first hero 🌸",
  nudgeButton: "Send a gentle reminder 🕊️",
  nudgeButtonSent: "Gentle reminder sent",
};

export const NUDGE_BANNER_COPY = {
  message: "Someone is gently thinking of you. Maybe it's your turn?",
};

export const ROTATION_LOG_COPY = {
  title: "Rotation log",
  fallbackNote: "Shared round",
  emptyState: "No rounds yet, the first page is blank ✨",
};

export const EVEN_UP_COPY = {
  title: "Even up",
  placeholder: "Even up is coming in the next milestone.",
};

export const TOAST_COPY = {
  nudgeSent: "Reminder sent. Nobody will know it was you ✨",
  codeCopied: (code: string) => `Copied code #${code} ✨`,
};
