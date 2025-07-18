import { connectLambda, getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  connectLambda(event);
  const { deck } = JSON.parse(event.body || "{}");
  console.log("Received event body:", event.body);
  if (!deck) {
    console.error("Deck is missing from event body.");
    return { statusCode: 400, body: "deck is required" };
  }

  const store = getStore("decks");
  const key = crypto.randomUUID();

  // ← ここがポイント
  try {
    console.log("Attempting to set blob with key:", key, "and deck:", deck);
    await store.set(key, JSON.stringify(deck), { type: "json" });
    console.log("Successfully set blob.");

    return {
      statusCode: 200,
      body: JSON.stringify({ key }),
    };
  } catch (error) {
    console.error("Error in share-post function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message || "An unknown error occurred",
      }),
    };
  }
};
