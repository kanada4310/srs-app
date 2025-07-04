import { getAdapter } from "@/logic/NoteTypeAdapter";
import { NoteTypeLabels } from "@/logic/card/card";
import { useDeckOf } from "@/logic/deck/hooks/useDeckOf";
import { NoteType } from "@/logic/note/note";
import { Note } from "@/logic/note/note";
import { Table } from "@mantine/core";
import cx from "clsx";
import { useEffect } from "react";
import classes from "./NoteTable.module.css";

export function NoteTableItem({
  note,
  index,
  selectedIndex,
  setSelectedIndex,
  setSelectedNote,
}: {
  note: Note<NoteType>;
  index: number;
  selectedIndex: number | undefined;
  setSelectedIndex: Function;
  selectedNote: Note<NoteType> | undefined;
  setSelectedNote: Function;
}) {
  const [deck] = useDeckOf(note);

  useEffect(() => {
    if (selectedIndex === index) {
      setSelectedNote(note);
    }
  }, [selectedIndex, setSelectedNote, index, note]);

  /*const [preview, setPreview] = React.useState<string | undefined>(undefined);

  useEffect(() => {
    const preview = getUtils(card).displayPreview(card);
    if (preview instanceof Promise) {
      preview.then((preview) => setPreview(preview));
    } else {
      setPreview(preview);
    }
  }, [card]);*/

  return (
    <Table.Tr
      className={cx(classes.tr, classes.bodyTr, {
        [classes.selected]: selectedIndex === index,
      })}
      onClick={() => setSelectedIndex(index)}
    >
      <Table.Td className={classes.td}>
        {getAdapter(note).getSortFieldFromNoteContent(note.content)}
      </Table.Td>
      <Table.Td className={classes.td}>
        {NoteTypeLabels[note.content.type]}
      </Table.Td>

      <Table.Td className={classes.td}>{deck?.name ?? "?"}</Table.Td>
      <Table.Td className={classes.td}>
        {note.creationDate.toLocaleDateString()}
      </Table.Td>
    </Table.Tr>
  );
}
