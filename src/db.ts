import Dexie, { Table } from "dexie";
import { Deck } from "./logic/deck/deck";

// Deck 型は既にプロジェクト内にあるので再利用
export class AppDB extends Dexie {
  // ← ここで decks テーブルを宣言
  decks!: Table<Deck, string>; // 第2型引数は主キーの型

  constructor() {
    super("app-db");
    this.version(1).stores({
      decks: "&id,name" // id を主キーにする例（あとで好きに変更OK）
    });
  }
}

export const db = new AppDB();
