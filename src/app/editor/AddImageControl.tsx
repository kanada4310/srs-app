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
        editor?.chain().focus().run(); // Add this line
      };
    }
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        fileInputRef.current?.click();
      }}
      tabIndex={-1}
      role="button"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
    >
      <IconPhoto />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg, image/jpg, image/png, image/heic"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: "pointer",
        }}
        onChange={handleFileChange}
      />
    </button>
  );
}
