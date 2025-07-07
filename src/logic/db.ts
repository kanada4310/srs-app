import Dexie, { Table } from "dexie";
import "dexie-export-import";
import dexieCloud from "dexie-cloud-addon";
import { Card } from "./card/card";
import { Deck } from "./deck/deck";
import { NoteType } from "./note/note";
import { Note } from "./note/note";
import { Settings, SettingsValues } from "./settings/Settings";
import { DeckStatistics } from "./statistics";
import { Image } from "./image/image";

export class Database extends Dexie {
  decks!: Table<Deck>;
  cards!: Table<Card<NoteType>>;
  notes!: Table<Note<NoteType>>;
  statistics!: Table<DeckStatistics>;
  settings!: Table<Settings<keyof SettingsValues>>;
  images!: Table<Image>;

  constructor() {
    super("swallow_db", { addons: [dexieCloud], cache: "disabled" });
    this.version(16).stores({
      cards: "id, note, deck",
      decks: "id, *cards, *notes, *subDecks, *superDecks",
      notes: "id, deck, sortField",
      statistics: "[deck+day], day",
      settings: "key",
      images: "id",
    });
    this.open();
  }
}

export const db = new Database();

db.cloud.configure({
  databaseUrl: "https://zl38577hf.dexie.cloud",
  tryUseServiceWorker: true,
  customLoginGui: true,
});
