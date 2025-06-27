// src/db.ts
import Dexie from "dexie";

/* ↓アプリ全体で共有するデータベース（最小構成）*/
export const db = new Dexie("SkolaDB");
db.version(1).stores({
  decks: "id"        // 主キーだけ設定
});
