import "server-only";
import { readKV, writeKV } from "./db";
import type { SiteSettings } from "./types";

const SETTINGS_KEY = "settings";

export async function getSettings(): Promise<SiteSettings> {
  const stored = await readKV<SiteSettings | null>(SETTINGS_KEY, null);
  if (!stored) {
    throw new Error("Site settings are missing from the database.");
  }
  return stored;
}

export async function writeSettings(next: SiteSettings): Promise<void> {
  await writeKV(SETTINGS_KEY, next);
}
