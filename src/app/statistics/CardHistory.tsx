import { NoteType } from "@/logic/note/note";
import { AreaChart } from "@mantine/charts";
import React, { useMemo } from "react";
import { Card } from "../../logic/card/card";

interface CardHistoryProps {
  card?: Card<NoteType>;
}

export default function CardHistory({ card }: CardHistoryProps) {
  const data = useMemo(() => {
    if (card) {
      return card.history.map((h) => {
        return {
          date: h.review.getTime(),
          rating: h.rating,
        };
      });
    }
    return [];
  }, [card]);

  return (
    <AreaChart
      h={300}
      data={data}
      series={[{ name: "rating", color: "forest" }]}
      dataKey="date"
      curveType="monotone"
      withTooltip={true}
      gridAxis="x"
      yAxisProps={{
        domain: [1, 4],
        tickCount: 4,
        tickFormatter: (value) => {
          switch (value) {
            case 1:
              return t("statistics.card-rating.again");
            case 2:
              return t("statistics.card-rating.hard");
            case 3:
              return t("statistics.card-rating.good");
            case 4:
              return t("statistics.card-rating.easy");
          }
          return "";
        },
      }}
      xAxisProps={{
        domain: ["dataMin", new Date(Date.now()).getTime()],
        scale: "linear",
        tickFormatter: (value) => new Date(value).toLocaleDateString(),
      }}
      connectNulls
    />
  );
}
