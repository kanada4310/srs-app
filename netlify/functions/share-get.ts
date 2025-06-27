import { getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  // URL 末尾のキーを取り出す 例: /api/share/abc → "abc"
  const key = event.path.split("/").pop()!;

  // ストア (名前空間) を開く
  const store = getStore("decks");

  // JSON を取得  ※ getJSON ではなく get(..., { type: "json" })
  const deck = await store.get(key, { type: "json" });

  if (!deck) {
    return { statusCode: 404, body: "Not found" };
  }

  return {
    statusCode: 200,
    // store.get で返るのは object なのでそのまま文字列化
    body: JSON.stringify(deck),
    headers: { "Content-Type": "application/json" },
  };
};
