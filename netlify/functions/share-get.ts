// netlify/functions/share-get.ts

import { getStore } from "@netlify/blobs";

export default async (req) => {
  const key = new URL(req.url).pathname.split("/").pop();
  const store = getStore("decks");
  const deck = await store.getJSON(key!);
  if (!deck)
    return new Response("Not found", { status: 404 });
  return new Response(JSON.stringify(deck), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
