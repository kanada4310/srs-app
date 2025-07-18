import { getAdapter } from "@/logic/NoteTypeAdapter";
import { getDeck } from "@/logic/deck/getDeck";
import { getSuperDecks } from "@/logic/deck/getSuperDecks";
import { useDecks } from "@/logic/deck/hooks/useDecks";
import { useNotesWith } from "@/logic/note/hooks/useNotesWith";
import { NoteType } from "@/logic/note/note";
import { Note } from "@/logic/note/note";
import { NoteSorts } from "@/logic/note/sort";
import { useShowShortcutHints } from "@/logic/settings/hooks/useShowShortcutHints";
import { Group, Kbd, UnstyledButton, rem } from "@mantine/core";
import { useDebouncedState, useOs } from "@mantine/hooks";
import { Spotlight, spotlight } from "@mantine/spotlight";
import { IconCards, IconSearch, IconSquare } from "@tabler/icons-react";
import cx from "clsx";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Spotlight.module.css";
interface NoteWithPreview extends Note<NoteType> {
  breadcrumb: string[];
}

const useSearchNote = (filter: string) => {
  const [filteredNotes, setFilteredNotes] = useState<NoteWithPreview[]>([]);
  const [notes] = useNotesWith(
    (n) =>
      n
        .toArray()
        .then((m) =>
          m
            .filter((note) =>
              getAdapter(note)
                .getSortFieldFromNoteContent(note.content)
                .toLowerCase()
                .includes(filter.toLowerCase())
            )
            .sort(NoteSorts.bySortField(1))
        ),
    [filter]
  );
  useEffect(() => {
    async function filterNotes(notes: Note<NoteType>[]) {
      const decksPromises = notes?.map(async (note) => {
        const deck = await getDeck(note.deck);
        const superDecks = await getSuperDecks(deck);
        return [
          ...(superDecks[0] || []).map((sd) => sd.name),
          deck?.name || "Empty",
        ];
      });
      const decks = await Promise.all(decksPromises);
      setFilteredNotes(
        notes.map((note, i) => ({
          ...note,
          breadcrumb: decks[i],
        }))
      );
    }
    filterNotes(notes || []);
  }, [notes]);

  return filteredNotes;
};

export default function SpotlightCard({
  minimalMode,
}: { minimalMode: boolean }) {
  const navigate = useNavigate();
  const os = useOs();
  const showShortcutHints = useShowShortcutHints();

  const [filter, setFilter] = useDebouncedState("", 250);
  const [filteredDecks] = useDecks();
  const filteredNotes = useSearchNote(filter);

  const possibleActions = [
    {
      group: "Decks",
      actions: [
        ...(filteredDecks || []).map((deck) => {
          return {
            id: deck.id,
            label: deck.name,
            description: deck.description,
            onClick: () => navigate(`/deck/${deck.id}`),
            leftSection: (
              <IconCards
                style={{ width: rem(24), height: rem(24) }}
                stroke={1.5}
              />
            ),
          };
        }),
      ],
    },
    {
      group: "Notes",
      actions: [
        ...filteredNotes.map((note) => {
          return {
            id: note.id,
            label: getAdapter(note).getSortFieldFromNoteContent(note.content),
            description: note.breadcrumb.join(" > "),
            onClick: () => navigate(`/deck/${note.deck}`),
            leftSection: (
              <IconSquare
                style={{ width: rem(24), height: rem(24) }}
                stroke={1.5}
              />
            ),
          };
        }),
      ],
    },
  ];

  return (
    <>
      <Group justify="space-between">
        <UnstyledButton
          onClick={spotlight.open}
          className={cx({
            [classes.spotlightButton]: true,
            [classes.minimalMode]: minimalMode,
          })}
          variant="default"
          w="100%"
          c="dimmed"
        >
          {minimalMode ? (
            <IconSearch size={14} className={classes.spotlightButtonIcon} />
          ) : (
            <>
              <span className={classes.spotlightButtonSection}>
                <IconSearch size={14} className={classes.spotlightButtonIcon} />
                {t("spotlight.search-placeholder")}
              </span>
              {showShortcutHints && (
                <span className={classes.spotlightButtonSection}>
                  <Kbd c="dimmed" size="xs">
                    {os === "macos" ? "⌘" : "Ctrl"}
                  </Kbd>{" "}
                  +{" "}
                  <Kbd c="dimmed" size="xs">
                    K
                  </Kbd>
                </span>
              )}
            </>
          )}
        </UnstyledButton>
      </Group>
      <Spotlight
        className={classes.spotlight}
        actions={possibleActions}
        closeOnClickOutside
        nothingFound={t("spotlight.no-results")}
        highlightQuery
        onQueryChange={setFilter}
        limit={10}
        scrollable={true}
        searchProps={{
          leftSection: <IconSearch size={18} stroke={2} />,
          placeholder: t("spotlight.search-placeholder"),
        }}
        transitionProps={{ transition: "pop", duration: 100 }}
      />
    </>
  );
}
