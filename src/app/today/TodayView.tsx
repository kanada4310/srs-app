import { Center, Stack, Title } from "@mantine/core";
import { t } from "i18next";
import React from "react";
import { AppHeaderContent } from "../shell/Header/Header";

function TodayView({}: {}) {
  return (
    <Stack>
      <AppHeaderContent>
        <Title order={3}>
          <Center>{t("today.title")}</Center>
        </Title>
      </AppHeaderContent>
      {t("today.planned-feature-message")}
    </Stack>
  );
}

export default TodayView;
