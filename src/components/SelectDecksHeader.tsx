import { Deck } from "@/logic/deck/deck";
import { Select, Stack, Text } from "@mantine/core";
import { IconCards } from "@tabler/icons-react";
import { t } from "i18next";
import { useParams } from "react-router-dom";

interface SelectDecksHeaderProps {
  label: string;
  disableAll?: boolean;
  decks?: Deck[];
  onSelect: (deckId: string | null) => void;
}

export default function SelectDecksHeader({
  decks,
  label,
  disableAll,
  onSelect,
}: SelectDecksHeaderProps) {
  const deckId = useParams().deckId || "";
  return (
    <Stack gap="0.25rem">
      <Text fz="sm" c="dimmed">
        {label}
      </Text>
      <Select
        placeholder={t("select-decks-header.pick-one")}
        searchable
        nothingFoundMessage={t("select-decks-header.no-decks-found")}
        leftSection={<IconCards size={16} />}
        data={(disableAll
          ? []
          : [{ value: "", label: t("global.all") }]
        ).concat(
          decks?.map((deck) => ({
            value: deck.id,
            label: deck.name,
          })) ?? []
        )}
        value={deckId}
        onChange={(value) => onSelect(value)}
      />
    </Stack>
  );
}
