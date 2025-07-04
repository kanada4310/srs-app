import { getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  const { deck } = JSON.parse(event.body || "{}");
  console.log("Received event body:", event.body);
  if (!deck) {
    console.error("Deck is missing from event body.");
    return { statusCode: 400, body: "deck is required" };
  }

  const store = getStore("decks", { siteID: "5fbf1edb-df8b-4ed3-a58b-9d38068e80dc", token: "nfp_n5jcCy5zpb7gnkDp1EXFqq6bFKB3GLxP0cdd" });
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
