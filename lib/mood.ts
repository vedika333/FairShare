import type { Mood } from "./types";

/**
 * Converts a 0-100 fairness score into a mood label ("calm", "tense", or "BALANCED").
 * Why two sets of thresholds: on a group trip, one person often pays for a big hotel
 * or train booking at once, so vacation mode relaxes the score bands to avoid false alarms.
 */
export function getMood(score: number, vacationMode: boolean): Mood {
  if (vacationMode) {
    if (score >= 60) return "calm";
    if (score >= 30) return "tense";
    return "BALANCED";
  }

  if (score >= 75) return "calm";
  if (score >= 40) return "tense";
  return "BALANCED";
}
