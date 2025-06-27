// netlify/functions/share-post.ts  ★置き換え
import { getStore } from "@netlify/blobs";

export default async (req) => {
  const { deck } = await req.json();             // POST 本文
  const key  = crypto.randomUUID();              // 一意キー
  await getStore("decks").setJSON(key, deck);    // 初回でストア自動生成
  return new Response(JSON.stringify({ key }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
