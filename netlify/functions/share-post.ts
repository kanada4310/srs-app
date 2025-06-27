// netlify/functions/share-post.ts   ← 置き換え

import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  try {
    const { deck } = await req.json();
    const key = crypto.randomUUID();          // 一意キーを発行
    const store = getStore("decks");          // ストア名は自由
    await store.setJSON(key, deck);           // ここで書き込む＝ストア自動作成
    return new Response(JSON.stringify({ key }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
