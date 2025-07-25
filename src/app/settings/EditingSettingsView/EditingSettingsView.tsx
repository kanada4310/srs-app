import { Alert, Stack } from "@mantine/core";
import {
  IconCode,
  IconHighlight,
  IconInfoCircle,
  IconLink,
  IconLinkOff,
  IconList,
  IconListNumbers,
  IconStrikethrough,
  IconSubscript,
  IconSuperscript,
} from "@tabler/icons-react";
import { t } from "i18next";
import React from "react";
import { useSettings } from "../../../logic/settings/hooks/useSettings";
import { setSetting } from "../../../logic/settings/setSetting";
import Section from "../Section";
import SettingsInput from "../SettingsInput";
import classes from "./EditingSettingsView.module.css";

interface EditingSettingsViewProps {}

export default function EditingSettingsView({}: EditingSettingsViewProps) {
  const [settings] = useSettings();

  return (
    <Stack className={classes.container} gap="xl">
      <Section title={t("settings.editing.editor-options")}>
        <SettingsInput
          label={t("settings.editing.use-toolbar")}
          description={t("settings.editing.use-toolbar-description")}
          settingsKey="useToolbar"
          inputType={"checkbox"}
          checked={settings.useToolbar}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSetting("useToolbar", e.target.checked);
            if (e.target.checked) {
              setSetting("useBubbleMenu", false);
            }
          }}
        />
        <SettingsInput
          label={t("settings.editing.use-bubble-menu")}
          description={t("settings.editing-use-bubble-menu-description")}
          settingsKey="useBubbleMenu"
          inputType={"checkbox"}
          checked={settings.useBubbleMenu}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSetting("useBubbleMenu", e.target.checked);
            if (e.target.checked) {
              setSetting("useToolbar", false);
            }
          }}
        />
        <Alert color="gray" icon={<IconInfoCircle />}>
          {t("settings.editing.markdown-hint")}
        </Alert>
      </Section>
      <Section title={t("settings.editing.individual-options")}>
        <SettingsInput
          label={<IconStrikethrough />}
          description={t("settings.editing.show-strikethrough-option")}
          settingsKey="showStrikethroughOptionInEditor"
          inputType={"checkbox"}
        />
        <SettingsInput
          label={<IconHighlight />}
          description={t("settings.editing.show-highlight-option")}
          settingsKey="showHighlightOptionInEditor"
          inputType={"checkbox"}
        />
        <SettingsInput
          label={
            <>
              <IconList /> <IconListNumbers />
            </>
          }
          description={t("settings.editing.show-list-option")}
          settingsKey="showListOptionInEditor"
          inputType={"checkbox"}
        />
        <SettingsInput
          label={<IconCode />}
          description={t("settings.editing.show-code-option")}
          settingsKey="showCodeOptionInEditor"
          inputType={"checkbox"}
        />
        <SettingsInput
          label={
            <>
              <IconSubscript />
              <IconSuperscript />
            </>
          }
          description={t(
            "settings.editing.show-options-for-subscript-and-superscript"
          )}
          settingsKey="showSubAndSuperScriptOptionInEditor"
          inputType={"checkbox"}
        />
        <SettingsInput
          label={
            <>
              <IconLink />
              <IconLinkOff />
            </>
          }
          description={t("settings.editing.show-link-option")}
          settingsKey="showLinkOptionInEditor"
          inputType={"checkbox"}
        />
      </Section>
    </Stack>
  );
}
