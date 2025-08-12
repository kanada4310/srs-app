import { RichTextEditor } from "@mantine/tiptap";
import { IconPhoto } from "@tabler/icons-react";
import { Editor } from "@tiptap/react";
import React, { useRef, useEffect } from "react";

interface AddImageControlProps {
  editor: Editor | null;
}

export default function AddImageControl({ editor }: AddImageControlProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log(
      "File input mounted/unmounted:",
      fileInputRef.current ? "mounted" : "unmounted"
    );

    const currentInput = fileInputRef.current;
    if (currentInput) {
      const nativeChangeHandler = (_event: Event) => {
        console.log("Native change event fired!");
        // You might want to call handleFileChange here directly if the React onChange is truly not firing
        // handleFileChange(event as React.ChangeEvent<HTMLInputElement>);
      };
      currentInput.addEventListener("change", nativeChangeHandler);

      return () => {
        currentInput.removeEventListener("change", nativeChangeHandler);
      };
    }
  }, [fileInputRef.current]);

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
        editor?.chain().focus().run();
      };
    }
  };

  return (
    <>
      <RichTextEditor.Control
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation(); // Add this line
          fileInputRef.current?.click();
        }}
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
