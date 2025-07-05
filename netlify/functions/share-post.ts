import { getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  console.log("Function started.");
  try {
    const store = getStore("decks", { siteID: "5fbf1edb-df8b-4ed3-a58b-9d38068e80dc", token: "nfp_n5jcCy5zpb7gnkDp1EXFqq6bFKB3GLxP0cdd" });
    console.log("Store initialized successfully.");
    return { statusCode: 200, body: "Function executed successfully." };
  } catch (error) {
    console.error("Error during function execution:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message || "An unknown error occurred" }) };
  }
};