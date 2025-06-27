import { getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const key = event.path.split("/").pop()!;
  const deck = await getStore("decks").getJSON(key);
  if (!deck) return { statusCode: 404, body: "Not found" };
  return { statusCode: 200, body: JSON.stringify(deck) };
};
