import { getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const { deck } = JSON.parse(event.body || "{}");
  if (!deck) return { statusCode: 400, body: "deck is required" };

  const store = getStore("decks");
  const key = crypto.randomUUID();

  // ← ここがポイント
  await store.set(key, deck, { type: "json" }); // setJSON は無い

  return {
    statusCode: 200,
    body: JSON.stringify({ key }),
  };
};
