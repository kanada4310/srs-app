import { Note, NoteType } from "@/logic/note/note";
import { NoteSortFunction, NoteSorts } from "@/logic/note/sort";
import { useMediaQuery } from "@mantine/hooks";
import clsx from "clsx";
import { t } from "i18next";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import classes from "./NoteTable.module.css";

interface NoteTableProps {
  noteSet: Note<NoteType>[];
  sort: [NoteSortFunction, boolean];
  setSort: (sort: [NoteSortFunction, boolean]) => void;
  openedNote: Note<NoteType> | undefined;
  setOpenedNote: (note: Note<NoteType> | undefined) => void;
  openModal: () => void;
}

function NoteTable({
  noteSet,
  openedNote,
  setOpenedNote,
  setSort,
  openModal,
}: NoteTableProps) {
  const [selectedNotes, setSelectedNotes] = useState<Note<NoteType>[]>([]);

  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<Note<NoteType>>
  >({
    columnAccessor: "sortField",
    sortKey: "bySortField",
    direction: "asc",
  });

  useEffect(() => {
    setSort([
      NoteSorts[sortStatus.sortKey as keyof typeof NoteSorts],
      sortStatus.direction === "asc",
    ]);
  }, [sortStatus]);

  const isTouch = useMediaQuery("(pointer: coarse)");
  const isMobile = useMediaQuery("(max-width: 50em)");

  return (
    <DataTable
      className={classes.table}
      records={noteSet}
      columns={[
        {
          accessor: "sortField",
          title: t("manage-cards.table.column-name"),
          ellipsis: true,
          width: 200,
          resizable: true,
          filtering: true,
          sortable: true,
          sortKey: "bySortField",
        },
        {
          accessor: "creationDate",
          title: t("manage-cards.table.column-creation-date"),
          render: (note) => note.creationDate.toLocaleDateString(),
          resizable: true,
          sortable: true,
          sortKey: "byCreationDate",
        },
        {
          accessor: "content.type",
          title: t("manage-cards.table.column-note-type"),
          resizable: true,
          sortable: true,
          sortKey: "byType",
        },
      ]}
      withTableBorder={false}
      withRowBorders={false}
      highlightOnHover
      borderRadius="md"
      striped="odd"
      height="100%"
      textSelectionDisabled={isTouch}
      selectionCheckboxProps={{ size: isMobile ? "sm" : "xs" }}
      selectedRecords={selectedNotes}
      onSelectedRecordsChange={setSelectedNotes}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      rowClassName={(record) =>
        clsx({
          [classes.selected]: record.id === openedNote?.id,
          [classes.row]: true,
        })
      }
      onRowClick={(row) => {
        setOpenedNote(row.record);
        if (isMobile) {
          openModal();
        }
      }}
      onRowDoubleClick={(row) => {
        setOpenedNote(row.record);
        openModal();
      }}
    />
  );
}

export default NoteTable;
