
import { Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { t } from "i18next";
import Papa from "papaparse";
import { ImportFromSourceProps } from "./ImportModal";
import FileImport from "./FileImport";
import ImportButton from "./ImportButton";
import { BasicNoteTypeAdapter } from "../../../logic/type-implementations/normal/BasicNote";

const ImportFromCSV = ({ file, setFile, fileText, setFileText, importStatus, setImportStatus, deck }: ImportFromSourceProps) => {

  const handleImport = async () => {
    if (!fileText || !deck) {
      return;
    }

    try {
      const result = Papa.parse(fileText, { header: true });

      if (result.errors.length > 0) {
        notifications.show({
          title: t("import.error-title"),
          message: t("import.csv-parse-error"),
          color: "red",
        });
        return;
      }

      const notes = result.data as { front: string; back: string }[];
      for (const note of notes) {
        await BasicNoteTypeAdapter.createNote(note, deck);
      }

      notifications.show({
        title: t("import.success-title"),
        message: t("import.success-message", { count: notes.length }),
        color: "green",
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: t("import.error-title"),
        message: t("import.error-message"),
        color: "red",
      });
    }
  };

  return (
    <Stack align="start">
      <FileImport
        file={file}
        setFile={setFile}
        setFileText={setFileText}
        acceptedFormats={".csv"}
      />
      <ImportButton
        importFunction={handleImport}
        importStatus={importStatus}
        setImportStatus={setImportStatus}
        disabled={!file || !fileText || !deck}
      />
    </Stack>
  );
};

export default ImportFromCSV;
