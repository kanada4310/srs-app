import { randomUUID } from "node:crypto";
import { getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const { deck } = JSON.parse(event.body || "{}");
  const key = randomUUID().slice(0, 6).toUpperCase();
  await getStore("decks").setJSON(key, deck);
  return { statusCode: 200, body: JSON.stringify({ key }) };
};
