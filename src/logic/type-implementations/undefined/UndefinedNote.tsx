import { NoteTypeAdapter } from "@/logic/NoteTypeAdapter";
import { NoteType } from "@/logic/note/note";

function UndefinedNoteEditor() {
  return <span>Undefined Card Editor</span>;
}

export const UndefinedNoteTypeAdapter: NoteTypeAdapter<NoteType.Undefined> = {
  createNote() {
    console.warn("tried to create note of type undefined. Not possible.");
    return Promise.resolve();
  },

  updateNote() {
    console.warn("tried to update note of type undefined. Not possible.");
    return Promise.resolve();
  },

  displayQuestion() {
    return "[Undefined Card] Question";
  },

  displayAnswer() {
    return "[Undefined Card] Answer";
  },

  displayNote() {
    return <span>[Undefined Card] Note</span>;
  },

  getSortFieldFromNoteContent() {
    return "[Undefined Card] Sort Field";
  },

  editor: UndefinedNoteEditor,

  deleteCard() {
    console.warn("tried to delete card of type undefined. Not possible.");
  },
};
