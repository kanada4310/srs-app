import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { NoteEditorProps, NoteTypeAdapter } from "@/logic/NoteTypeAdapter";
import { db } from "@/logic/db";
import { deleteImage, getImage, saveImage } from "@/logic/image/saveImage";
import { Note, NoteType } from "@/logic/note/note";
import { Button, Group, Stack } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, useState } from "react";

export const ImageOcclusionTypeAdapter: NoteTypeAdapter<NoteType.ImageOcclusion> =
  {
    createNote() {
      console.warn(
        "tried to create note of type image occlusion. Not implemented."
      );
      return Promise.resolve();
    },

    updateNote() {
      console.warn(
        "tried to update note of type image occlusion. Not implemented."
      );
      return Promise.resolve();
    },

    displayQuestion() {
      return "[Image Occlusion Card] Question";
    },

    displayAnswer() {
      return "[Image Occlusion Card] Answer";
    },

    displayNote() {
      return <span>[Image Occlusion Card] Note</span>;
    },

    getSortFieldFromNoteContent() {
      return "[Image Occlusion Card] Sort Field";
    },

    editor({
      note: _note,
      deck: _deck,
      mode: _mode,
      requestedFinish: _requestedFinish,
      setRequestedFinish: _setRequestedFinish,
    }: NoteEditorProps) {
      const note = _note as Note<NoteType.ImageOcclusion> | undefined;
      const [_imageFile, setImageFile] = useState<File | null>(null);
      const [imageUrl, setImageUrl] = useState<string | null>(null);
      const [currentImageId, setCurrentImageId] = useState<string | undefined>(
        note?.content.image
      );

      useEffect(() => {
        if (note?.content.image) {
          getImage(note.content.image).then((img) => {
            if (img) {
              setImageUrl(URL.createObjectURL(img.data));
            }
          });
        }
      }, [note?.content.image]);

      const handleImageSelect = async (file: File | null) => {
        if (file) {
          const newImageId = await saveImage(file, file.name, file.type);
          setCurrentImageId(newImageId);
          setImageUrl(URL.createObjectURL(file));
          // Update note content with new imageId
          if (note) {
            db.notes.update(note.id, {
              content: { ...note.content, image: newImageId },
            });
          }
        } else {
          // Delete image from db if it exists
          if (currentImageId) {
            await deleteImage(currentImageId);
            if (note) {
              db.notes.update(note.id, {
                content: { ...note.content, image: undefined },
              });
            }
          }
          setCurrentImageId(undefined);
          setImageUrl(null);
        }
        setImageFile(file);
      };

      if (!note) {
        return <></>;
      }

      return (
        <Stack>
          <ImageUpload
            onImageSelect={handleImageSelect}
            previewUrl={imageUrl}
          />
          {imageUrl && (
            <Group justify="center">
              <Button
                variant="outline"
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={() => handleImageSelect(null)}
              >
                {t("note.edit.delete-image")}
              </Button>
            </Group>
          )}
          {/* ここにマスキング機能のUIを追加 */}
          <span>Image Occlusion Card Editor</span>
        </Stack>
      );
    },

    deleteCard() {
      console.warn(
        "tried to delete card of type image occlusion. Not implemented."
      );
    },
  };
