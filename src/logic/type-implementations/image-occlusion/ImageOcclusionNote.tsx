import ImageUpload from "@/components/ImageUpload/ImageUpload";
import { NoteEditorProps, NoteTypeAdapter } from "@/logic/NoteTypeAdapter";
import { db } from "@/logic/db";
import { deleteImage, getImage, saveImage } from "@/logic/image/saveImage";
import { Note, NoteType } from "@/logic/note/note";
import { Button, Group, Stack } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, useRef, useState } from "react";
import { Occlusion } from "./Occlusion";
import { ImageOcclusionNoteContent } from "./types";

function ImageOcclusionNoteEditor({
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
  const [occlusions, setOcclusions] = useState<Occlusion[]>(
    note?.content.occlusions || []
  );

  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [currentRect, setCurrentRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [selectedOcclusionId, setSelectedOcclusionId] = useState<string | null>(
    null
  );
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (note?.content.image) {
      getImage(note.content.image).then((img) => {
        if (img) {
          setImageUrl(URL.createObjectURL(img.data));
        }
      });
    }
  }, [note?.content.image]);

  useEffect(() => {
    // Update note content with occlusions
    if (note) {
      db.notes.update(note.id, {
        content: {
          ...note.content,
          type: NoteType.ImageOcclusion,
          occlusions: occlusions,
        } as ImageOcclusionNoteContent,
      });
    }
  }, [occlusions, note]);

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
      setOcclusions([]); // Clear occlusions when image is removed
    }
    setImageFile(file);
  };

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if an existing occlusion was clicked
    const clickedOcclusion = occlusions.find(
      (occ) =>
        x >= occ.x &&
        x <= occ.x + occ.width &&
        y >= occ.y &&
        y <= occ.y + occ.height
    );

    if (clickedOcclusion) {
      setSelectedOcclusionId(clickedOcclusion.id);
      setIsMoving(true);
      setStartPoint({ x: e.clientX, y: e.clientY }); // Use clientX/Y for moving
    } else {
      setSelectedOcclusionId(null);
      setIsDrawing(true);
      setStartPoint({ x, y });
      setCurrentRect({ x, y, width: 0, height: 0 });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();

    if (isDrawing && startPoint) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newX = Math.min(startPoint.x, x);
      const newY = Math.min(startPoint.y, y);
      const newWidth = Math.abs(x - startPoint.x);
      const newHeight = Math.abs(y - startPoint.y);

      setCurrentRect({ x: newX, y: newY, width: newWidth, height: newHeight });
    } else if (isMoving && selectedOcclusionId && startPoint) {
      const dx = e.clientX - startPoint.x;
      const dy = e.clientY - startPoint.y;

      setOcclusions((prev) =>
        prev.map((occ) =>
          occ.id === selectedOcclusionId
            ? { ...occ, x: occ.x + dx, y: occ.y + dy } // Update position
            : occ
        )
      );
      setStartPoint({ x: e.clientX, y: e.clientY }); // Update start point for continuous dragging
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsMoving(false);
    setStartPoint(null);
    if (currentRect && currentRect.width > 0 && currentRect.height > 0) {
      setOcclusions((prev) => [
        ...prev,
        { id: Math.random().toString(), ...currentRect },
      ]);
    }
    setCurrentRect(null);
  };

  const handleDeleteOcclusion = () => {
    if (selectedOcclusionId) {
      setOcclusions((prev) =>
        prev.filter((occ) => occ.id !== selectedOcclusionId)
      );
      setSelectedOcclusionId(null);
    }
  };

  if (!note) {
    return <></>;
  }

  return (
    <Stack>
      <ImageUpload onImageSelect={handleImageSelect} previewUrl={imageUrl} />
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
          {selectedOcclusionId && (
            <Button
              variant="outline"
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={handleDeleteOcclusion}
            >
              {t("note.edit.delete-occlusion")}
            </Button>
          )}
        </Group>
      )}

      {imageUrl && (
        <div
          ref={imageContainerRef}
          style={{
            position: "relative",
            display: "inline-block",
            border: "1px solid #ccc",
          }}
        >
          <img
            src={imageUrl}
            alt="Occlusion target"
            style={{ maxWidth: "100%" }}
          />
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "auto",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // End drawing/moving if mouse leaves the area
          >
            <title>Image Occlusion Drawing Area</title>
            {occlusions.map((occ) => (
              <rect
                key={occ.id}
                x={occ.x}
                y={occ.y}
                width={occ.width}
                height={occ.height}
                fill="black"
                opacity="0.5"
                stroke={occ.id === selectedOcclusionId ? "yellow" : "red"}
                strokeWidth="2"
              />
            ))}
            {currentRect && (
              <rect
                x={currentRect.x}
                y={currentRect.y}
                width={currentRect.width}
                height={currentRect.height}
                fill="blue"
                opacity="0.0"
                stroke="blue"
                strokeWidth="2"
                strokeDasharray="5 5"
              />
            )}
          </svg>
        </div>
      )}
      <span>Image Occlusion Card Editor</span>
    </Stack>
  );
}

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

    editor: ImageOcclusionNoteEditor,

    deleteCard() {
      console.warn(
        "tried to delete card of type image occlusion. Not implemented."
      );
    },
  };
