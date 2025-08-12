import { RichTextEditor } from "@mantine/tiptap";
import { IconPhoto } from "@tabler/icons-react";
import { Editor } from "@tiptap/react";
import React, { useRef } from "react";

interface AddImageControlProps {
  editor: Editor | null;
}

export default function AddImageControl({ editor }: AddImageControlProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("Selected file:", file);
    if (file) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onloadend = () => {
        const data = fileReader.result;
        console.log("Base64 Image Data:", data);
        editor?.commands.insertImage({ src: data as string });
        editor?.commands.focus();
      };
    }
  };

  const handleControlClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <RichTextEditor.Control
        onClick={handleControlClick}
        tabIndex={-1}
        role="button"
      >
        <IconPhoto />
      </RichTextEditor.Control>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg, image/jpg, image/png, image/heic"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </>
  );
}
