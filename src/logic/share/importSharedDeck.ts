// src/logic/share/importSharedDeck.ts
import { db } from "@/db";          // Dexie のインスタンス
import { Deck } from "@/logic/deck/deck";

/**
 * 受け取ったデッキ JSON を Dexie の decks テーブルに追加する
 * 同じ ID が既にあれば何もしない
 */
export async function importSharedDeck(deck: Deck) {
  if (!deck) return;
  const exists = await db.decks.get(deck.id);
  if (exists) return;
  await db.decks.add(deck);
}
