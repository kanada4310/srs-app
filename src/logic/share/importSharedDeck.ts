// src/logic/share/importSharedDeck.ts
import { db } from "../../db"; // 相対パスに合わせる
import { Deck } from "@/logic/deck/deck";

export async function importSharedDeck(deck: Deck) {
  if (!deck) return;
  const exists = await db.decks.get(deck.id);
  if (exists) return;               // 重複防止
  await db.decks.add(deck);         // 追加
}
